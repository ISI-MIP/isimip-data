--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Debian 11.5-1+deb10u1)
-- Dumped by pg_dump version 11.5 (Debian 11.5-1+deb10u1)

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
-- Name: datasets; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.datasets (
    id uuid NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    attributes jsonb NOT NULL,
    search_vector tsvector NOT NULL
);


ALTER TABLE public.datasets OWNER TO jochen;

--
-- Name: attributes; Type: MATERIALIZED VIEW; Schema: public; Owner: jochen
--

CREATE MATERIALIZED VIEW public.attributes AS
 SELECT DISTINCT jsonb_object_keys(datasets.attributes) AS key
   FROM public.datasets
  WITH NO DATA;


ALTER TABLE public.attributes OWNER TO jochen;

--
-- Name: files; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    dataset_id uuid,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    checksum text NOT NULL,
    checksum_type text NOT NULL,
    attributes jsonb NOT NULL,
    search_vector tsvector NOT NULL
);


ALTER TABLE public.files OWNER TO jochen;

--
-- Name: latest; Type: MATERIALIZED VIEW; Schema: public; Owner: jochen
--

CREATE MATERIALIZED VIEW public.latest AS
 SELECT d.id AS dataset_id,
    d.version
   FROM (public.datasets d
     JOIN ( SELECT datasets.path,
            max((datasets.version)::text) AS version
           FROM public.datasets
          GROUP BY datasets.path) l ON (((l.path = d.path) AND (l.version = (d.version)::text))))
  WITH NO DATA;


ALTER TABLE public.latest OWNER TO jochen;

--
-- Name: words; Type: MATERIALIZED VIEW; Schema: public; Owner: jochen
--

CREATE MATERIALIZED VIEW public.words AS
 SELECT ts_stat.word
   FROM ts_stat('SELECT search_vector FROM datasets'::text) ts_stat(word, ndoc, nentry)
  WITH NO DATA;


ALTER TABLE public.words OWNER TO jochen;

--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.datasets (id, name, path, version, attributes, search_vector) FROM stdin;
cde2dfe6-7904-4f34-b6f6-867b4f193e97	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20200207	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "timestep": "monthly", "variable": "var", "modelname": "model"}	'20200207':13A 'amet':3A 'dolor':2A 'global':8A 'ipsum':1A 'model':5A,6A 'month':11A 'product':7A 'round':9A 'sector':10A 'sit':4A 'var':12A
20c0801b-1a19-447e-b8ac-e6bace779901	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20200207	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "timestep": "monthly", "variable": "var", "modelname": "model"}	'20200207':13A 'amet':3A 'dolor':2A 'global':8A 'lorem':1A 'model':5A,6A 'month':11A 'product':7A 'round':9A 'sector':10A 'sit':4A 'var':12A
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
44358a68-f4c9-4e78-9f48-7229e9f3b5cd	cde2dfe6-7904-4f34-b6f6-867b4f193e97	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200207	c5091d860bf26c7e478d5266831ac306260653f68c06344d3e03ee71abb62e9e	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':12A '2002':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'ipsum':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
05a66001-4a39-4b36-87a3-756444f2f2f1	20c0801b-1a19-447e-b8ac-e6bace779901	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200207	75c10f5d296024e271c69e8ddd791d78786f8d3b99828d0d6ead359c65bf7d7b	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':12A '2001':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'lorem':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
86b2ac3a-1f7f-495e-8a62-c1ef2f69ee8e	20c0801b-1a19-447e-b8ac-e6bace779901	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200207	b16a93259709d60806097e9e6afa7a3aca9b500f7475c1a053b2b067157443c8	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':12A '2002':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'lorem':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
2edfedc1-ac43-48e4-b24f-b91050b934fe	20c0801b-1a19-447e-b8ac-e6bace779901	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200207	aa9f9d681e88df8c083f572cea73cfb43b093c900c7f1239336b5aad10e83428	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':12A '2003':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'lorem':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
52625009-10a1-47bf-8633-767eff6db991	cde2dfe6-7904-4f34-b6f6-867b4f193e97	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200207	58da0d64b2cfd057e69ef4f1d491559f4eecf29997f1b8823dacd4cf7f6c6c89	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':12A '2001':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'ipsum':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
d314f167-57e0-43a6-8aa1-a6265d1ee76d	cde2dfe6-7904-4f34-b6f6-867b4f193e97	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200207	4bb9c53425e1f524f665a555b2f8c73ee3e3afa169ad8f4acfeaba8e5317d8a2	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200207", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':12A '2003':4A '20200207':15A 'amet':3A 'dolor':2A 'global':9A 'ipsum':1A 'model':6A,7A 'month':13A 'product':8A 'round':10A 'sector':11A 'sit':5A 'var':14A
\.


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: attributes_key_idx; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX attributes_key_idx ON public.attributes USING btree (key);


--
-- Name: datasets_search_vector_idx; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX datasets_search_vector_idx ON public.datasets USING gin (search_vector);


--
-- Name: files_search_vector_idx; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX files_search_vector_idx ON public.files USING gin (search_vector);


--
-- Name: ix_datasets_name; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_datasets_name ON public.datasets USING btree (name);


--
-- Name: ix_datasets_path; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_datasets_path ON public.datasets USING btree (path);


--
-- Name: ix_datasets_version; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_datasets_version ON public.datasets USING btree (version);


--
-- Name: ix_files_name; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_files_name ON public.files USING btree (name);


--
-- Name: ix_files_path; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_files_path ON public.files USING btree (path);


--
-- Name: ix_files_version; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX ix_files_version ON public.files USING btree (version);


--
-- Name: latest_dataset_id_idx; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX latest_dataset_id_idx ON public.latest USING btree (dataset_id);


--
-- Name: words_word_idx; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX words_word_idx ON public.words USING gin (word public.gin_trgm_ops);


--
-- Name: files files_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id);


--
-- Name: attributes; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: jochen
--

REFRESH MATERIALIZED VIEW public.attributes;


--
-- Name: latest; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: jochen
--

REFRESH MATERIALIZED VIEW public.latest;


--
-- Name: words; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: jochen
--

REFRESH MATERIALIZED VIEW public.words;


--
-- PostgreSQL database dump complete
--

