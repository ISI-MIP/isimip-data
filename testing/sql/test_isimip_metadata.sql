--
-- PostgreSQL database dump
--

-- Dumped from database version 11.7 (Debian 11.7-0+deb10u1)
-- Dumped by pg_dump version 11.7 (Debian 11.7-0+deb10u1)

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
    size integer NOT NULL,
    checksum text NOT NULL,
    checksum_type text NOT NULL,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL,
    public boolean NOT NULL
);


ALTER TABLE public.datasets OWNER TO isimip_metadata;

--
-- Name: attributes; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.attributes AS
 SELECT DISTINCT jsonb_object_keys(datasets.specifiers) AS key
   FROM public.datasets
  WITH NO DATA;


ALTER TABLE public.attributes OWNER TO isimip_metadata;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO isimip_metadata;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO isimip_metadata;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO isimip_metadata;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO isimip_metadata;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO isimip_metadata;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO isimip_metadata;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO isimip_metadata;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO isimip_metadata;

--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO isimip_metadata;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO isimip_metadata;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO isimip_metadata;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO isimip_metadata;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO isimip_metadata;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO isimip_metadata;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO isimip_metadata;

--
-- Name: files; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    dataset_id uuid,
    name text NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    size integer NOT NULL,
    checksum text NOT NULL,
    checksum_type text NOT NULL,
    mime_type text NOT NULL,
    specifiers jsonb NOT NULL,
    identifiers text[] NOT NULL,
    search_vector tsvector NOT NULL
);


