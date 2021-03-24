Running tests
=============

First, create test database using by running the tests of the [isimip-publisher](https://github.com/ISI-MIP/isimip-publisher). Alternatively the database can be recreated from the included database dump:

```bash
psql < testing/sql/test_isimip_metadata.sql
```

Run the tests with the `--reuse-db` option:

```bash
pytest --reuse-db
```
