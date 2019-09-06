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

3. Install and build front-end dependencies:

```bash
nvm install
npm install
npm run build
```

4. Create the local configuration file `.env`:

```bash
SECRET_KEY=<a secret random string>
DEBUG=True

# database connection for the django database
DATABASE=postgresql://<user>:<pass>@<host>/<db>

# database connection for the django database
DATABASE_METADATA=postgresql://<user>:<pass>@<host>/<db>

FILES_BASE_URL=http://isimip-files/%(simulation_round)s/%(product)s/%(sector)s/%(model)s/
```

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
