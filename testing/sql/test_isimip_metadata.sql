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
854435eb-516d-477a-90c8-11e2c353db30	test-model_ipsum_dolor_sit_amet_var_global_monthly	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly	20191122	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
61f25bf3-18c7-4f9a-97ef-3be95a1b7d9e	test-model_lorem_dolor_sit_amet_var_global_monthly	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly	20191122	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':16A 'round':13A 'sector':19A 'sit':6B 'test':2B,12A,15A,18A 'test-model':1B 'test-product':14A 'test-round':11A 'test-sector':17A 'var':8B
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.files (id, dataset_id, name, path, version, checksum, checksum_type, attributes, search_vector) FROM stdin;
f0ad94de-4fce-422a-8048-fffb0bab1890	854435eb-516d-477a-90c8-11e2c353db30	test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
212023af-7afa-4e77-a6b9-c5ea1af37483	854435eb-516d-477a-90c8-11e2c353db30	test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
b00597cf-d9bc-4d4c-a0bd-1f23bfef71b2	61f25bf3-18c7-4f9a-97ef-3be95a1b7d9e	test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2002_2003	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2002':11B '2003':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
9da68da8-e83b-4317-9b04-6676f9d4337a	61f25bf3-18c7-4f9a-97ef-3be95a1b7d9e	test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2000_2001	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
9fd273ed-d51d-4632-a975-0b49be4ee09f	854435eb-516d-477a-90c8-11e2c353db30	test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	test-round/test-product/test-sector/test-model/test-model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2000':11B '2001':12B 'amet':7B 'dolor':5B 'global':9B 'ipsum':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
360cd1fd-f47d-4623-9425-111977c79748	61f25bf3-18c7-4f9a-97ef-3be95a1b7d9e	test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	test-round/test-product/test-sector/test-model/test-model_lorem_dolor_sit_amet_var_global_monthly_2001_2002	20191122	2a01020db1a1860af73f18981e8e6aaf328bc47f41800463168c39eb65a4915d	sha256	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "test-model", "sector": "test-sector", "epsilon": "consetetur", "product": "test-product", "simulation_round": "test-round"}	'2001':11B '2002':12B 'amet':7B 'dolor':5B 'global':9B 'lorem':4B 'model':3B 'month':10B 'product':18A 'round':15A 'sector':21A 'sit':6B 'test':2B,14A,17A,20A 'test-model':1B 'test-product':16A 'test-round':13A 'test-sector':19A 'var':8B
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

