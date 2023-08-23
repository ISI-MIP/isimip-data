--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12 (Debian 11.12-0+deb10u1)
-- Dumped by pg_dump version 11.12 (Debian 11.12-0+deb10u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: datasets; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.datasets (
    id uuid NOT NULL,
    target_id uuid,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    size bigint NOT NULL,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL,
    public boolean NOT NULL,
    restricted boolean NOT NULL default false,
    tree_path text,
    rights text,
    created timestamp without time zone,
    updated timestamp without time zone,
    published timestamp without time zone,
    archived timestamp without time zone
);


ALTER TABLE public.datasets OWNER TO isimip_metadata;

--
-- Name: identifiers; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.identifiers AS
 SELECT specifiers.key AS identifier,
    array_agg(DISTINCT specifiers.value) AS specifiers
   FROM public.datasets,
    LATERAL jsonb_each_text(datasets.specifiers) specifiers(key, value)
  GROUP BY specifiers.key
  ORDER BY specifiers.key
  WITH NO DATA;


ALTER TABLE public.identifiers OWNER TO isimip_metadata;

--
-- Name: files; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    dataset_id uuid,
    target_id uuid,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    size bigint NOT NULL,
    checksum text NOT NULL,
    checksum_type text NOT NULL,
    netcdf_header jsonb,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL,
    created timestamp without time zone,
    updated timestamp without time zone
);


ALTER TABLE public.files OWNER TO isimip_metadata;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.resources (
    id uuid NOT NULL,
    doi text NOT NULL,
    title text NOT NULL,
    version text,
    paths text[] NOT NULL,
    datacite jsonb NOT NULL,
    created timestamp without time zone,
    updated timestamp without time zone
);


ALTER TABLE public.resources OWNER TO isimip_metadata;

--
-- Name: resources_datasets; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.resources_datasets (
    resource_id uuid,
    dataset_id uuid
);


ALTER TABLE public.resources_datasets OWNER TO isimip_metadata;

--
-- Name: trees; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.trees (
    id uuid NOT NULL,
    tree_dict jsonb NOT NULL,
    created timestamp without time zone,
    updated timestamp without time zone
);


ALTER TABLE public.trees OWNER TO isimip_metadata;

--
-- Name: specifiers; Type: MATERIALIZED VIEW; Schema: public; Owner: jochen
--

CREATE MATERIALIZED VIEW public.specifiers AS
 SELECT DISTINCT specifiers.value AS specifier
   FROM public.datasets,
    LATERAL jsonb_each_text(datasets.specifiers) specifiers(key, value)
  ORDER BY specifiers.value
  WITH NO DATA;


ALTER TABLE public.specifiers OWNER TO jochen;

