--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4
-- Dumped by pg_dump version 11.4

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
0f29eeda-fe86-4599-a7b0-fbfe287c292b	test-model_a_b_c_d_var_global_monthly	test-sector/test-model/test-model_a_b_c_d_var_global_monthly	20191030	{"a": "a", "b": "b", "c": "c", "d": "d", "model": "test-model", "sector": "test-sector", "product": "test-product", "simulation_round": "test-round"}	'b':5B 'c':6B 'd':7B 'global':9B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
62973e5a-8202-4300-bf6b-5ee5dcd7389c	0f29eeda-fe86-4599-a7b0-fbfe287c292b	test-model_a_b_c_d_var_global_monthly_2002_2003	test-sector/test-model/test-model_a_b_c_d_var_global_monthly_2002_2003	20191030	47e1f31091632c8663c4954a3829134aff9e09484c27c84221d803344f846704	sha256	{"a": "a", "b": "b", "c": "c", "d": "d", "model": "test-model", "sector": "test-sector", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'b':5B 'c':6B 'd':7B 'global':9B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
68c520fe-1b89-4386-ac57-540dc932085e	0f29eeda-fe86-4599-a7b0-fbfe287c292b	test-model_a_b_c_d_var_global_monthly_2001_2002	test-sector/test-model/test-model_a_b_c_d_var_global_monthly_2001_2002	20191030	47e1f31091632c8663c4954a3829134aff9e09484c27c84221d803344f846704	sha256	{"a": "a", "b": "b", "c": "c", "d": "d", "model": "test-model", "sector": "test-sector", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'b':5B 'c':6B 'd':7B 'global':9B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
76c57627-aea3-4c48-b408-8130b29a1d3c	0f29eeda-fe86-4599-a7b0-fbfe287c292b	test-model_a_b_c_d_var_global_monthly_2000_2001	test-sector/test-model/test-model_a_b_c_d_var_global_monthly_2000_2001	20191030	47e1f31091632c8663c4954a3829134aff9e09484c27c84221d803344f846704	sha256	{"a": "a", "b": "b", "c": "c", "d": "d", "model": "test-model", "sector": "test-sector", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'b':5B 'c':6B 'd':7B 'global':9B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
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

