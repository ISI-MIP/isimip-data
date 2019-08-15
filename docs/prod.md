Production setup
================

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

#### Back end

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
DJANGO_SECRET_KEY=<a secret random string>

# database connection for the django database
DJANGO_DBNAME=isimip_data
DJANGO_DBUSER=isimip_data

# database connection for the metadata database
DJANGO_METADATA_DBNAME=isimip_metadata
DJANGO_METADATA_DBUSER=isimip_data

DJANGO_FILES_BASE_URL=http://files.isimip.org/%(simulation_round)s/%(sector)s/%(model)s/
```

5. Configure database:

```bash
# as postgres user


CREATE USER isimip_data WITH ENCRYPTED PASSWORD 'isimip_data' CREATEDB;
CREATE DATABASE isimip_data WITH ENCODING 'UTF-8' OWNER "isimip_data";
GRANT ALL PRIVILEGES ON DATABASE isimip_data TO isimip_data;

\c isimip_metadata
GRANT SELECT ON ALL TABLES IN SCHEMA public TO isimip_data
```

6. Setup database tables and admin user:

```bash
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
ExecStart=/home/isimip/env/bin/gunicorn --bind unix:/tmp/isimip-data.sock config.wsgi:application

[Install]
WantedBy=multi-user.target
```

This service needs to be started and enabled like any other service:

```bash
# as root
systemctl daemon-reload
systemctl start isimip-data
systemctl enable isimip-data
systemctl status isimip-data
```

#### NGINX

Next, install NGINX:

```bash
# as root
sudo apt-get install nginx
```

Crate the Nginx configuration as follows (again with root/sudo permissions):

```
# /etc/nginx/sites-available/YOURDOMAIN
server {
    listen 80;
    server_name YOURDOMAIN;

    access_log /var/log/nginx/YOURDOMAIN.access.log;
    error_log /var/log/nginx/YOURDOMAIN.error.log;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_pass http://unix:/tmp/isimip-data.sock;
    }
    location /static/ {
        alias /home/isimip/isimip-data/static_root/;
    }
}
```




