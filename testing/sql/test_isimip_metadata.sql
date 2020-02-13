--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: datasets; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.datasets (
    id uuid NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    attributes jsonb NOT NULL,
    search_vector tsvector NOT NULL,
    public boolean NOT NULL
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

COPY public.datasets (id, name, path, version, attributes, search_vector, public) FROM stdin;
27cc15f6-86c3-4e9b-8369-1780f9941b30	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20200202	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
20f91f8b-c5ba-437c-b189-f960fa17aebc	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20200202	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
64c33803-0812-4fc4-b740-9c51ffb1ab56	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20200220	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	t
e5794fca-0f73-4fe4-9757-4174139a09e0	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20200220	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	t
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
4f279488-793a-4246-84ac-010d71b26ccd	27cc15f6-86c3-4e9b-8369-1780f9941b30	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200202	077d5d6d0d9b66a7fa42c35b485dd24972209c9aa5470e2e2f5e93a1d98ba533	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
6a9fc938-4663-4b32-8431-a32e25883463	27cc15f6-86c3-4e9b-8369-1780f9941b30	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200202	7321f1938c203a66f312ec237d579c3d9b6346cebc344ef962c7dc55b20e1b01	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
75729820-9605-4041-9fc4-57514f13c0a9	27cc15f6-86c3-4e9b-8369-1780f9941b30	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200202	a95883e9ff2957157314f3047137652be6c8cc02f9eb69ed96918dc96d858306	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
2ffdd058-2c6a-4131-bdf9-1b4e55b03274	20f91f8b-c5ba-437c-b189-f960fa17aebc	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200202	04d9e95a17046a636fddc67804c54799ae9f84d67d858f75ed2bff692a7b1b21	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
30aa6845-4f3d-4595-a736-7ef9d090abd8	20f91f8b-c5ba-437c-b189-f960fa17aebc	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200202	7cef19d4154a2cf16899415aa4493e265996dc379862455efd4b3aa220d10e03	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
f9033af8-de8a-4d91-b628-6d1af72b9a7f	20f91f8b-c5ba-437c-b189-f960fa17aebc	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200202	a6b7aef399b7bb49b08de3125d6c738f66085ffb861736d66bcdf1b89ec0a376	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200202", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
505df989-da7e-4afe-b187-1d71f2af6660	64c33803-0812-4fc4-b740-9c51ffb1ab56	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200220	ba3d97bb343055c68e43877b97d133d89482f1fa0dc8fd4d49e088237d983f11	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
3a4bb8e0-b009-46f2-affc-80a8bfcc4b8c	64c33803-0812-4fc4-b740-9c51ffb1ab56	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200220	1369094dc47ab3e1a4516cf95080bbd1c84934507ec06f9062b24ff86a5d2faf	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
731e9c78-017c-4b19-a7ad-493b8d080660	64c33803-0812-4fc4-b740-9c51ffb1ab56	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200220	2329e0f00b5d191b1371249e0d93faaf952e0a905768cff3b2c9129567c3f6e4	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
85346b5d-4dfb-446b-8414-8d5f697073a1	e5794fca-0f73-4fe4-9757-4174139a09e0	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200220	0e48f107c0d56a9e255cdaa68f58ea578050ded41653518436676c918e3be4c5	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
41c9f15f-1661-4544-b665-3e1be4b906c1	e5794fca-0f73-4fe4-9757-4174139a09e0	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200220	fc370ba55fc9ed61086a796c50b9398b4a236626d6f657da6a7c52d459298c36	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
3b9aa434-ff03-4b13-be80-116729473635	e5794fca-0f73-4fe4-9757-4174139a09e0	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200220	c27a2a7ce6c8079f02a1bb56bf369a928e093da459a8b58b9f9cfeedc1e287da	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200220", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
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
-- Name: words; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: jochen
--

REFRESH MATERIALIZED VIEW public.words;


--
-- PostgreSQL database dump complete
--