--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.datasets (id, target_id, name, path, version, size, specifiers, identifiers, search_vector, public, tree_path, rights, created, updated, published, archived) FROM stdin;
84e86386-4ba2-45b2-92bc-615f4f0def34	\N	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20210818	21720	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':11A 'dolor':3A 'global':9A 'lorem':4A 'model':10A 'month':7A 'product':6A 'round':5A 'sector':8A 'sector2':1A 'sit':2A 'var':12A	t	model/lorem/dolor/sit/amet/var	\N	2021-08-18 12:30:38.874031	\N	2021-08-18 12:30:39.418248	\N
7f05e9ad-ed3b-4f0e-93b5-5426c5a9089c	84e86386-4ba2-45b2-92bc-615f4f0def34	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly	20210818	21720	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':10A 'dolor':3A 'global':8A 'lorem':4A 'model':9A 'month':7A 'product':6A 'round':2A 'sector2':1A 'sit':5A 'var':11A	t	model/lorem/dolor/sit/amet/var	\N	2021-08-18 12:30:41.037069	\N	\N	\N
d0e89231-6932-4e02-8cf9-267862b12f3c	b9f8fbc2-d164-42a4-8eb4-2297edcee75b	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly	20210818	21720	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':10A 'dolor':3A 'global':8A 'ipsum':5A 'model':9A 'month':7A 'product':6A 'round':2A 'sector2':1A 'sit':4A 'var':11A	t	model/ipsum/dolor/sit/amet/var	\N	2021-08-18 12:30:40.987957	\N	\N	\N
b9f8fbc2-d164-42a4-8eb4-2297edcee75b	\N	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20210818	21720	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':11A 'dolor':3A 'global':9A 'ipsum':5A 'model':10A 'month':7A 'product':6A 'round':4A 'sector':8A 'sector2':1A 'sit':2A 'var':12A	t	model/ipsum/dolor/sit/amet/var	\N	2021-08-18 12:30:38.823243	\N	2021-08-18 12:30:39.410959	\N
8503652b-0a06-4eac-9a3f-c230357f2ebc	\N	model2_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly	20210818	21726	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model2"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':7A 'dolor':8A 'global':10A 'ipsum':11A 'model2':5A 'month':4A 'product':9A 'round':6A 'sector':2A 'sit':1A 'var':3A	f	model2/ipsum/dolor/sit/amet/var	\N	2021-08-18 12:30:38.899118	\N	2021-08-18 12:30:39.422419	2021-08-18 12:30:43.191757
121de27e-4639-46fa-af79-2028bffc8e4c	\N	model2_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly	20210818	21726	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model2"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':8A 'dolor':9A 'global':11A 'lorem':4A 'model2':6A 'month':5A 'product':10A 'round':7A 'sector':2A 'sit':1A 'var':3A	f	model2/lorem/dolor/sit/amet/var	\N	2021-08-18 12:30:38.922574	\N	2021-08-18 12:30:39.426895	2021-08-18 12:30:43.200038
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.files (id, dataset_id, target_id, name, path, version, size, checksum, checksum_type, netcdf_header, specifiers, identifiers, search_vector, created, updated) FROM stdin;
12732e1a-e08e-4a41-a36a-e4def55bf0cb	8503652b-0a06-4eac-9a3f-c230357f2ebc	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7242	46359d1241f18c33070741d84a719a73ab20374dc261bb8d5097b2d580dfbeaf9d74950345d090c180e88f1b2f74fd7fe86da42d1afb330459f364d68730fade	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':6A '2001':7A 'amet':9A 'dolor':10A 'global':12A 'ipsum':13A 'model2':5A 'month':4A 'product':11A 'round':8A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.905583	\N
a15ed225-726f-4540-95e1-f0356b3426e9	8503652b-0a06-4eac-9a3f-c230357f2ebc	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7242	64d58a1761137a4abc2e243a91076ce39665b72860900708defb5ac1db1bc840b22d1a5ae053bd1a9b507a0b5dab5479460494dedeca127cffb7f497d1a5a8c8	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':7A '2002':5A 'amet':9A 'dolor':10A 'global':12A 'ipsum':13A 'model2':6A 'month':4A 'product':11A 'round':8A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.912968	\N
5fd01329-1f53-46a6-918e-88f2c0a4ff0a	8503652b-0a06-4eac-9a3f-c230357f2ebc	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7242	02bc8be8c82a5c67e1efed70494106161f6b5532ce95ce45c376ae168b78a65db89eb030bb407c9509f148bf49aa5606b3766b62593150145bdda2d97fa34e65	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':5A '2003':8A 'amet':9A 'dolor':10A 'global':12A 'ipsum':13A 'model2':6A 'month':4A 'product':11A 'round':7A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.919277	\N
00c3ad27-9f13-413e-92e9-fa11824d8d40	121de27e-4639-46fa-af79-2028bffc8e4c	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7242	a935796d08749571f7821cc290c1a9555cabbf57b117d964538c5e7c1e2b037cde96be6303f6a8beb4da19f968744d5ce59ae4cfaeed9dd9b24698410f1941ad	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':7A '2001':8A 'amet':10A 'dolor':11A 'global':13A 'lorem':4A 'model2':6A 'month':5A 'product':12A 'round':9A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.928742	\N
a6255132-fc74-4b3d-aa47-2afddb11c8e4	121de27e-4639-46fa-af79-2028bffc8e4c	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7242	d520e3920dc8ac7e0330fdacd53f29fa95bb3c92a9059964ee232b150fc0dd5b7d149830f2e7d25b5f3d7e042b5a927927cd2dcd6d93f7fdcfa55f4f6a257ab7	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':8A '2002':6A 'amet':10A 'dolor':11A 'global':13A 'lorem':4A 'model2':7A 'month':5A 'product':12A 'round':9A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.936514	\N
51111a51-2798-427e-9cf1-a90e9c4a0c72	121de27e-4639-46fa-af79-2028bffc8e4c	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7242	85344409f100bbc1a3de26d4535223502e86f679499ea002291c327f21700bea6631ae3319d95202af13e9edf83892375420804488cdd0ae27729c522c4583c1	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':6A '2003':9A 'amet':10A 'dolor':11A 'global':13A 'lorem':4A 'model2':7A 'month':5A 'product':12A 'round':8A 'sector':2A 'sit':1A 'var':3A	2021-08-18 12:30:38.943224	\N
6ce59e0e-de3e-452e-96db-e9cfbb6259e3	d0e89231-6932-4e02-8cf9-267862b12f3c	d147682f-b3e9-4718-b292-80fbbc499d60	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7240	a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':1A '2001':12A 'amet':11A 'dolor':4A 'global':9A 'ipsum':6A 'model':10A 'month':8A 'product':7A 'round':3A 'sector2':2A 'sit':5A 'var':13A	2021-08-18 12:30:41.009721	\N
d147682f-b3e9-4718-b292-80fbbc499d60	b9f8fbc2-d164-42a4-8eb4-2297edcee75b	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7240	a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':1A '2001':13A 'amet':12A 'dolor':4A 'global':10A 'ipsum':6A 'model':11A 'month':8A 'product':7A 'round':5A 'sector':9A 'sector2':2A 'sit':3A 'var':14A	2021-08-18 12:30:38.853587	\N
bd2b1053-04bd-4db4-ab55-edf916214080	d0e89231-6932-4e02-8cf9-267862b12f3c	93bb1976-e69f-44a8-a62c-c14753bdc3f3	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7240	9f6b9147133792713800c8912f1420e1ad1c679d8dd0aa525e73eef2c54f541d4bd1085243c372df408b2bf10bb6d50055d0bbb53d13102a502bb80e72443e70	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':12A '2002':1A 'amet':11A 'dolor':4A 'global':9A 'ipsum':6A 'model':10A 'month':8A 'product':7A 'round':3A 'sector2':2A 'sit':5A 'var':13A	2021-08-18 12:30:41.021707	\N
93bb1976-e69f-44a8-a62c-c14753bdc3f3	b9f8fbc2-d164-42a4-8eb4-2297edcee75b	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7240	9f6b9147133792713800c8912f1420e1ad1c679d8dd0aa525e73eef2c54f541d4bd1085243c372df408b2bf10bb6d50055d0bbb53d13102a502bb80e72443e70	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':1A 'amet':12A 'dolor':4A 'global':10A 'ipsum':6A 'model':11A 'month':8A 'product':7A 'round':5A 'sector':9A 'sector2':2A 'sit':3A 'var':14A	2021-08-18 12:30:38.864049	\N
bc76b9cc-4b23-44b3-8ab1-9dadec067778	d0e89231-6932-4e02-8cf9-267862b12f3c	f9b9a49e-b3c7-4d6b-a065-6858d4c14298	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7240	dfd5eefaca63079904763f85449d455fe3e2736f3ed5c8045385b84fcf0d055473b97b713415ffa38d99c1813a4121c1ec421e3a4ff31a45054bb4d2b68b8730	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':1A '2003':2A 'amet':12A 'dolor':5A 'global':10A 'ipsum':7A 'model':11A 'month':9A 'product':8A 'round':4A 'sector2':3A 'sit':6A 'var':13A	2021-08-18 12:30:41.032061	\N
f9b9a49e-b3c7-4d6b-a065-6858d4c14298	b9f8fbc2-d164-42a4-8eb4-2297edcee75b	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7240	dfd5eefaca63079904763f85449d455fe3e2736f3ed5c8045385b84fcf0d055473b97b713415ffa38d99c1813a4121c1ec421e3a4ff31a45054bb4d2b68b8730	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':1A '2003':2A 'amet':13A 'dolor':5A 'global':11A 'ipsum':7A 'model':12A 'month':9A 'product':8A 'round':6A 'sector':10A 'sector2':3A 'sit':4A 'var':14A	2021-08-18 12:30:38.870587	\N
261adf08-41f5-4d09-bd4f-33a1f630cadd	7f05e9ad-ed3b-4f0e-93b5-5426c5a9089c	64b2ab66-2721-4597-aa8b-8c792d87ff2f	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7240	c1221e529a4fc0a9ada921e5ce1795b57fac8b27e8814c8514a66601d38ad6c38947a3ad67b1ded1b169f996d4879e966ce1ed667ea4354584ed0451fab4b400	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':1A '2001':12A 'amet':11A 'dolor':4A 'global':9A 'lorem':5A 'model':10A 'month':8A 'product':7A 'round':3A 'sector2':2A 'sit':6A 'var':13A	2021-08-18 12:30:41.047565	\N
64b2ab66-2721-4597-aa8b-8c792d87ff2f	84e86386-4ba2-45b2-92bc-615f4f0def34	\N	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210818	7240	c1221e529a4fc0a9ada921e5ce1795b57fac8b27e8814c8514a66601d38ad6c38947a3ad67b1ded1b169f996d4879e966ce1ed667ea4354584ed0451fab4b400	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':1A '2001':13A 'amet':12A 'dolor':4A 'global':10A 'lorem':5A 'model':11A 'month':8A 'product':7A 'round':6A 'sector':9A 'sector2':2A 'sit':3A 'var':14A	2021-08-18 12:30:38.881392	\N
fc0acd26-d9ac-4118-bb32-d08e928abfc8	7f05e9ad-ed3b-4f0e-93b5-5426c5a9089c	e8aaf2de-e03c-4f35-a84c-4fcb791f1b16	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7240	4a32c4a87a16715ccdf4e2c22981d9473dd2f055a3e4ba3628b99d3724a03142d1029b6eade997e947cc29b8dd6d816b486e1b081495c21f35aa708b9dc50cce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':12A '2002':1A 'amet':11A 'dolor':4A 'global':9A 'lorem':5A 'model':10A 'month':8A 'product':7A 'round':3A 'sector2':2A 'sit':6A 'var':13A	2021-08-18 12:30:41.057337	\N
e8aaf2de-e03c-4f35-a84c-4fcb791f1b16	84e86386-4ba2-45b2-92bc-615f4f0def34	\N	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210818	7240	4a32c4a87a16715ccdf4e2c22981d9473dd2f055a3e4ba3628b99d3724a03142d1029b6eade997e947cc29b8dd6d816b486e1b081495c21f35aa708b9dc50cce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':1A 'amet':12A 'dolor':4A 'global':10A 'lorem':5A 'model':11A 'month':8A 'product':7A 'round':6A 'sector':9A 'sector2':2A 'sit':3A 'var':14A	2021-08-18 12:30:38.889254	\N
a5bbf14f-cac8-4fdc-b322-ba0bd169aafc	7f05e9ad-ed3b-4f0e-93b5-5426c5a9089c	31bb83d4-ac55-48b5-8ba9-09c4c7f51969	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7240	63c35b8bd61b6b51c9b52b4431db9ee6b8bb89a1dd876f67dd14d57c7b9d2b99883e9c80cf3d045811fabf0b1b850537d5a5d73c4071980cea4efcd99a1451ce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':1A '2003':2A 'amet':12A 'dolor':5A 'global':10A 'lorem':6A 'model':11A 'month':9A 'product':8A 'round':4A 'sector2':3A 'sit':7A 'var':13A	2021-08-18 12:30:41.068867	\N
31bb83d4-ac55-48b5-8ba9-09c4c7f51969	84e86386-4ba2-45b2-92bc-615f4f0def34	\N	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210818	7240	63c35b8bd61b6b51c9b52b4431db9ee6b8bb89a1dd876f67dd14d57c7b9d2b99883e9c80cf3d045811fabf0b1b850537d5a5d73c4071980cea4efcd99a1451ce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':1A '2003':2A 'amet':13A 'dolor':5A 'global':11A 'lorem':6A 'model':12A 'month':9A 'product':8A 'round':7A 'sector':10A 'sector2':3A 'sit':4A 'var':14A	2021-08-18 12:30:38.895674	\N
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources (id, doi, title, version, paths, datacite, created, updated) FROM stdin;
602f6381-d46f-4b71-b8d9-126355bc2ac9	10.12345/ISIMIP.001	Test	1.0.1	{round/product/sector/model}	{"dates": [{"date": "2020", "dateType": "Created"}, {"date": "2020-07-01", "dateType": "Issued"}], "titles": [{"title": "Test"}], "version": "1.0.1", "creators": [{"name": "Mustermann, E.", "givenName": "Erika", "familyName": "Mustermann", "affiliations": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "03e8s1d88"}], "nameIdentifier": "0000-0000-0000-0000"}], "language": "eng", "subjects": [{"subject": "TEST1", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}, {"subject": "Test2", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}], "publisher": "Potsdam Institute for Climate Impact Research", "rightsList": [{"rights": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication", "rightsURI": "https://creativecommons.org/publicdomain/zero/1.0/"}], "identifiers": [{"identifier": "10.12345/ISIMIP.001", "identifierType": "DOI"}], "contributors": [{"name": "Mustermann, E.", "givenName": "Erika", "familyName": "Mustermann", "affiliations": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "03e8s1d88"}], "nameIdentifier": "0000-0000-0000-0000", "contributorType": "DataCurator"}], "descriptions": [{"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet.\\n", "descriptionType": "Abstract"}, {"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\\n", "descriptionType": "Methods"}], "geoLocations": [{"geoLocationBox": {"eastBoundLongitude": 179.5, "northBoundLatitude": 89.5, "southBoundLatitude": -89.5, "westBoundLongitude": -179.5}}], "resourceType": "Category", "publicationYear": 2020, "relatedIdentifiers": [{"relationType": "IsDocumentedBy", "relatedIdentifier": "https://protocol.isimip.org", "relatedIdentifierType": "URL"}, {"relationType": "References", "relatedIdentifier": "https://www.isimip.org/outcomes/publications-overview-page", "relatedIdentifierType": "URL"}, {"relationType": "IsNewVersionOf", "relatedIdentifier": "10.12345/isimip/001", "relatedIdentifierType": "DOI"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/84e86386-4ba2-45b2-92bc-615f4f0def34", "relatedIdentifierType": "URL"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/b9f8fbc2-d164-42a4-8eb4-2297edcee75b", "relatedIdentifierType": "URL"}], "resourceTypeGeneral": "Dataset"}	2021-08-18 12:30:41.525343	2021-08-18 12:30:41.927208
\.


--
-- Data for Name: resources_datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources_datasets (resource_id, dataset_id) FROM stdin;
602f6381-d46f-4b71-b8d9-126355bc2ac9	b9f8fbc2-d164-42a4-8eb4-2297edcee75b
602f6381-d46f-4b71-b8d9-126355bc2ac9	84e86386-4ba2-45b2-92bc-615f4f0def34
\.


--
-- Data for Name: trees; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.trees (id, tree_dict, created, updated) FROM stdin;
2c955f6a-814b-4030-b094-b0703fb49cc7	{"model": {"items": {"ipsum": {"items": {"dolor": {"items": {"sit": {"items": {"amet": {"items": {"var": {"items": {}, "specifier": "var", "identifier": "variable"}}, "specifier": "amet", "identifier": "delta"}}, "specifier": "sit", "identifier": "gamma"}}, "specifier": "dolor", "identifier": "beta"}}, "specifier": "ipsum", "identifier": "alpha"}, "lorem": {"items": {"dolor": {"items": {"sit": {"items": {"amet": {"items": {"var": {"items": {}, "specifier": "var", "identifier": "variable"}}, "specifier": "amet", "identifier": "delta"}}, "specifier": "sit", "identifier": "gamma"}}, "specifier": "dolor", "identifier": "beta"}}, "specifier": "lorem", "identifier": "alpha"}}, "specifier": "model", "identifier": "modelname"}}	\N	\N
\.


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: trees trees_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.trees
    ADD CONSTRAINT trees_pkey PRIMARY KEY (id);


--
-- Name: attributes_identifier_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX identifiers_identifier_idx ON public.identifiers USING btree (identifier);


--
-- Name: datasets_search_vector_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX datasets_search_vector_idx ON public.datasets USING gin (search_vector);


--
-- Name: files_search_vector_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX files_search_vector_idx ON public.files USING gin (search_vector);


--
-- Name: ix_datasets_name; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_datasets_name ON public.datasets USING btree (name);


--
-- Name: ix_datasets_path; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_datasets_path ON public.datasets USING btree (path);


--
-- Name: ix_datasets_tree_path; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_datasets_tree_path ON public.datasets USING btree (tree_path);


--
-- Name: ix_datasets_version; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_datasets_version ON public.datasets USING btree (version);


--
-- Name: ix_files_name; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_files_name ON public.files USING btree (name);


--
-- Name: ix_files_path; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_files_path ON public.files USING btree (path);


--
-- Name: ix_files_version; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_files_version ON public.files USING btree (version);


--
-- Name: ix_resources_doi; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_resources_doi ON public.resources USING btree (doi);


--
-- Name: ix_resources_paths; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_resources_paths ON public.resources USING btree (paths);


--
-- Name: specifiers_specifier_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX specifiers_specifier_idx ON public.specifiers USING gin (specifier public.gin_trgm_ops);


--
-- Name: datasets datasets_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.datasets(id);


--
-- Name: files files_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id);


--
-- Name: files files_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.files(id);


--
-- Name: resources_datasets resources_datasets_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.resources_datasets
    ADD CONSTRAINT resources_datasets_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id);


--
-- Name: resources_datasets resources_datasets_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.resources_datasets
    ADD CONSTRAINT resources_datasets_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id);


--
-- Name: identifiers; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: isimip_metadata
--

REFRESH MATERIALIZED VIEW public.identifiers;


--
-- Name: specifiers; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: isimip_metadata
--

REFRESH MATERIALIZED VIEW public.specifiers;


--
-- PostgreSQL database dump complete
--

