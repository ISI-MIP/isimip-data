DROP DATABASE IF EXISTS test_isimip_metadata;
CREATE DATABASE test_isimip_metadata WITH OWNER isimip_metadata;
\c test_isimip_metadata;
\i testing/sql/test_isimip_metadata.sql
GRANT ALL ON SCHEMA public TO isimip_data;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO isimip_data
