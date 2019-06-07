Development Setup
=================

1. Clone the repository:

```bash
git clone git@github.com/ISI-MIP/isimip-data
```

2. Create a virtual environment and install Python dependencies:

```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

3. Install and build front-end dependencies:

```bash
npm install
```

4. Create the local configuration file `local.py`:

```bash
cp config/settings/sample.local.py config/settings/local.py
```

5. Edit `local.py` for a random `SECRET_KEY`, `DEBUG = True`, and the connection to the PostgreSQL database. If not already done, the database can be set up using the output of `./manage.py sqlcreate`, e.g.:

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
