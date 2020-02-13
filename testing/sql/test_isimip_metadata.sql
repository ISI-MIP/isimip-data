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
6fb1df13-22a5-4512-b54a-4ba9e06d3d2f	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20200213	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
d6d28cdd-2724-4138-9d52-38ec7cd17179	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20200213	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "timestep": "monthly", "variable": "var", "modelname": "model"}	'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
25e9bdaf-1085-43ad-9652-b05b4ee232bb	6fb1df13-22a5-4512-b54a-4ba9e06d3d2f	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200213	d8cabad79295243f4660cab9558ebef0328bd54ab48bdacb75ff86dc97bd7632	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
394b7c97-9470-45ec-9c70-c2f7a91b88d3	6fb1df13-22a5-4512-b54a-4ba9e06d3d2f	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200213	378b66c4ba3cc1e7432a96f90f7058d68377f527e12e25d8a7f2273c5d980c75	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
5b3484cf-a2b5-47e0-88d9-d30f07d86acd	6fb1df13-22a5-4512-b54a-4ba9e06d3d2f	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200213	21bc7bd597787366d3758174dc9ab385e3d8e8111f29a40f28d64fc4802620cc	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
c53a2a0b-a34f-4943-82f2-7314acc5ae80	d6d28cdd-2724-4138-9d52-38ec7cd17179	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc4	20200213	8bb6baaa8c418df93cd0be98b1c63e192076a5e41ccba1bdd9bea6f6dbc428bc	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
ebda0e69-387a-4b15-bf7e-6b7d4f235330	d6d28cdd-2724-4138-9d52-38ec7cd17179	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc4	20200213	063768341286191b92720c08482cc155a282b190b0bdbe996b9d305eae4a98b7	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
39912420-32a6-4cb9-a4e2-7fd6ca86fc6c	d6d28cdd-2724-4138-9d52-38ec7cd17179	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc4	20200213	0c757085b611c80a4aec6f61156a7a92473009be06e86de35b59c5f49c5ad4f3	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "version": "20200213", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'nc4':15A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
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

