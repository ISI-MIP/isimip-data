Precomputed Facet Tables
========================

Histograms in the facetted search (`/api/v1/datasets/histogram/<identifier>/`) are
served from two precomputed tables in the metadata database whenever possible,
instead of scanning the `datasets` table on every request:

- `facet_count(identifier, specifier, count)` — counts for every specifier value of
  every identifier over all public datasets. Used when no filter is applied
  (the first page load, worst case previously ~1.5 s per facet).
- `facet_pair(identifier_1, specifier_1, identifier_2, specifier_2, count)` — counts
  of every specifier value of every identifier over the datasets that carry one
  specific `(identifier, specifier)` pair. Used when exactly one identifier filter
  is applied (worst case previously ~0.8 s per facet).

Both replicate the semantics of the computed histogram exactly: public rows only,
grouped by specifier value, counting distinct root datasets (`root_id`, so links are
counted towards their target dataset). Pairs are stored with
`identifier_1 <= identifier_2`; the app queries both directions.

The application falls back to computing the histogram from `datasets` for all other
filter states (multiple identifier filters, full text search, path/tree filters, …),
which are either already fast via the GIN index or not covered by the tables. If the
tables are missing or empty, everything still works through the fallback.

One-shot facets
---------------

`/api/v1/datasets/facets/` returns the histograms of all facets configured via
`SEARCH_FACETS` in one request, keyed by identifier, accepting the same filter
parameters as the dataset list endpoint and using the same fast/fallback mechanics
as the per-facet endpoint. At most `METADATA_MAX_FACET_VALUES` (default 200) values
per facet are returned, the most frequent ones. The search page sidebar uses this
endpoint instead of issuing one histogram request per open facet.

Refresh
-------

The tables are created and refilled by:

    ./manage.py refresh_facet_tables

The SQL lives in `isimip_data/metadata/management/commands/refresh_facet_tables.py`
(create + truncate + insert + analyze, refresh in one transaction).

In production the metadata database is only writable by the **metadata pipeline**, so
the pipeline should run these statements after each ingest, like it already refreshes
the `identifiers` and `specifiers` materialized views. Measured timings (November 2026,
742k root datasets / 666k public): `facet_count` ~40 s (208 kB), `facet_pair` ~7 min
(7.6 MB, 54k pairs). Until the pipeline runs them, the app transparently uses the
slower fallback path.

Cache warming
-------------

`MetadataCacheMiddleware` caches the dataset API responses but clears the cache
whenever the metadata changes — so after every ingest all facet responses have to be
computed again. To spare the first users after an ingest, run on the application
server:

    ./manage.py warm_facet_cache

The command requests `/api/v1/datasets/facets/` unfiltered and with each single
identifier value from `facet_count` through the middleware, which caches the
responses exactly as it would for real requests. Options: `--values-per-identifier`
limits the values per identifier (most frequent first), `--pairs` additionally warms
two-identifier combinations of the most frequent values within the first
`SEARCH_FACETS` group (simulation round, product, period, sector) — those states are
beyond the facet tables and otherwise cost a full computed round-trip (~2 s) for the
first user after each ingest. The `--host` option must match the host of the real
requests (defaults to the first `ALLOWED_HOSTS` entry), since the response cache keys
include it. The cache keys do not depend on the order of the query parameters —
`MetadataCacheMiddleware` sorts them — so warmed states are also hit by clients that
send the filters in another order. Run it after the pipeline has refreshed the facet
tables.

Development and testing
-----------------------

`conftest.py` runs `refresh_facet_tables` on the metadata test database
(`testing/sql/test_isimip_metadata.sql`) as part of the session setup, so the tests
exercise both the fast and the fallback paths. See [Running tests](testing.md).

Measured effect (local restore of the production dump)
------------------------------------------------------

| histogram state | before | from facet tables |
|---|---|---|
| unfiltered (`pft`, 375 values) | ~1,450 ms | ~0.2 ms |
| one facet applied (`model` under `sector=forestry`) | ~800 ms | ~0.05 ms |
