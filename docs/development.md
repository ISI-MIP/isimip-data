Development Setup
=================

1. Clone the repository:

```bash
git clone git@github.com:ISI-MIP/isimip-data
cd isimip-data
```

2. Create a virtual environment and install Python dependencies:

```bash
python3 -m venv env
source env/bin/activate  # this needs to be done for each new terminal session
pip install -r requirements/dev.txt
```

3. Install and build front-end dependencies (assuming that [nvm.sh](https://github.com/nvm-sh/) is installed):

```bash
nvm install
npm install
npm run build
```

4. (optional) Create the local configuration file `config/settings/local.py` from `config/settings/environments/local.py` or link the file:

```bash
cp config/settings/environments/local.py config/settings/local.py
ln -s environments/local.py config/settings/local.py               # alternatively
```

The `config/settings/local.py` file can hold additional django configuration entries.

5. Configure database (`./manage.py sqlcreate` shows the commands needed for your setup):

```psql
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

7. Run the development server.

```bash
./manage.py runserver
```

8. Run webpack watch mode (in a different terminal):

```bash
npm run watch
```

The application is now accessible on http://localhost:8000 in your local browser.
