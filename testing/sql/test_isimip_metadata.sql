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
00f69f77-03c3-4c1a-b040-44ee82d1bc85	test-model_ipsum_dolor_sit_amet_var_global_monthly	test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly	20191101	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
7d93d3bc-5378-4b7a-bce8-2df01d16850e	test-model_lorem_dolor_sit_amet_var_global_monthly	test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly	20191101	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
a72d2a55-83f7-4810-9524-141dc2d27e99	00f69f77-03c3-4c1a-b040-44ee82d1bc85	test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
208c9900-8700-4064-bfc8-a26a8c2f9416	00f69f77-03c3-4c1a-b040-44ee82d1bc85	test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
60b27a13-fac1-452c-a11a-5b3ac131d0e2	7d93d3bc-5378-4b7a-bce8-2df01d16850e	test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
49b49498-a86c-4ac8-81f5-94221c2ae901	7d93d3bc-5378-4b7a-bce8-2df01d16850e	test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
d9b0cc71-28bb-430a-9156-30d77d5ccaac	00f69f77-03c3-4c1a-b040-44ee82d1bc85	test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
6d34511e-f537-4cdf-8f8b-9cd21ff6d771	7d93d3bc-5378-4b7a-bce8-2df01d16850e	test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	20191101	02afe49da3bdf4b8ee1d3b5d54501bcbce2981551bb932d2237a1cea7d31a267	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
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

