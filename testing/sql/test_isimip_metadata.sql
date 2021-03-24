--
-- PostgreSQL database dump
--

-- Dumped from database version 11.9 (Debian 11.9-0+deb10u1)
-- Dumped by pg_dump version 11.9 (Debian 11.9-0+deb10u1)

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
    size bigint NOT NULL,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL,
    public boolean NOT NULL,
    tree_path text,
    rights text
);


ALTER TABLE public.datasets OWNER TO isimip_metadata;

--
-- Name: attributes; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.attributes AS
 SELECT specifiers.key AS identifier,
    array_agg(DISTINCT specifiers.value) AS specifiers
   FROM public.datasets,
    LATERAL jsonb_each(datasets.specifiers) specifiers(key, value)
  GROUP BY specifiers.key
  ORDER BY specifiers.key
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
    size bigint NOT NULL,
    checksum text NOT NULL,
    checksum_type text NOT NULL,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL,
    rights text
);


ALTER TABLE public.files OWNER TO isimip_metadata;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.resources (
    id uuid NOT NULL,
    doi text NOT NULL,
    paths text[] NOT NULL,
    datacite jsonb NOT NULL
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
    tree_dict jsonb NOT NULL
);


ALTER TABLE public.trees OWNER TO isimip_metadata;

--
-- Name: words; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.words AS
 SELECT ts_stat.word
   FROM ts_stat('SELECT search_vector FROM public.datasets'::text) ts_stat(word, ndoc, nentry)
  WITH NO DATA;


ALTER TABLE public.words OWNER TO isimip_metadata;

--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.datasets (id, name, path, version, size, specifiers, identifiers, search_vector, public, tree_path, rights) FROM stdin;
f1178e51-4a06-46a6-bffd-a2bd13e330ff	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20210324	21720	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f	model/ipsum/dolor/sit/amet/var	\N
99d1910e-e0a6-4d25-9c98-cac2864f823b	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20210324	21720	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f	model/lorem/dolor/sit/amet/var	\N
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.files (id, dataset_id, name, path, version, size, checksum, checksum_type, specifiers, identifiers, search_vector, rights) FROM stdin;
55d71437-c4da-4ab1-a4d9-6d8060ede7f2	f1178e51-4a06-46a6-bffd-a2bd13e330ff	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210324	7240	a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e	sha512	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
d8377607-5140-448e-a689-4b374ef71a29	f1178e51-4a06-46a6-bffd-a2bd13e330ff	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210324	7240	9f6b9147133792713800c8912f1420e1ad1c679d8dd0aa525e73eef2c54f541d4bd1085243c372df408b2bf10bb6d50055d0bbb53d13102a502bb80e72443e70	sha512	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
f63d8502-de92-4043-a2c5-2ad9b950128e	f1178e51-4a06-46a6-bffd-a2bd13e330ff	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210324	7240	dfd5eefaca63079904763f85449d455fe3e2736f3ed5c8045385b84fcf0d055473b97b713415ffa38d99c1813a4121c1ec421e3a4ff31a45054bb4d2b68b8730	sha512	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
b9a28992-eaa9-4bd4-af7c-333bbd5a5cb9	99d1910e-e0a6-4d25-9c98-cac2864f823b	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210324	7240	c1221e529a4fc0a9ada921e5ce1795b57fac8b27e8814c8514a66601d38ad6c38947a3ad67b1ded1b169f996d4879e966ce1ed667ea4354584ed0451fab4b400	sha512	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
fdfaee29-e155-4526-b3de-ceed8b51534a	99d1910e-e0a6-4d25-9c98-cac2864f823b	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210324	7240	4a32c4a87a16715ccdf4e2c22981d9473dd2f055a3e4ba3628b99d3724a03142d1029b6eade997e947cc29b8dd6d816b486e1b081495c21f35aa708b9dc50cce	sha512	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
744426ef-87c5-4760-a007-afd971538229	99d1910e-e0a6-4d25-9c98-cac2864f823b	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210324	7240	63c35b8bd61b6b51c9b52b4431db9ee6b8bb89a1dd876f67dd14d57c7b9d2b99883e9c80cf3d045811fabf0b1b850537d5a5d73c4071980cea4efcd99a1451ce	sha512	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	\N
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources (id, doi, paths, datacite) FROM stdin;
a40ea61c-97c0-4461-bd92-7f7bd888dd8b	10.12345/ISIMIP.001	{round/product/sector/model}	{"dates": {"issued": "2020-01-01", "created": "2020", "collected": "2000/2020"}, "titles": [{"title": "Test"}], "version": "1.0.1", "creators": [{"givenName": "Erika", "familyName": "Mustermann", "affiliation": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "https://ror.org/03e8s1d88"}], "creatorName": "Mustermann, E.", "nameIdentifier": "https://orcid.org/0000-0000-0000-0000"}], "language": "eng", "subjects": [{"subject": "TEST1", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}, {"subject": "Test2", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}], "publisher": "Potsdam Institute for Climate Impact Research", "rightsList": [{"rights": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication", "rightsURI": "https://creativecommons.org/publicdomain/zero/1.0/deed"}], "identifiers": [{"identifier": "10.12345/ISIMIP.001", "identifierType": "DOI"}], "contributors": [{"givenName": "Erika", "familyName": "Mustermann", "affiliation": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "https://ror.org/03e8s1d88"}], "nameIdentifier": "https://orcid.org/0000-0000-0000-0000", "contributorName": "Mustermann, E.", "contributorType": "DataCurator"}], "descriptions": [{"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet.\\n", "descriptionType": "Abstract"}, {"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\\n", "descriptionType": "Methods"}], "geoLocations": [{"geoLocationBox": {"eastBoundLongitude": 179.5, "northBoundLatitude": 89.5, "southBoundLatitude": -89.5, "westBoundLongitude": -179.5}}], "resourceType": "Category", "publicationYear": 2020, "fundingReferences": null, "relatedIdentifiers": [{"relationType": "IsDocumentedBy", "relatedIdentifier": "https://protocol.isimip.org", "relatedIdentifierType": "URL"}, {"relationType": "References", "relatedIdentifier": "https://www.isimip.org/outcomes/publications-overview-page", "relatedIdentifierType": "URL"}, {"relationType": "IsNewVersionOf", "relatedIdentifier": "10.12345/isimip/001", "relatedIdentifierType": "DOI"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/99d1910e-e0a6-4d25-9c98-cac2864f823b", "relatedIdentifierType": "URL"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/f1178e51-4a06-46a6-bffd-a2bd13e330ff", "relatedIdentifierType": "URL"}], "resourceTypeGeneral": "Dataset"}
\.


--
-- Data for Name: resources_datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources_datasets (resource_id, dataset_id) FROM stdin;
a40ea61c-97c0-4461-bd92-7f7bd888dd8b	f1178e51-4a06-46a6-bffd-a2bd13e330ff
a40ea61c-97c0-4461-bd92-7f7bd888dd8b	99d1910e-e0a6-4d25-9c98-cac2864f823b
\.


--
-- Data for Name: trees; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.trees (id, tree_dict) FROM stdin;
6b49ce62-7bbf-4ce6-9825-a6b03dbd1cfb	{}
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

CREATE INDEX attributes_identifier_idx ON public.attributes USING btree (identifier);


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
-- Name: words_word_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX words_word_idx ON public.words USING gin (word public.gin_trgm_ops);


--
-- Name: files files_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id);


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

