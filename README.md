ISI-Access
==========

Setup
-----

Python dependencies:

```
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Front end dependencies:

```
npm install
npm run build
```

Local settings:

```
cp config/settings/sample.local.py config/settings/local.py
```

```
./manage.py sqlcreate | psql
./manage.py migrate
```

```
./manage.py runserver
```
