Running tests
=============

First, remove any `CACHES` entry from `config/settings/local.py` and add `PROTOCOL_LOCATIONS = 'testing/protocol'`.

Next, recreate the metadata database from the included database dump:

```bash
createdb test_isimip_metadata
psql test_isimip_metadata < testing/sql/test_isimip_metadata.sql
```

or shorter:

```bash
psql < testing/sql/setup.sql
```

Run the tests with the `--reuse-db` option:

```bash
pytest --reuse-db
pytest --reuse-db --cov --cov-report html
```
