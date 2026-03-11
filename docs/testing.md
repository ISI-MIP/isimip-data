Running tests
=============

First, remove any `CACHES` entry from `config/settings/local.py` and add `PROTOCOL_LOCATIONS = 'testing/protocol'`.

Then, run the tests using `pytest`:

```bash
pytest
pytest --reuse-db                          # keep the databases between tests
pytest --reuse-db --cov --cov-report html  # analyse coverage and create html report
```
