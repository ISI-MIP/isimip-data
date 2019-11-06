Production setup
================

## Prerequisites

First install the basic prerequisites from your linux distribution. For openSUSE Leap 15 use:

```bash
# as root
zypper install python3 python3-devel
zypper install postgresql10 postgresql10-server postgresql10-contrib postgresql10-devel
zypper install nginx
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

Login to the database as `postgres` user and create a `isimip_data` and a `isimip_metadata` user:

```sql
CREATE USER isimip_data WITH ENCRYPTED PASSWORD 'ISIMIP_DATA_PASSWORD' CREATEDB;
CREATE DATABASE isimip_data WITH ENCODING 'UTF-8' OWNER isimip_data;

CREATE USER isimip_metadata WITH ENCRYPTED PASSWORD 'ISIMIP_METADATA_PASSWORD' CREATEDB;
CREATE DATABASE isimip_metadata WITH ENCODING 'UTF-8' OWNER isimip_metadata;
```

Now the database is ready for this application as well as the [isimip-publisher](https://github.com/ISI-MIP/isimip-publisher). After the `datasets` and `files` tables are created in `isimip_metadata` run the following to let the `isimip_data` access the tables (read-only).

```bash
# as postgres
psql isimip_metadata -c 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO isimip_data;'
```

## Python environment

In production, you should create a dedicated user the application. All steps for the installation, which do not need root access, should be done using this user. We assume this user is called `isimip`, it’s home is `/home/isimip` and the application is located in `/home/isimip/isimip-data`. The user can be created using:

```bash
# as root
useradd -u 2000 -c 'ISIMIP' -s /bin/bash -m isimip
```

Create a directory for the logs:

```bash
mkdir -p /var/log/django/isimip
chown isimip:isimip /var/log/django/isimip
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
cd ~/isimip-
pip install --upgrade pip setuptools wheel
pip install -r requirements/prod.txt
```

Create the local configuration file `.env`:

```bash
SECRET_KEY=<a secret random string>
DEBUG=True
ALLOWED_HOSTS=data.isimip.org

# database connection for the django database
DATABASE=postgresql://<user>:<pass>@<host>/<db>

# database connection for the django database
DATABASE_METADATA=postgresql://<user>:<pass>@<host>/<db>

FILES_BASE_URL=http://files.isimip.org/%(simulation_round)s/%(product)s/%(sector)s/%(model)s/

LOG_LEVEL=INFO
LOG_DIR=/var/log/django/isimip
```

Setup database tables and admin user:

```bash
# as isimip, in /home/isimip/isimip-data
./manage.py migrate
./manage.py createsuperuser
```

#### Front end

If nodejs is not desired on the prodction system, you can also perform the following steps on a different machine and copy the `/static` directory to `~isimip/isimip-data/static` on the server.

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

#### Setup logs

Two directories are needed to hold the log files. These can be created with `systemd-tmpfiles`. Create a file in `/etc/tempfiles.d/isimip-data.conf` with root/sudo permissions:

```
# /etc/tempfiles.d/isimip-data.conf
d /var/log/django/isimip-data    750 isimip isimip
d /var/log/gunicorn/isimip-data  750 isimip isimip
```

Then run:

```bash
systemd-tmpfiles --create
```

#### Gunicorn setup

Systemd will launch the Gunicorn process on startup and keep running. Create a new systemd service file (you will need root/sudo permissions for that):

```
# /etc/systemd/system/isimip-data.service
[Unit]
Description=isimip-data gunicorn daemon
After=network.target

[Service]
User=isimip
Group=isimip
WorkingDirectory=/home/isimip/isimip-data
EnvironmentFile=/home/isimip/isimip-data/.env
ExecStart=/home/isimip/isimip-data/env/bin/gunicorn --bind 127.0.0.1:9000 config.wsgi:application

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

Crate the Nginx configuration as follows (again with root/sudo permissions):

```
# /etc/nginx/vhosts.d/YOURDOMAIN
server {
    listen 80;
    server_name YOURDOMAIN;

    access_log /var/log/nginx/YOURDOMAIN.access.log;
    error_log /var/log/nginx/YOURDOMAIN.error.log;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_pass http://localhost:9000/;
    }
    location /static/ {
        alias /home/isimip/isimip-data/static_root/;
    }
}
```

Start nginx:

```
systemctl enable nginx
systemctl start nginx
```
