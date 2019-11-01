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
-- Name: datasets; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.datasets (
    id uuid NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    attributes jsonb NOT NULL,
    search_vector tsvector NOT NULL
);


ALTER TABLE public.datasets OWNER TO isimip_metadata;

--
-- Name: attributes; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.attributes AS
 SELECT DISTINCT jsonb_object_keys(datasets.attributes) AS key
   FROM public.datasets
  WITH NO DATA;


ALTER TABLE public.attributes OWNER TO isimip_metadata;

--
-- Name: files; Type: TABLE; Schema: public; Owner: isimip_metadata
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


ALTER TABLE public.files OWNER TO isimip_metadata;

--
-- Name: words; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.words AS
 SELECT ts_stat.word
   FROM ts_stat('SELECT search_vector FROM datasets'::text) ts_stat(word, ndoc, nentry)
  WITH NO DATA;


ALTER TABLE public.words OWNER TO isimip_metadata;

--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.datasets (id, name, path, version, attributes, search_vector) FROM stdin;
22ce1fcd-de0c-4bc7-a89d-b4caecf32017	test-model_ipsum_dolor_sit_amet_var_global_monthly	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly	20191101	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
726c3ab1-00a3-4fc6-9456-d5ff99b91772	test-model_lorem_dolor_sit_amet_var_global_monthly	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly	20191101	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
64535c32-a2fd-4926-97cb-4a2c90909622	22ce1fcd-de0c-4bc7-a89d-b4caecf32017	test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
02af3cd5-dc2d-4572-8407-2b44d92cb34c	22ce1fcd-de0c-4bc7-a89d-b4caecf32017	test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
bdd57147-6f15-401d-adec-47101f0dd3bc	726c3ab1-00a3-4fc6-9456-d5ff99b91772	test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
cceace39-6837-4366-bca3-59bbee01543f	726c3ab1-00a3-4fc6-9456-d5ff99b91772	test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
5ea9ba3f-c72c-4065-bd2c-0a983da57bc3	22ce1fcd-de0c-4bc7-a89d-b4caecf32017	test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
437171c9-944d-46cf-8413-cbbe309f0888	726c3ab1-00a3-4fc6-9456-d5ff99b91772	test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
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
-- Name: attributes_key_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX attributes_key_idx ON public.attributes USING btree (key);


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
-- Name: words_word_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX words_word_idx ON public.words USING gin (word public.gin_trgm_ops);


--
-- Name: files files_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id);


--
-- Name: attributes; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: isimip_metadata
--

REFRESH MATERIALIZED VIEW public.attributes;


--
-- Name: words; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: isimip_metadata
--

REFRESH MATERIALIZED VIEW public.words;


--
-- PostgreSQL database dump complete
--

