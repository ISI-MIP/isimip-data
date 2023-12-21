Production setup
================

## Prerequisites

First install the basic prerequisites. For openSUSE Leap 15 use:

```bash
# as root
zypper install python3 python3-devel
zypper install postgresql10 postgresql10-server postgresql10-contrib postgresql10-devel
zypper install nginx
zypper install git git-crypt
```

## PostgreSQL

Configure the database to allow for username/password connections:

```
# in /var/lib/pgsql/data/pg_hba.conf
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

Start the database:

```
systemctl enable postgresql
systemctl start postgresql
```

Login to the database as `postgres` user and create a `isimip_data_prod` and a `isimip_metadata_prod` user:

```sql
CREATE USER isimip_data_prod WITH ENCRYPTED PASSWORD 'SECRET_ISIMIP_DATA_PASSWORD' CREATEDB;
CREATE DATABASE isimip_data_prod WITH ENCODING 'UTF-8' OWNER isimip_data_prod;

CREATE USER isimip_metadata_prod WITH ENCRYPTED PASSWORD 'SECRET_ISIMIP_METADATA_PASSWORD' CREATEDB;
CREATE DATABASE isimip_metadata_prod WITH ENCODING 'UTF-8' OWNER isimip_metadata_prod;
```

Now the database is ready for this application as well as the [isimip-publisher](https://github.com/ISI-MIP/isimip-publisher). After the `datasets` and `files` tables are created in `isimip_metadata` run the following to let the `isimip_data` access the tables (read-only).

```bash
# as postgres
psql isimip_metadata -c 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO isimip_data_prod;'
```

## Python environment

In production, you should create a dedicated user the application. All steps for the installation, which do not need root access, should be done using this user. We assume this user is called `isimip`, it’s home is `/home/isimip` and the application is located in `/home/isimip/isimip-data`. The user can be created using:

```bash
# as root
useradd -u 2000 -c 'ISIMIP' -s /bin/bash -m isimip
```

Using this user, create a virtual env in the home of this user:

```bash
# as isimip
python3 -m venv env

echo "source ~/env/bin/activate" >> ~/.bashrc
. ~/.bashrc
```

## Django application

Clone the repository:

```bash
# as isimip
git clone https://github.com/ISI-MIP/isimip-data
```

Install production dependencies:

```bash
# as isimip
cd ~/isimip-data
pip install --upgrade pip setuptools wheel
pip install -r requirements/production.txt
```

The production settings are protected using [git-crypt](https://www.agwa.name/projects/git-crypt/). Copy the secret `.gitkey` file to the repository directory on the server and unlock the files:

```
git-crypt unlock .gitkey
```

Link the unlocked production settings to `config/settings/local.py`.

```bash
ln -s environments/production.py config/settings/local.py
```

Setup database tables and admin user:

```bash
# as isimip, in /home/isimip/isimip-data
./manage.py migrate
./manage.py createsuperuser
```

#### Front end

Install [nvm](https://github.com/nvm-sh/nvm) for the `isimip` user:

```bash
# as isimip
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.bashrc
```

Install the front-end dependencies and build the static files using:

```bash
# as isimip
nvm install
npm install
npm run build:prod
```

#### Gunicorn setup

Systemd will launch the Gunicorn process on startup and keep running. Create a systemd service file (you will need root/sudo permissions for that):

```systemd
[Unit]
Description=data.isimip.org gunicorn daemon
After=network.target

[Service]
User=isimip
Group=isimip

WorkingDirectory=/srv/www/prod

LogsDirectory=django/prod gunicorn/prod
RuntimeDirectory=gunicorn/prod

Environment=GUNICORN_BIN=env/bin/gunicorn
Environment=GUNICORN_WORKER=3
Environment=GUNICORN_PORT=9000
Environment=GUNICORN_TIMEOUT=120
Environment=GUNICORN_PID_FILE=/run/gunicorn/prod/pid
Environment=GUNICORN_ACCESS_LOG_FILE=/var/log/gunicorn/prod/access.log
Environment=GUNICORN_ERROR_LOG_FILE=/var/log/gunicorn/prod/error.log

ExecStart=/bin/sh -c '${GUNICORN_BIN} \
  --workers ${GUNICORN_WORKER} \
  --pid ${GUNICORN_PID_FILE} \
  --bind localhost:${GUNICORN_PORT} \
  --access-logfile ${GUNICORN_ACCESS_LOG_FILE} \
  --error-logfile ${GUNICORN_ERROR_LOG_FILE} \
  config.wsgi:application'

ExecReload=/bin/sh -c '/usr/bin/pkill -HUP -F ${GUNICORN_PID_FILE}'

ExecStop=/bin/sh -c '/usr/bin/pkill -TERM -F ${GUNICORN_PID_FILE}'

[Install]
WantedBy=multi-user.target
```

This service needs to be started and enabled like any other service:

```bash
# as root
systemctl daemon-reload
systemctl enable isimip-data
systemctl start isimip-data
systemctl status isimip-data
```

#### NGINX

Assuming that the virtual host with a working certificate already exists, update the NGINX configuration as follows (again with root/sudo permissions):

```
server {
    server_name data.isimip.org;

    ...

    root /srv/www/htdocs;
    index index.html;

    client_max_body_size 32M;

    proxy_read_timeout 120;
    proxy_connect_timeout 120;
    proxy_send_timeout 120;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_pass http://localhost:9000/;
    }
    location /static/ {
        add_header "Access-Control-Allow-Origin" *;
        alias /home/isimip/prod/static_root/;
    }
    location /media/ {
        alias /home/isimip/prod/media_root/;
    }

    ...
}
```

Restart nginx:

```
systemctl restart nginx
```