ALTER TABLE public.files OWNER TO isimip_metadata;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.resources (
    id uuid NOT NULL,
    path text NOT NULL,
    version character varying(8) NOT NULL,
    doi text NOT NULL,
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
-- Name: search_facet; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.search_facet (
    id integer NOT NULL,
    title character varying(32) NOT NULL,
    attribute character varying(32) NOT NULL,
    "order" integer NOT NULL,
    CONSTRAINT search_facet_order_check CHECK (("order" >= 0))
);


ALTER TABLE public.search_facet OWNER TO isimip_metadata;

--
-- Name: search_facet_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.search_facet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_facet_id_seq OWNER TO isimip_metadata;

--
-- Name: search_facet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.search_facet_id_seq OWNED BY public.search_facet.id;


--
-- Name: trees; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.trees (
    id uuid NOT NULL,
    tree_dict jsonb NOT NULL,
    tree_list jsonb NOT NULL
);


ALTER TABLE public.trees OWNER TO isimip_metadata;

--
-- Name: wizard_layer; Type: TABLE; Schema: public; Owner: isimip_metadata
--

CREATE TABLE public.wizard_layer (
    id integer NOT NULL,
    title character varying(32) NOT NULL,
    attribute character varying(32) NOT NULL,
    "order" integer NOT NULL,
    CONSTRAINT wizard_layer_order_check CHECK (("order" >= 0))
);


ALTER TABLE public.wizard_layer OWNER TO isimip_metadata;

--
-- Name: wizard_layer_id_seq; Type: SEQUENCE; Schema: public; Owner: isimip_metadata
--

CREATE SEQUENCE public.wizard_layer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wizard_layer_id_seq OWNER TO isimip_metadata;

--
-- Name: wizard_layer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: isimip_metadata
--

ALTER SEQUENCE public.wizard_layer_id_seq OWNED BY public.wizard_layer.id;


--
-- Name: words; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.words AS
 SELECT ts_stat.word
   FROM ts_stat('SELECT search_vector FROM public.datasets'::text) ts_stat(word, ndoc, nentry)
  WITH NO DATA;


ALTER TABLE public.words OWNER TO isimip_metadata;

--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: search_facet id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.search_facet ALTER COLUMN id SET DEFAULT nextval('public.search_facet_id_seq'::regclass);


--
-- Name: wizard_layer id; Type: DEFAULT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.wizard_layer ALTER COLUMN id SET DEFAULT nextval('public.wizard_layer_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add dataset	7	add_dataset
26	Can change dataset	7	change_dataset
27	Can delete dataset	7	delete_dataset
28	Can view dataset	7	view_dataset
29	Can add file	8	add_file
30	Can change file	8	change_file
31	Can delete file	8	delete_file
32	Can view file	8	view_file
33	Can add resource	9	add_resource
34	Can change resource	9	change_resource
35	Can delete resource	9	delete_resource
36	Can view resource	9	view_resource
37	Can add tree	10	add_tree
38	Can change tree	10	change_tree
39	Can delete tree	10	delete_tree
40	Can view tree	10	view_tree
41	Can add word	11	add_word
42	Can change word	11	change_word
43	Can delete word	11	delete_word
44	Can view word	11	view_word
45	Can add attribute	12	add_attribute
46	Can change attribute	12	change_attribute
47	Can delete attribute	12	delete_attribute
48	Can view attribute	12	view_attribute
49	Can add facet	13	add_facet
50	Can change facet	13	change_facet
51	Can delete facet	13	delete_facet
52	Can view facet	13	view_facet
53	Can add layer	14	add_layer
54	Can change layer	14	change_layer
55	Can delete layer	14	delete_layer
56	Can view layer	14	view_layer
57	Can add Token	15	add_token
58	Can change Token	15	change_token
59	Can delete Token	15	delete_token
60	Can view Token	15	view_token
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.datasets (id, name, path, version, size, checksum, checksum_type, specifiers, identifiers, search_vector, public) FROM stdin;
a7bc5a73-de17-4408-a21c-8a6b8992092b	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20200914	29019	c5a1addb5daba23e1b6640cf9a385b2679ecb4ae1c0b20361045f4aee937689896f79fb91d4d447cd8c5e755669644b205c2b66eeeb717f0f56f2c2e19adcd32	sha512	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
e5673c3b-27e9-433f-82ac-e85d4d8f018e	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20200914	29019	61a405107917d01ce68f757f94f793d38a51b08b751793408db9b0bda3b6c11d42354bb9ee083b80479e4978112c4d89f92aea81ab4fc47af954084bd168a33d	sha512	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A	f
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	metadata	dataset
8	metadata	file
9	metadata	resource
10	metadata	tree
11	metadata	word
12	metadata	attribute
13	search	facet
14	wizard	layer
15	authtoken	token
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2020-09-14 18:39:01.236146+02
2	auth	0001_initial	2020-09-14 18:39:01.285421+02
3	admin	0001_initial	2020-09-14 18:39:01.354017+02
4	admin	0002_logentry_remove_auto_add	2020-09-14 18:39:01.37243+02
5	admin	0003_logentry_add_action_flag_choices	2020-09-14 18:39:01.380796+02
6	contenttypes	0002_remove_content_type_name	2020-09-14 18:39:01.400903+02
7	auth	0002_alter_permission_name_max_length	2020-09-14 18:39:01.405747+02
8	auth	0003_alter_user_email_max_length	2020-09-14 18:39:01.43631+02
9	auth	0004_alter_user_username_opts	2020-09-14 18:39:01.442499+02
10	auth	0005_alter_user_last_login_null	2020-09-14 18:39:01.448741+02
11	auth	0006_require_contenttypes_0002	2020-09-14 18:39:01.450578+02
12	auth	0007_alter_validators_add_error_messages	2020-09-14 18:39:01.457123+02
13	auth	0008_alter_user_username_max_length	2020-09-14 18:39:01.470304+02
14	auth	0009_alter_user_last_name_max_length	2020-09-14 18:39:01.478666+02
15	auth	0010_alter_group_name_max_length	2020-09-14 18:39:01.488184+02
16	auth	0011_update_proxy_permissions	2020-09-14 18:39:01.50059+02
17	authtoken	0001_initial	2020-09-14 18:39:01.516018+02
18	authtoken	0002_auto_20160226_1747	2020-09-14 18:39:01.549387+02
19	search	0001_initial	2020-09-14 18:39:01.557162+02
20	sessions	0001_initial	2020-09-14 18:39:01.569632+02
21	wizard	0001_initial	2020-09-14 18:39:01.585886+02
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.files (id, dataset_id, name, path, version, size, checksum, checksum_type, mime_type, specifiers, identifiers, search_vector) FROM stdin;
32e8519c-9738-4a7a-bc09-7685ac4e80b8	a7bc5a73-de17-4408-a21c-8a6b8992092b	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20200914	9673	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
df49cf16-b41b-4d9f-8c6a-a0e95c186c54	a7bc5a73-de17-4408-a21c-8a6b8992092b	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20200914	9673	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
1200dbab-23cf-42a9-beab-44cf7c7d2c33	a7bc5a73-de17-4408-a21c-8a6b8992092b	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20200914	9673	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'ipsum':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
1444b634-8daf-4865-9a2a-47473e930011	e5673c3b-27e9-433f-82ac-e85d4d8f018e	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20200914	9673	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':13A '2001':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
3d18c164-378d-43cb-98de-6bdbacb5e8ee	e5673c3b-27e9-433f-82ac-e85d4d8f018e	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20200914	9673	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':13A '2002':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
1597ec24-e4c8-46cc-bc34-0ae2ad998dec	e5673c3b-27e9-433f-82ac-e85d4d8f018e	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20200914	9673	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	sha512	application/x-netcdf	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':14A 'amet':9A 'dolor':7A 'global':11A 'lorem':6A 'model':4A,5A 'month':12A 'product':2A 'round':1A 'sector':3A 'sit':8A 'var':10A
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources (id, path, version, doi, datacite) FROM stdin;
0fe88308-59c9-44ee-ac17-c6932368489a	round/product/sector/model	20200914	10.12345/isimip/001	{"dates": {"issued": "2020-01-01", "created": "2020", "collected": "2000/2020"}, "titles": [{"title": "Test"}], "version": "1.0.1", "creators": [{"givenName": "Erika", "familyName": "Mustermann", "affiliation": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "https://ror.org/03e8s1d88"}], "creatorName": "Mustermann, E.", "nameIdentifier": "https://orcid.org/0000-0000-0000-0000"}], "language": "eng", "subjects": [{"subject": "TEST1", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}, {"subject": "Test2", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}], "publisher": "Potsdam Institute for Climate Impact Research", "rightsList": [{"rights": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication", "rightsURI": "https://creativecommons.org/publicdomain/zero/1.0/deed"}], "identifiers": [{"identifier": "10.12345/isimip/001", "identifierType": "DOI"}], "contributors": [{"givenName": "Erika", "familyName": "Mustermann", "affiliation": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "https://ror.org/03e8s1d88"}], "nameIdentifier": "https://orcid.org/0000-0000-0000-0000", "contributorName": "Mustermann, E.", "contributorType": "DataCurator"}], "descriptions": [{"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet.\\n", "descriptionType": "Abstract"}, {"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\\n", "descriptionType": "Methods"}], "geoLocations": [{"geoLocationBox": {"eastBoundLongitude": 179.5, "northBoundLatitude": 89.5, "southBoundLatitude": -89.5, "westBoundLongitude": -179.5}}], "resourceType": "Category", "publicationYear": 2020, "fundingReferences": null, "relatedIdentifiers": [{"relationType": "IsDocumentedBy", "relatedIdentifier": "https://protocol.isimip.org", "relatedIdentifierType": "URL"}, {"relationType": "References", "relatedIdentifier": "https://www.isimip.org/outcomes/publications-overview-page", "relatedIdentifierType": "URL"}, {"relationType": "IsNewVersionOf", "relatedIdentifier": "10.12345/isimip/001", "relatedIdentifierType": "DOI"}], "resourceTypeGeneral": "Dataset"}
\.


--
-- Data for Name: resources_datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources_datasets (resource_id, dataset_id) FROM stdin;
0fe88308-59c9-44ee-ac17-c6932368489a	a7bc5a73-de17-4408-a21c-8a6b8992092b
0fe88308-59c9-44ee-ac17-c6932368489a	e5673c3b-27e9-433f-82ac-e85d4d8f018e
\.


--
-- Data for Name: search_facet; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.search_facet (id, title, attribute, "order") FROM stdin;
\.


--
-- Data for Name: trees; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.trees (id, tree_dict, tree_list) FROM stdin;
399aa3b2-8cec-44bd-bf69-3bc0c45ee48e	{}	[]
\.


--
-- Data for Name: wizard_layer; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.wizard_layer (id, title, attribute, "order") FROM stdin;
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 60, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 15, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 21, true);


--
-- Name: search_facet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.search_facet_id_seq', 1, false);


--
-- Name: wizard_layer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: isimip_metadata
--

SELECT pg_catalog.setval('public.wizard_layer_id_seq', 1, false);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


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
-- Name: search_facet search_facet_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.search_facet
    ADD CONSTRAINT search_facet_pkey PRIMARY KEY (id);


--
-- Name: trees trees_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.trees
    ADD CONSTRAINT trees_pkey PRIMARY KEY (id);


--
-- Name: wizard_layer wizard_layer_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.wizard_layer
    ADD CONSTRAINT wizard_layer_pkey PRIMARY KEY (id);


--
-- Name: attributes_key_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX attributes_key_idx ON public.attributes USING btree (key);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- Name: datasets_search_vector_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX datasets_search_vector_idx ON public.datasets USING gin (search_vector);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


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
-- Name: ix_resources_doi; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_resources_doi ON public.resources USING btree (doi);


--
-- Name: ix_resources_path; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_resources_path ON public.resources USING btree (path);


--
-- Name: ix_resources_version; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX ix_resources_version ON public.resources USING btree (version);


--
-- Name: words_word_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX words_word_idx ON public.words USING gin (word public.gin_trgm_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


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

