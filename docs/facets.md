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
