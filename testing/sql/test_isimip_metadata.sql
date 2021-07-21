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
-- Name: account_emailaddress; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.account_emailaddress (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    verified boolean NOT NULL,
    "primary" boolean NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.account_emailaddress OWNER TO jochen;

--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.account_emailaddress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_emailaddress_id_seq OWNER TO jochen;

--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.account_emailaddress_id_seq OWNED BY public.account_emailaddress.id;


--
-- Name: account_emailconfirmation; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.account_emailconfirmation (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    sent timestamp with time zone,
    key character varying(64) NOT NULL,
    email_address_id integer NOT NULL
);


ALTER TABLE public.account_emailconfirmation OWNER TO jochen;

--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.account_emailconfirmation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_emailconfirmation_id_seq OWNER TO jochen;

--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.account_emailconfirmation_id_seq OWNED BY public.account_emailconfirmation.id;


--
-- Name: annotations_annotation; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_annotation (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    specifiers jsonb NOT NULL,
    datasets uuid[] NOT NULL,
    version_after character varying(8) NOT NULL,
    version_before character varying(8) NOT NULL
);


ALTER TABLE public.annotations_annotation OWNER TO jochen;

--
-- Name: annotations_annotation_downloads; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_annotation_downloads (
    id integer NOT NULL,
    annotation_id integer NOT NULL,
    download_id integer NOT NULL
);


ALTER TABLE public.annotations_annotation_downloads OWNER TO jochen;

--
-- Name: annotations_annotation_downloads_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_annotation_downloads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_annotation_downloads_id_seq OWNER TO jochen;

--
-- Name: annotations_annotation_downloads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_annotation_downloads_id_seq OWNED BY public.annotations_annotation_downloads.id;


--
-- Name: annotations_annotation_figures; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_annotation_figures (
    id integer NOT NULL,
    annotation_id integer NOT NULL,
    figure_id integer NOT NULL
);


ALTER TABLE public.annotations_annotation_figures OWNER TO jochen;

--
-- Name: annotations_annotation_figures_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_annotation_figures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_annotation_figures_id_seq OWNER TO jochen;

--
-- Name: annotations_annotation_figures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_annotation_figures_id_seq OWNED BY public.annotations_annotation_figures.id;


--
-- Name: annotations_annotation_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_annotation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_annotation_id_seq OWNER TO jochen;

--
-- Name: annotations_annotation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_annotation_id_seq OWNED BY public.annotations_annotation.id;


--
-- Name: annotations_annotation_references; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_annotation_references (
    id integer NOT NULL,
    annotation_id integer NOT NULL,
    reference_id integer NOT NULL
);


ALTER TABLE public.annotations_annotation_references OWNER TO jochen;

--
-- Name: annotations_annotation_references_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_annotation_references_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_annotation_references_id_seq OWNER TO jochen;

--
-- Name: annotations_annotation_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_annotation_references_id_seq OWNED BY public.annotations_annotation_references.id;


--
-- Name: annotations_download; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_download (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    file character varying(100) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE public.annotations_download OWNER TO jochen;

--
-- Name: annotations_download_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_download_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_download_id_seq OWNER TO jochen;

--
-- Name: annotations_download_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_download_id_seq OWNED BY public.annotations_download.id;


--
-- Name: annotations_figure; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_figure (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    image character varying(100) NOT NULL,
    caption text NOT NULL,
    credits text NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE public.annotations_figure OWNER TO jochen;

--
-- Name: annotations_figure_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_figure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_figure_id_seq OWNER TO jochen;

--
-- Name: annotations_figure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_figure_id_seq OWNED BY public.annotations_figure.id;


--
-- Name: annotations_reference; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.annotations_reference (
    id integer NOT NULL,
    title text NOT NULL,
    identifier character varying(200) NOT NULL,
    identifier_type text NOT NULL,
    reference_type text NOT NULL
);


ALTER TABLE public.annotations_reference OWNER TO jochen;

--
-- Name: annotations_reference_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.annotations_reference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.annotations_reference_id_seq OWNER TO jochen;

--
-- Name: annotations_reference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.annotations_reference_id_seq OWNED BY public.annotations_reference.id;


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
    tree_path text,
    rights text,
    created timestamp without time zone,
    updated timestamp without time zone,
    published timestamp without time zone,
    archived timestamp without time zone
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
-- Name: auth_group; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO jochen;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO jochen;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO jochen;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO jochen;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO jochen;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO jochen;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: jochen
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


ALTER TABLE public.auth_user OWNER TO jochen;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO jochen;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO jochen;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO jochen;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO jochen;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO jochen;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO jochen;

--
-- Name: caveats_caveat; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.caveats_caveat (
    id integer NOT NULL,
    title character varying(512) NOT NULL,
    description text NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    severity text NOT NULL,
    status text NOT NULL,
    specifiers jsonb NOT NULL,
    datasets uuid[] NOT NULL,
    creator_id integer,
    public boolean NOT NULL,
    version_after character varying(8) NOT NULL,
    version_before character varying(8) NOT NULL,
    email boolean NOT NULL
);


ALTER TABLE public.caveats_caveat OWNER TO jochen;

--
-- Name: caveats_caveat_downloads; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.caveats_caveat_downloads (
    id integer NOT NULL,
    caveat_id integer NOT NULL,
    download_id integer NOT NULL
);


ALTER TABLE public.caveats_caveat_downloads OWNER TO jochen;

--
-- Name: caveats_caveat_downloads_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.caveats_caveat_downloads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_caveat_downloads_id_seq OWNER TO jochen;

--
-- Name: caveats_caveat_downloads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.caveats_caveat_downloads_id_seq OWNED BY public.caveats_caveat_downloads.id;


--
-- Name: caveats_caveat_figures; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.caveats_caveat_figures (
    id integer NOT NULL,
    caveat_id integer NOT NULL,
    figure_id integer NOT NULL
);


ALTER TABLE public.caveats_caveat_figures OWNER TO jochen;

--
-- Name: caveats_caveat_figures_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.caveats_caveat_figures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_caveat_figures_id_seq OWNER TO jochen;

--
-- Name: caveats_caveat_figures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.caveats_caveat_figures_id_seq OWNED BY public.caveats_caveat_figures.id;


--
-- Name: caveats_caveat_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.caveats_caveat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_caveat_id_seq OWNER TO jochen;

--
-- Name: caveats_caveat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.caveats_caveat_id_seq OWNED BY public.caveats_caveat.id;


--
-- Name: caveats_caveat_subscribers; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.caveats_caveat_subscribers (
    id integer NOT NULL,
    caveat_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.caveats_caveat_subscribers OWNER TO jochen;

--
-- Name: caveats_caveat_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.caveats_caveat_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_caveat_subscribers_id_seq OWNER TO jochen;

--
-- Name: caveats_caveat_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.caveats_caveat_subscribers_id_seq OWNED BY public.caveats_caveat_subscribers.id;


--
-- Name: caveats_comment; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.caveats_comment (
    id integer NOT NULL,
    text text NOT NULL,
    public boolean NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    caveat_id integer NOT NULL,
    creator_id integer,
    email boolean NOT NULL
);


ALTER TABLE public.caveats_comment OWNER TO jochen;

--
-- Name: caveats_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.caveats_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caveats_comment_id_seq OWNER TO jochen;

--
-- Name: caveats_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.caveats_comment_id_seq OWNED BY public.caveats_comment.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: jochen
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


ALTER TABLE public.django_admin_log OWNER TO jochen;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO jochen;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO jochen;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO jochen;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO jochen;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO jochen;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO jochen;

--
-- Name: django_site; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.django_site (
    id integer NOT NULL,
    domain character varying(100) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.django_site OWNER TO jochen;

--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.django_site_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_site_id_seq OWNER TO jochen;

--
-- Name: django_site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.django_site_id_seq OWNED BY public.django_site.id;


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
-- Name: search_facet; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.search_facet (
    id integer NOT NULL,
    title character varying(32) NOT NULL,
    attribute character varying(32) NOT NULL,
    "order" integer NOT NULL,
    CONSTRAINT search_facet_order_check CHECK (("order" >= 0))
);


ALTER TABLE public.search_facet OWNER TO jochen;

--
-- Name: search_facet_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.search_facet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_facet_id_seq OWNER TO jochen;

--
-- Name: search_facet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.search_facet_id_seq OWNED BY public.search_facet.id;


--
-- Name: socialaccount_socialaccount; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.socialaccount_socialaccount (
    id integer NOT NULL,
    provider character varying(30) NOT NULL,
    uid character varying(191) NOT NULL,
    last_login timestamp with time zone NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    extra_data text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.socialaccount_socialaccount OWNER TO jochen;

--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.socialaccount_socialaccount_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.socialaccount_socialaccount_id_seq OWNER TO jochen;

--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.socialaccount_socialaccount_id_seq OWNED BY public.socialaccount_socialaccount.id;


--
-- Name: socialaccount_socialapp; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.socialaccount_socialapp (
    id integer NOT NULL,
    provider character varying(30) NOT NULL,
    name character varying(40) NOT NULL,
    client_id character varying(191) NOT NULL,
    secret character varying(191) NOT NULL,
    key character varying(191) NOT NULL
);


ALTER TABLE public.socialaccount_socialapp OWNER TO jochen;

--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.socialaccount_socialapp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.socialaccount_socialapp_id_seq OWNER TO jochen;

--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.socialaccount_socialapp_id_seq OWNED BY public.socialaccount_socialapp.id;


--
-- Name: socialaccount_socialapp_sites; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.socialaccount_socialapp_sites (
    id integer NOT NULL,
    socialapp_id integer NOT NULL,
    site_id integer NOT NULL
);


ALTER TABLE public.socialaccount_socialapp_sites OWNER TO jochen;

--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.socialaccount_socialapp_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.socialaccount_socialapp_sites_id_seq OWNER TO jochen;

--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.socialaccount_socialapp_sites_id_seq OWNED BY public.socialaccount_socialapp_sites.id;


--
-- Name: socialaccount_socialtoken; Type: TABLE; Schema: public; Owner: jochen
--

CREATE TABLE public.socialaccount_socialtoken (
    id integer NOT NULL,
    token text NOT NULL,
    token_secret text NOT NULL,
    expires_at timestamp with time zone,
    account_id integer NOT NULL,
    app_id integer NOT NULL
);


ALTER TABLE public.socialaccount_socialtoken OWNER TO jochen;

--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: jochen
--

CREATE SEQUENCE public.socialaccount_socialtoken_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.socialaccount_socialtoken_id_seq OWNER TO jochen;

--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jochen
--

ALTER SEQUENCE public.socialaccount_socialtoken_id_seq OWNED BY public.socialaccount_socialtoken.id;


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
-- Name: words; Type: MATERIALIZED VIEW; Schema: public; Owner: isimip_metadata
--

CREATE MATERIALIZED VIEW public.words AS
 SELECT ts_stat.word
   FROM ts_stat('SELECT search_vector FROM public.datasets'::text) ts_stat(word, ndoc, nentry)
  WITH NO DATA;


ALTER TABLE public.words OWNER TO isimip_metadata;

--
-- Name: account_emailaddress id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailaddress ALTER COLUMN id SET DEFAULT nextval('public.account_emailaddress_id_seq'::regclass);


--
-- Name: account_emailconfirmation id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailconfirmation ALTER COLUMN id SET DEFAULT nextval('public.account_emailconfirmation_id_seq'::regclass);


--
-- Name: annotations_annotation id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation ALTER COLUMN id SET DEFAULT nextval('public.annotations_annotation_id_seq'::regclass);


--
-- Name: annotations_annotation_downloads id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_downloads ALTER COLUMN id SET DEFAULT nextval('public.annotations_annotation_downloads_id_seq'::regclass);


--
-- Name: annotations_annotation_figures id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_figures ALTER COLUMN id SET DEFAULT nextval('public.annotations_annotation_figures_id_seq'::regclass);


--
-- Name: annotations_annotation_references id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_references ALTER COLUMN id SET DEFAULT nextval('public.annotations_annotation_references_id_seq'::regclass);


--
-- Name: annotations_download id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_download ALTER COLUMN id SET DEFAULT nextval('public.annotations_download_id_seq'::regclass);


--
-- Name: annotations_figure id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_figure ALTER COLUMN id SET DEFAULT nextval('public.annotations_figure_id_seq'::regclass);


--
-- Name: annotations_reference id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_reference ALTER COLUMN id SET DEFAULT nextval('public.annotations_reference_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: caveats_caveat id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat ALTER COLUMN id SET DEFAULT nextval('public.caveats_caveat_id_seq'::regclass);


--
-- Name: caveats_caveat_downloads id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_downloads ALTER COLUMN id SET DEFAULT nextval('public.caveats_caveat_downloads_id_seq'::regclass);


--
-- Name: caveats_caveat_figures id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_figures ALTER COLUMN id SET DEFAULT nextval('public.caveats_caveat_figures_id_seq'::regclass);


--
-- Name: caveats_caveat_subscribers id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_subscribers ALTER COLUMN id SET DEFAULT nextval('public.caveats_caveat_subscribers_id_seq'::regclass);


--
-- Name: caveats_comment id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_comment ALTER COLUMN id SET DEFAULT nextval('public.caveats_comment_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: django_site id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_site ALTER COLUMN id SET DEFAULT nextval('public.django_site_id_seq'::regclass);


--
-- Name: search_facet id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.search_facet ALTER COLUMN id SET DEFAULT nextval('public.search_facet_id_seq'::regclass);


--
-- Name: socialaccount_socialaccount id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialaccount ALTER COLUMN id SET DEFAULT nextval('public.socialaccount_socialaccount_id_seq'::regclass);


--
-- Name: socialaccount_socialapp id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp ALTER COLUMN id SET DEFAULT nextval('public.socialaccount_socialapp_id_seq'::regclass);


--
-- Name: socialaccount_socialapp_sites id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites ALTER COLUMN id SET DEFAULT nextval('public.socialaccount_socialapp_sites_id_seq'::regclass);


--
-- Name: socialaccount_socialtoken id; Type: DEFAULT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialtoken ALTER COLUMN id SET DEFAULT nextval('public.socialaccount_socialtoken_id_seq'::regclass);


--
-- Data for Name: account_emailaddress; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.account_emailaddress (id, email, verified, "primary", user_id) FROM stdin;
\.


--
-- Data for Name: account_emailconfirmation; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.account_emailconfirmation (id, created, sent, key, email_address_id) FROM stdin;
\.


--
-- Data for Name: annotations_annotation; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_annotation (id, title, specifiers, datasets, version_after, version_before) FROM stdin;
\.


--
-- Data for Name: annotations_annotation_downloads; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_annotation_downloads (id, annotation_id, download_id) FROM stdin;
\.


--
-- Data for Name: annotations_annotation_figures; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_annotation_figures (id, annotation_id, figure_id) FROM stdin;
\.


--
-- Data for Name: annotations_annotation_references; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_annotation_references (id, annotation_id, reference_id) FROM stdin;
\.


--
-- Data for Name: annotations_download; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_download (id, title, file, created, updated) FROM stdin;
\.


--
-- Data for Name: annotations_figure; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_figure (id, title, image, caption, credits, created, updated) FROM stdin;
\.


--
-- Data for Name: annotations_reference; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.annotations_reference (id, title, identifier, identifier_type, reference_type) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: jochen
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
25	Can add site	7	add_site
26	Can change site	7	change_site
27	Can delete site	7	delete_site
28	Can view site	7	view_site
29	Can add figure	8	add_figure
30	Can change figure	8	change_figure
31	Can delete figure	8	delete_figure
32	Can view figure	8	view_figure
33	Can add download	9	add_download
34	Can change download	9	change_download
35	Can delete download	9	delete_download
36	Can view download	9	view_download
37	Can add annotation	10	add_annotation
38	Can change annotation	10	change_annotation
39	Can delete annotation	10	delete_annotation
40	Can view annotation	10	view_annotation
41	Can add reference	11	add_reference
42	Can change reference	11	change_reference
43	Can delete reference	11	delete_reference
44	Can view reference	11	view_reference
45	Can add caveat	12	add_caveat
46	Can change caveat	12	change_caveat
47	Can delete caveat	12	delete_caveat
48	Can view caveat	12	view_caveat
49	Can add comment	13	add_comment
50	Can change comment	13	change_comment
51	Can delete comment	13	delete_comment
52	Can view comment	13	view_comment
53	Can add dataset	14	add_dataset
54	Can change dataset	14	change_dataset
55	Can delete dataset	14	delete_dataset
56	Can view dataset	14	view_dataset
57	Can add file	15	add_file
58	Can change file	15	change_file
59	Can delete file	15	delete_file
60	Can view file	15	view_file
61	Can add resource	16	add_resource
62	Can change resource	16	change_resource
63	Can delete resource	16	delete_resource
64	Can view resource	16	view_resource
65	Can add tree	17	add_tree
66	Can change tree	17	change_tree
67	Can delete tree	17	delete_tree
68	Can view tree	17	view_tree
69	Can add word	18	add_word
70	Can change word	18	change_word
71	Can delete word	18	delete_word
72	Can view word	18	view_word
73	Can add attribute	19	add_attribute
74	Can change attribute	19	change_attribute
75	Can delete attribute	19	delete_attribute
76	Can view attribute	19	view_attribute
77	Can add facet	20	add_facet
78	Can change facet	20	change_facet
79	Can delete facet	20	delete_facet
80	Can view facet	20	view_facet
81	Can add Token	21	add_token
82	Can change Token	21	change_token
83	Can delete Token	21	delete_token
84	Can view Token	21	view_token
85	Can add email address	22	add_emailaddress
86	Can change email address	22	change_emailaddress
87	Can delete email address	22	delete_emailaddress
88	Can view email address	22	view_emailaddress
89	Can add email confirmation	23	add_emailconfirmation
90	Can change email confirmation	23	change_emailconfirmation
91	Can delete email confirmation	23	delete_emailconfirmation
92	Can view email confirmation	23	view_emailconfirmation
93	Can add social account	24	add_socialaccount
94	Can change social account	24	change_socialaccount
95	Can delete social account	24	delete_socialaccount
96	Can view social account	24	view_socialaccount
97	Can add social application	25	add_socialapp
98	Can change social application	25	change_socialapp
99	Can delete social application	25	delete_socialapp
100	Can view social application	25	view_socialapp
101	Can add social application token	26	add_socialtoken
102	Can change social application token	26	change_socialtoken
103	Can delete social application token	26	delete_socialtoken
104	Can view social application token	26	view_socialtoken
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- Data for Name: caveats_caveat; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.caveats_caveat (id, title, description, created, updated, severity, status, specifiers, datasets, creator_id, public, version_after, version_before, email) FROM stdin;
\.


--
-- Data for Name: caveats_caveat_downloads; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.caveats_caveat_downloads (id, caveat_id, download_id) FROM stdin;
\.


--
-- Data for Name: caveats_caveat_figures; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.caveats_caveat_figures (id, caveat_id, figure_id) FROM stdin;
\.


--
-- Data for Name: caveats_caveat_subscribers; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.caveats_caveat_subscribers (id, caveat_id, user_id) FROM stdin;
\.


--
-- Data for Name: caveats_comment; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.caveats_comment (id, text, public, created, updated, caveat_id, creator_id, email) FROM stdin;
\.


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.datasets (id, target_id, name, path, version, size, specifiers, identifiers, search_vector, public, tree_path, rights, created, updated, published, archived) FROM stdin;
462537f1-bee4-4f81-9641-e44b40ede4ee	\N	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly	20210721	21720	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':11A 'dolor':1A 'global':4A 'ipsum':12A 'model':7A 'month':10A 'product':5A 'round':8A 'sector':2A 'sector2':9A 'sit':3A 'var':6A	t	model/ipsum/dolor/sit/amet/var	\N	2021-07-21 18:02:34.677608	\N	2021-07-21 18:02:35.250366	\N
9770c541-a74c-4f8b-a616-8c5f2c6e70fb	\N	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly	20210721	21720	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':11A 'dolor':1A 'global':4A 'lorem':12A 'model':7A 'month':10A 'product':5A 'round':8A 'sector':2A 'sector2':9A 'sit':3A 'var':6A	t	model/lorem/dolor/sit/amet/var	\N	2021-07-21 18:02:34.724756	\N	2021-07-21 18:02:35.254818	\N
713ee41f-0fef-47f8-a321-87a9d496a9b9	9770c541-a74c-4f8b-a616-8c5f2c6e70fb	model_lorem_dolor_sit_amet_var_global_monthly	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly	20210721	21720	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':10A 'dolor':1A 'global':5A 'lorem':11A 'model':6A 'month':9A 'product':4A 'round':7A 'sector2':8A 'sit':2A 'var':3A	t	model/lorem/dolor/sit/amet/var	\N	2021-07-21 18:02:36.874783	\N	\N	\N
c865e47d-7145-4fc7-93d1-cd9de92f5e71	462537f1-bee4-4f81-9641-e44b40ede4ee	model_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly	20210721	21720	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':10A 'dolor':1A 'global':5A 'ipsum':11A 'model':6A 'month':9A 'product':4A 'round':7A 'sector2':8A 'sit':2A 'var':3A	t	model/ipsum/dolor/sit/amet/var	\N	2021-07-21 18:02:36.821886	\N	\N	\N
e090e572-df18-4e0c-af67-0ccf4bd999b8	\N	model2_ipsum_dolor_sit_amet_var_global_monthly	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly	20210721	21726	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model2"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':7A 'dolor':4A 'global':10A 'ipsum':5A 'model2':6A 'month':8A 'product':11A 'round':9A 'sector':3A 'sit':1A 'var':2A	f	model2/ipsum/dolor/sit/amet/var	\N	2021-07-21 18:02:34.749487	\N	2021-07-21 18:02:35.257869	2021-07-21 18:02:39.084925
ab86a924-4fb9-4fea-9999-6375d11e93ed	\N	model2_lorem_dolor_sit_amet_var_global_monthly	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly	20210721	21726	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "timestep": "monthly", "variable": "var", "modelname": "model2"}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep}	'amet':7A 'dolor':4A 'global':10A 'lorem':8A 'model2':6A 'month':5A 'product':11A 'round':9A 'sector':3A 'sit':1A 'var':2A	f	model2/lorem/dolor/sit/amet/var	\N	2021-07-21 18:02:34.773545	\N	2021-07-21 18:02:35.260793	2021-07-21 18:02:39.104868
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	sites	site
8	annotations	figure
9	annotations	download
10	annotations	annotation
11	annotations	reference
12	caveats	caveat
13	caveats	comment
14	metadata	dataset
15	metadata	file
16	metadata	resource
17	metadata	tree
18	metadata	word
19	metadata	attribute
20	search	facet
21	authtoken	token
22	account	emailaddress
23	account	emailconfirmation
24	socialaccount	socialaccount
25	socialaccount	socialapp
26	socialaccount	socialtoken
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2021-07-14 12:43:47.466403+02
2	auth	0001_initial	2021-07-14 12:43:47.514039+02
3	account	0001_initial	2021-07-14 12:43:47.597221+02
4	account	0002_email_max_length	2021-07-14 12:43:47.626936+02
5	admin	0001_initial	2021-07-14 12:43:47.64646+02
6	admin	0002_logentry_remove_auto_add	2021-07-14 12:43:47.667087+02
7	admin	0003_logentry_add_action_flag_choices	2021-07-14 12:43:47.674553+02
8	annotations	0001_initial	2021-07-14 12:43:47.686242+02
9	annotations	0002_download	2021-07-14 12:43:47.696331+02
10	annotations	0003_add_created_updated	2021-07-14 12:43:47.709423+02
11	annotations	0004_annotation	2021-07-14 12:43:47.734375+02
12	annotations	0005_reference	2021-07-14 12:43:47.772019+02
13	annotations	0006_annotation_references	2021-07-14 12:43:47.787041+02
14	contenttypes	0002_remove_content_type_name	2021-07-14 12:43:47.824818+02
15	auth	0002_alter_permission_name_max_length	2021-07-14 12:43:47.830365+02
16	auth	0003_alter_user_email_max_length	2021-07-14 12:43:47.842473+02
17	auth	0004_alter_user_username_opts	2021-07-14 12:43:47.849469+02
18	auth	0005_alter_user_last_login_null	2021-07-14 12:43:47.858436+02
19	auth	0006_require_contenttypes_0002	2021-07-14 12:43:47.860959+02
20	auth	0007_alter_validators_add_error_messages	2021-07-14 12:43:47.870465+02
21	auth	0008_alter_user_username_max_length	2021-07-14 12:43:47.8832+02
22	auth	0009_alter_user_last_name_max_length	2021-07-14 12:43:47.895601+02
23	auth	0010_alter_group_name_max_length	2021-07-14 12:43:47.906792+02
24	auth	0011_update_proxy_permissions	2021-07-14 12:43:47.923136+02
25	authtoken	0001_initial	2021-07-14 12:43:47.93731+02
26	authtoken	0002_auto_20160226_1747	2021-07-14 12:43:47.9763+02
27	caveats	0001_initial	2021-07-14 12:43:48.024459+02
28	caveats	0002_add_fields	2021-07-14 12:43:48.054516+02
29	caveats	0003_comment	2021-07-14 12:43:48.073611+02
30	caveats	0004_add_subscribers	2021-07-14 12:43:48.108426+02
31	caveats	0005_add_figures	2021-07-14 12:43:48.142064+02
32	caveats	0006_caveat_downloads	2021-07-14 12:43:48.176225+02
33	caveats	0007_add_email	2021-07-14 12:43:48.238676+02
34	search	0001_initial	2021-07-14 12:43:48.249502+02
35	sessions	0001_initial	2021-07-14 12:43:48.261908+02
36	sites	0001_initial	2021-07-14 12:43:48.281507+02
37	sites	0002_alter_domain_unique	2021-07-14 12:43:48.295076+02
38	socialaccount	0001_initial	2021-07-14 12:43:48.383157+02
39	socialaccount	0002_token_max_lengths	2021-07-14 12:43:48.43971+02
40	socialaccount	0003_extra_data_default_dict	2021-07-14 12:43:48.451888+02
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.django_site (id, domain, name) FROM stdin;
1	example.com	example.com
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.files (id, dataset_id, target_id, name, path, version, size, checksum, checksum_type, netcdf_header, specifiers, identifiers, search_vector, created, updated) FROM stdin;
31e591be-10ba-40bf-a058-8cdf3ed5346d	462537f1-bee4-4f81-9641-e44b40ede4ee	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7240	dfd5eefaca63079904763f85449d455fe3e2736f3ed5c8045385b84fcf0d055473b97b713415ffa38d99c1813a4121c1ec421e3a4ff31a45054bb4d2b68b8730	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':14A '2003':8A 'amet':12A 'dolor':1A 'global':4A 'ipsum':13A 'model':7A 'month':11A 'product':5A 'round':9A 'sector':2A 'sector2':10A 'sit':3A 'var':6A	2021-07-21 18:02:34.707218	\N
1fbdfa78-a675-4d90-8df6-53a9d6fb8c42	713ee41f-0fef-47f8-a321-87a9d496a9b9	e00a4419-7b41-4839-83ab-78da29ebf8df	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7240	c1221e529a4fc0a9ada921e5ce1795b57fac8b27e8814c8514a66601d38ad6c38947a3ad67b1ded1b169f996d4879e966ce1ed667ea4354584ed0451fab4b400	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':6A '2001':10A 'amet':12A 'dolor':1A 'global':5A 'lorem':13A 'model':7A 'month':11A 'product':4A 'round':8A 'sector2':9A 'sit':2A 'var':3A	2021-07-21 18:02:36.886041	\N
e00a4419-7b41-4839-83ab-78da29ebf8df	9770c541-a74c-4f8b-a616-8c5f2c6e70fb	\N	model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7240	c1221e529a4fc0a9ada921e5ce1795b57fac8b27e8814c8514a66601d38ad6c38947a3ad67b1ded1b169f996d4879e966ce1ed667ea4354584ed0451fab4b400	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':7A '2001':10A 'amet':13A 'dolor':1A 'global':4A 'lorem':14A 'model':8A 'month':12A 'product':5A 'round':9A 'sector':2A 'sector2':11A 'sit':3A 'var':6A	2021-07-21 18:02:34.733834	\N
98d3e32f-03f0-4500-b3ed-06d2061b6d9b	713ee41f-0fef-47f8-a321-87a9d496a9b9	cfddbbc1-37a8-4f71-b1d1-f2bf030d8947	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7240	4a32c4a87a16715ccdf4e2c22981d9473dd2f055a3e4ba3628b99d3724a03142d1029b6eade997e947cc29b8dd6d816b486e1b081495c21f35aa708b9dc50cce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':9A '2002':12A 'amet':11A 'dolor':1A 'global':5A 'lorem':13A 'model':6A 'month':10A 'product':4A 'round':7A 'sector2':8A 'sit':2A 'var':3A	2021-07-21 18:02:36.896503	\N
cfddbbc1-37a8-4f71-b1d1-f2bf030d8947	9770c541-a74c-4f8b-a616-8c5f2c6e70fb	\N	model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7240	4a32c4a87a16715ccdf4e2c22981d9473dd2f055a3e4ba3628b99d3724a03142d1029b6eade997e947cc29b8dd6d816b486e1b081495c21f35aa708b9dc50cce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':9A '2002':13A 'amet':12A 'dolor':1A 'global':4A 'lorem':14A 'model':7A 'month':11A 'product':5A 'round':8A 'sector':2A 'sector2':10A 'sit':3A 'var':6A	2021-07-21 18:02:34.740111	\N
006ea045-f91c-4e8f-87ba-17d82b986a61	713ee41f-0fef-47f8-a321-87a9d496a9b9	65527e26-827b-4b47-bf29-44c8cb9c6ee0	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector2/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7240	63c35b8bd61b6b51c9b52b4431db9ee6b8bb89a1dd876f67dd14d57c7b9d2b99883e9c80cf3d045811fabf0b1b850537d5a5d73c4071980cea4efcd99a1451ce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':12A '2003':7A 'amet':11A 'dolor':1A 'global':5A 'lorem':13A 'model':6A 'month':10A 'product':4A 'round':8A 'sector2':9A 'sit':2A 'var':3A	2021-07-21 18:02:36.908144	\N
65527e26-827b-4b47-bf29-44c8cb9c6ee0	9770c541-a74c-4f8b-a616-8c5f2c6e70fb	\N	model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7240	63c35b8bd61b6b51c9b52b4431db9ee6b8bb89a1dd876f67dd14d57c7b9d2b99883e9c80cf3d045811fabf0b1b850537d5a5d73c4071980cea4efcd99a1451ce	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':8A 'amet':12A 'dolor':1A 'global':4A 'lorem':14A 'model':7A 'month':11A 'product':5A 'round':9A 'sector':2A 'sector2':10A 'sit':3A 'var':6A	2021-07-21 18:02:34.746403	\N
04bb6522-542d-49d5-a5da-59150e03d02a	e090e572-df18-4e0c-af67-0ccf4bd999b8	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7242	46359d1241f18c33070741d84a719a73ab20374dc261bb8d5097b2d580dfbeaf9d74950345d090c180e88f1b2f74fd7fe86da42d1afb330459f364d68730fade	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':3A '2001':10A 'amet':8A 'dolor':5A 'global':12A 'ipsum':6A 'model2':7A 'month':9A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':2A	2021-07-21 18:02:34.756646	\N
7b22f3b1-a92a-480b-852d-c23b84fef54c	e090e572-df18-4e0c-af67-0ccf4bd999b8	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7242	64d58a1761137a4abc2e243a91076ce39665b72860900708defb5ac1db1bc840b22d1a5ae053bd1a9b507a0b5dab5479460494dedeca127cffb7f497d1a5a8c8	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':10A '2002':2A 'amet':8A 'dolor':5A 'global':12A 'ipsum':6A 'model2':7A 'month':9A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':3A	2021-07-21 18:02:34.763863	\N
9dc7eb37-651b-4336-977f-d9f3709ff662	e090e572-df18-4e0c-af67-0ccf4bd999b8	\N	model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7242	02bc8be8c82a5c67e1efed70494106161f6b5532ce95ce45c376ae168b78a65db89eb030bb407c9509f148bf49aa5606b3766b62593150145bdda2d97fa34e65	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':2A '2003':6A 'amet':9A 'dolor':5A 'global':12A 'ipsum':7A 'model2':8A 'month':10A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':3A	2021-07-21 18:02:34.770393	\N
eeb34d9c-a50d-4500-b1b4-cb4f161169fa	ab86a924-4fb9-4fea-9999-6375d11e93ed	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7242	a935796d08749571f7821cc290c1a9555cabbf57b117d964538c5e7c1e2b037cde96be6303f6a8beb4da19f968744d5ce59ae4cfaeed9dd9b24698410f1941ad	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':3A '2001':9A 'amet':8A 'dolor':5A 'global':12A 'lorem':10A 'model2':7A 'month':6A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':2A	2021-07-21 18:02:34.779755	\N
7bbfc48d-4299-4372-abba-544a25c8f84d	ab86a924-4fb9-4fea-9999-6375d11e93ed	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7242	d520e3920dc8ac7e0330fdacd53f29fa95bb3c92a9059964ee232b150fc0dd5b7d149830f2e7d25b5f3d7e042b5a927927cd2dcd6d93f7fdcfa55f4f6a257ab7	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':9A '2002':2A 'amet':8A 'dolor':5A 'global':12A 'lorem':10A 'model2':7A 'month':6A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':3A	2021-07-21 18:02:34.787702	\N
b254466d-5657-4323-bae6-572939c8acb9	ab86a924-4fb9-4fea-9999-6375d11e93ed	\N	model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7242	85344409f100bbc1a3de26d4535223502e86f679499ea002291c327f21700bea6631ae3319d95202af13e9edf83892375420804488cdd0ae27729c522c4583c1	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model2/model2_lorem_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "lorem", "delta": "amet", "gamma": "sit", "model": "model2", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model2", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':2A '2003':6A 'amet':9A 'dolor':5A 'global':12A 'lorem':10A 'model2':8A 'month':7A 'product':13A 'round':11A 'sector':4A 'sit':1A 'var':3A	2021-07-21 18:02:34.794145	\N
44b28004-8083-43eb-82ad-831c272ea869	462537f1-bee4-4f81-9641-e44b40ede4ee	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7240	9f6b9147133792713800c8912f1420e1ad1c679d8dd0aa525e73eef2c54f541d4bd1085243c372df408b2bf10bb6d50055d0bbb53d13102a502bb80e72443e70	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':9A '2002':14A 'amet':12A 'dolor':1A 'global':4A 'ipsum':13A 'model':7A 'month':11A 'product':5A 'round':8A 'sector':2A 'sector2':10A 'sit':3A 'var':6A	2021-07-21 18:02:34.699991	\N
d8534865-b620-4a1f-8d9b-12b973f576af	c865e47d-7145-4fc7-93d1-cd9de92f5e71	e16e8cf7-5045-45b8-a022-4f04a861e0db	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7240	a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':6A '2001':10A 'amet':12A 'dolor':1A 'global':5A 'ipsum':13A 'model':7A 'month':11A 'product':4A 'round':8A 'sector2':9A 'sit':2A 'var':3A	2021-07-21 18:02:36.843409	\N
e16e8cf7-5045-45b8-a022-4f04a861e0db	462537f1-bee4-4f81-9641-e44b40ede4ee	\N	model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc	20210721	7240	a6f1e2a0b4b57b1bb2466bd064896cf9b0dba571ef8547b277f20daaa52690e4906a69310c01f275c4b3c1231a1ae2134bbd55bdf526aefe68abf8ce5e10083e	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2000_2001.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector", "product": "product", "end_year": 2001, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2000}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2000':7A '2001':10A 'amet':13A 'dolor':1A 'global':4A 'ipsum':14A 'model':8A 'month':12A 'product':5A 'round':9A 'sector':2A 'sector2':11A 'sit':3A 'var':6A	2021-07-21 18:02:34.690424	\N
adfafada-03ce-4f43-97a9-5d1f62557232	c865e47d-7145-4fc7-93d1-cd9de92f5e71	44b28004-8083-43eb-82ad-831c272ea869	model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc	20210721	7240	9f6b9147133792713800c8912f1420e1ad1c679d8dd0aa525e73eef2c54f541d4bd1085243c372df408b2bf10bb6d50055d0bbb53d13102a502bb80e72443e70	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2001_2002.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2002, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2001}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2001':9A '2002':13A 'amet':11A 'dolor':1A 'global':5A 'ipsum':12A 'model':6A 'month':10A 'product':4A 'round':7A 'sector2':8A 'sit':2A 'var':3A	2021-07-21 18:02:36.857369	\N
592bab12-e189-4e13-ac3c-f1229c619557	c865e47d-7145-4fc7-93d1-cd9de92f5e71	31e591be-10ba-40bf-a058-8cdf3ed5346d	model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	round/product/sector2/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc	20210721	7240	dfd5eefaca63079904763f85449d455fe3e2736f3ed5c8045385b84fcf0d055473b97b713415ffa38d99c1813a4121c1ec421e3a4ff31a45054bb4d2b68b8730	sha512	{"variables": {"lat": {}, "lon": {}, "var": {}, "time": {}}, "dimensions": {"lat": 360, "lon": 720, "time": 0}, "global_attributes": {"path": "/home/jochen/code/isimip/isimip-publisher/testing/work/round/product/sector/model/model_ipsum_dolor_sit_amet_var_global_monthly_2002_2003.nc", "contact": "Test Contact <test@example.com>", "Conventions": "CF-1.0", "institution": "Institute of Tests"}}	{"beta": "dolor", "alpha": "ipsum", "delta": "amet", "gamma": "sit", "model": "model", "round": "round", "region": "global", "sector": "sector2", "product": "product", "end_year": 2003, "timestep": "monthly", "variable": "var", "modelname": "model", "start_year": 2002}	{round,product,sector,model,modelname,alpha,beta,gamma,delta,variable,region,timestep,start_year,end_year}	'2002':13A '2003':7A 'amet':11A 'dolor':1A 'global':5A 'ipsum':12A 'model':6A 'month':10A 'product':4A 'round':8A 'sector2':9A 'sit':2A 'var':3A	2021-07-21 18:02:36.868318	\N
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources (id, doi, title, paths, datacite, created, updated) FROM stdin;
aa86e4ad-39ae-42f0-aad7-19e52ef9e834	10.12345/ISIMIP.001	Test	{round/product/sector/model}	{"dates": [{"date": "2020", "dateType": "Created"}, {"date": "2020-07-01", "dateType": "Issued"}], "titles": [{"title": "Test"}], "version": "1.0.1", "creators": [{"name": "Mustermann, E.", "givenName": "Erika", "familyName": "Mustermann", "affiliations": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "03e8s1d88"}], "nameIdentifier": "0000-0000-0000-0000"}], "language": "eng", "subjects": [{"subject": "TEST1", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}, {"subject": "Test2", "schemeURI": "http://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords", "subjectScheme": "NASA/GCMD Earth Science Keywords"}], "publisher": "Potsdam Institute for Climate Impact Research", "rightsList": [{"rights": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication", "rightsURI": "https://creativecommons.org/publicdomain/zero/1.0/"}], "identifiers": [{"identifier": "10.12345/ISIMIP.001", "identifierType": "DOI"}], "contributors": [{"name": "Mustermann, E.", "givenName": "Erika", "familyName": "Mustermann", "affiliations": [{"affiliation": "Potsdam Institute for Climate Impact Research", "affiliationIdentifier": "03e8s1d88"}], "nameIdentifier": "0000-0000-0000-0000", "contributorType": "DataCurator"}], "descriptions": [{"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet.\\n", "descriptionType": "Abstract"}, {"description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\\n", "descriptionType": "Methods"}], "geoLocations": [{"geoLocationBox": {"eastBoundLongitude": 179.5, "northBoundLatitude": 89.5, "southBoundLatitude": -89.5, "westBoundLongitude": -179.5}}], "resourceType": "Category", "publicationYear": 2020, "relatedIdentifiers": [{"relationType": "IsDocumentedBy", "relatedIdentifier": "https://protocol.isimip.org", "relatedIdentifierType": "URL"}, {"relationType": "References", "relatedIdentifier": "https://www.isimip.org/outcomes/publications-overview-page", "relatedIdentifierType": "URL"}, {"relationType": "IsNewVersionOf", "relatedIdentifier": "10.12345/isimip/001", "relatedIdentifierType": "DOI"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/462537f1-bee4-4f81-9641-e44b40ede4ee", "relatedIdentifierType": "URL"}, {"relationType": "HasPart", "relatedIdentifier": "http://localhost:8000/datasets/9770c541-a74c-4f8b-a616-8c5f2c6e70fb", "relatedIdentifierType": "URL"}], "resourceTypeGeneral": "Dataset"}	2021-07-21 18:02:37.376651	2021-07-21 18:02:37.786294
\.


--
-- Data for Name: resources_datasets; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.resources_datasets (resource_id, dataset_id) FROM stdin;
aa86e4ad-39ae-42f0-aad7-19e52ef9e834	462537f1-bee4-4f81-9641-e44b40ede4ee
aa86e4ad-39ae-42f0-aad7-19e52ef9e834	9770c541-a74c-4f8b-a616-8c5f2c6e70fb
\.


--
-- Data for Name: search_facet; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.search_facet (id, title, attribute, "order") FROM stdin;
\.


--
-- Data for Name: socialaccount_socialaccount; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.socialaccount_socialaccount (id, provider, uid, last_login, date_joined, extra_data, user_id) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.socialaccount_socialapp (id, provider, name, client_id, secret, key) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp_sites; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.socialaccount_socialapp_sites (id, socialapp_id, site_id) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialtoken; Type: TABLE DATA; Schema: public; Owner: jochen
--

COPY public.socialaccount_socialtoken (id, token, token_secret, expires_at, account_id, app_id) FROM stdin;
\.


--
-- Data for Name: trees; Type: TABLE DATA; Schema: public; Owner: isimip_metadata
--

COPY public.trees (id, tree_dict, created, updated) FROM stdin;
d30d2d2c-a9f8-42d5-ab96-32609c66b03c	{"model": {"items": {"ipsum": {"items": {"dolor": {"items": {"sit": {"items": {"amet": {"items": {"var": {"items": {}, "specifier": "var", "identifier": "variable"}}, "specifier": "amet", "identifier": "delta"}}, "specifier": "sit", "identifier": "gamma"}}, "specifier": "dolor", "identifier": "beta"}}, "specifier": "ipsum", "identifier": "alpha"}, "lorem": {"items": {"dolor": {"items": {"sit": {"items": {"amet": {"items": {"var": {"items": {}, "specifier": "var", "identifier": "variable"}}, "specifier": "amet", "identifier": "delta"}}, "specifier": "sit", "identifier": "gamma"}}, "specifier": "dolor", "identifier": "beta"}}, "specifier": "lorem", "identifier": "alpha"}}, "specifier": "model", "identifier": "modelname"}}	\N	\N
\.


--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.account_emailaddress_id_seq', 1, false);


--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.account_emailconfirmation_id_seq', 1, false);


--
-- Name: annotations_annotation_downloads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_annotation_downloads_id_seq', 1, false);


--
-- Name: annotations_annotation_figures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_annotation_figures_id_seq', 1, false);


--
-- Name: annotations_annotation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_annotation_id_seq', 1, false);


--
-- Name: annotations_annotation_references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_annotation_references_id_seq', 1, false);


--
-- Name: annotations_download_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_download_id_seq', 1, false);


--
-- Name: annotations_figure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_figure_id_seq', 1, false);


--
-- Name: annotations_reference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.annotations_reference_id_seq', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 104, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: caveats_caveat_downloads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.caveats_caveat_downloads_id_seq', 1, false);


--
-- Name: caveats_caveat_figures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.caveats_caveat_figures_id_seq', 1, false);


--
-- Name: caveats_caveat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.caveats_caveat_id_seq', 1, false);


--
-- Name: caveats_caveat_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.caveats_caveat_subscribers_id_seq', 1, false);


--
-- Name: caveats_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.caveats_comment_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 26, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 40, true);


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.django_site_id_seq', 1, true);


--
-- Name: search_facet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.search_facet_id_seq', 1, false);


--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.socialaccount_socialaccount_id_seq', 1, false);


--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.socialaccount_socialapp_id_seq', 1, false);


--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.socialaccount_socialapp_sites_id_seq', 1, false);


--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jochen
--

SELECT pg_catalog.setval('public.socialaccount_socialtoken_id_seq', 1, false);


--
-- Name: account_emailaddress account_emailaddress_email_key; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_email_key UNIQUE (email);


--
-- Name: account_emailaddress account_emailaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_pkey PRIMARY KEY (id);


--
-- Name: account_emailconfirmation account_emailconfirmation_key_key; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirmation_key_key UNIQUE (key);


--
-- Name: account_emailconfirmation account_emailconfirmation_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirmation_pkey PRIMARY KEY (id);


--
-- Name: annotations_annotation_downloads annotations_annotation_d_annotation_id_download_i_1217ae93_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_downloads
    ADD CONSTRAINT annotations_annotation_d_annotation_id_download_i_1217ae93_uniq UNIQUE (annotation_id, download_id);


--
-- Name: annotations_annotation_downloads annotations_annotation_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_downloads
    ADD CONSTRAINT annotations_annotation_downloads_pkey PRIMARY KEY (id);


--
-- Name: annotations_annotation_figures annotations_annotation_f_annotation_id_figure_id_973c12b1_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_figures
    ADD CONSTRAINT annotations_annotation_f_annotation_id_figure_id_973c12b1_uniq UNIQUE (annotation_id, figure_id);


--
-- Name: annotations_annotation_figures annotations_annotation_figures_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_figures
    ADD CONSTRAINT annotations_annotation_figures_pkey PRIMARY KEY (id);


--
-- Name: annotations_annotation annotations_annotation_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation
    ADD CONSTRAINT annotations_annotation_pkey PRIMARY KEY (id);


--
-- Name: annotations_annotation_references annotations_annotation_r_annotation_id_reference__0d2f3338_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_references
    ADD CONSTRAINT annotations_annotation_r_annotation_id_reference__0d2f3338_uniq UNIQUE (annotation_id, reference_id);


--
-- Name: annotations_annotation_references annotations_annotation_references_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_references
    ADD CONSTRAINT annotations_annotation_references_pkey PRIMARY KEY (id);


--
-- Name: annotations_download annotations_download_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_download
    ADD CONSTRAINT annotations_download_pkey PRIMARY KEY (id);


--
-- Name: annotations_figure annotations_figure_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_figure
    ADD CONSTRAINT annotations_figure_pkey PRIMARY KEY (id);


--
-- Name: annotations_reference annotations_reference_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_reference
    ADD CONSTRAINT annotations_reference_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- Name: caveats_caveat_downloads caveats_caveat_downloads_caveat_id_download_id_3fb45c08_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_downloads
    ADD CONSTRAINT caveats_caveat_downloads_caveat_id_download_id_3fb45c08_uniq UNIQUE (caveat_id, download_id);


--
-- Name: caveats_caveat_downloads caveats_caveat_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_downloads
    ADD CONSTRAINT caveats_caveat_downloads_pkey PRIMARY KEY (id);


--
-- Name: caveats_caveat_figures caveats_caveat_figures_caveat_id_figure_id_477e124a_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_figures
    ADD CONSTRAINT caveats_caveat_figures_caveat_id_figure_id_477e124a_uniq UNIQUE (caveat_id, figure_id);


--
-- Name: caveats_caveat_figures caveats_caveat_figures_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_figures
    ADD CONSTRAINT caveats_caveat_figures_pkey PRIMARY KEY (id);


--
-- Name: caveats_caveat caveats_caveat_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat
    ADD CONSTRAINT caveats_caveat_pkey PRIMARY KEY (id);


--
-- Name: caveats_caveat_subscribers caveats_caveat_subscribers_caveat_id_user_id_3872e952_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_subscribers
    ADD CONSTRAINT caveats_caveat_subscribers_caveat_id_user_id_3872e952_uniq UNIQUE (caveat_id, user_id);


--
-- Name: caveats_caveat_subscribers caveats_caveat_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_subscribers
    ADD CONSTRAINT caveats_caveat_subscribers_pkey PRIMARY KEY (id);


--
-- Name: caveats_comment caveats_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_comment
    ADD CONSTRAINT caveats_comment_pkey PRIMARY KEY (id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: django_site django_site_domain_a2e37b91_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_site
    ADD CONSTRAINT django_site_domain_a2e37b91_uniq UNIQUE (domain);


--
-- Name: django_site django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_site
    ADD CONSTRAINT django_site_pkey PRIMARY KEY (id);


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
-- Name: search_facet search_facet_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.search_facet
    ADD CONSTRAINT search_facet_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_socialaccount_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_provider_uid_fc810c6e_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_socialaccount_provider_uid_fc810c6e_uniq UNIQUE (provider, uid);


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq UNIQUE (socialapp_id, site_id);


--
-- Name: socialaccount_socialapp socialaccount_socialapp_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp
    ADD CONSTRAINT socialaccount_socialapp_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_socialapp_sites_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq UNIQUE (app_id, account_id);


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_socialtoken_pkey PRIMARY KEY (id);


--
-- Name: trees trees_pkey; Type: CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.trees
    ADD CONSTRAINT trees_pkey PRIMARY KEY (id);


--
-- Name: account_emailaddress_email_03be32b2_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX account_emailaddress_email_03be32b2_like ON public.account_emailaddress USING btree (email varchar_pattern_ops);


--
-- Name: account_emailaddress_user_id_2c513194; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX account_emailaddress_user_id_2c513194 ON public.account_emailaddress USING btree (user_id);


--
-- Name: account_emailconfirmation_email_address_id_5b7f8c58; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX account_emailconfirmation_email_address_id_5b7f8c58 ON public.account_emailconfirmation USING btree (email_address_id);


--
-- Name: account_emailconfirmation_key_f43612bd_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX account_emailconfirmation_key_f43612bd_like ON public.account_emailconfirmation USING btree (key varchar_pattern_ops);


--
-- Name: annotations_annotation_downloads_annotation_id_8682f398; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_downloads_annotation_id_8682f398 ON public.annotations_annotation_downloads USING btree (annotation_id);


--
-- Name: annotations_annotation_downloads_download_id_89f27d7c; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_downloads_download_id_89f27d7c ON public.annotations_annotation_downloads USING btree (download_id);


--
-- Name: annotations_annotation_figures_annotation_id_90157993; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_figures_annotation_id_90157993 ON public.annotations_annotation_figures USING btree (annotation_id);


--
-- Name: annotations_annotation_figures_figure_id_acc1f8c0; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_figures_figure_id_acc1f8c0 ON public.annotations_annotation_figures USING btree (figure_id);


--
-- Name: annotations_annotation_references_annotation_id_2dcfae79; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_references_annotation_id_2dcfae79 ON public.annotations_annotation_references USING btree (annotation_id);


--
-- Name: annotations_annotation_references_reference_id_fec77861; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX annotations_annotation_references_reference_id_fec77861 ON public.annotations_annotation_references USING btree (reference_id);


--
-- Name: attributes_identifier_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX attributes_identifier_idx ON public.attributes USING btree (identifier);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- Name: caveats_caveat_creator_id_97a744d6; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_creator_id_97a744d6 ON public.caveats_caveat USING btree (creator_id);


--
-- Name: caveats_caveat_downloads_caveat_id_645a7184; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_downloads_caveat_id_645a7184 ON public.caveats_caveat_downloads USING btree (caveat_id);


--
-- Name: caveats_caveat_downloads_download_id_e2667ece; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_downloads_download_id_e2667ece ON public.caveats_caveat_downloads USING btree (download_id);


--
-- Name: caveats_caveat_figures_caveat_id_c9c70c28; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_figures_caveat_id_c9c70c28 ON public.caveats_caveat_figures USING btree (caveat_id);


--
-- Name: caveats_caveat_figures_figure_id_e18febb3; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_figures_figure_id_e18febb3 ON public.caveats_caveat_figures USING btree (figure_id);


--
-- Name: caveats_caveat_subscribers_caveat_id_2af3840e; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_subscribers_caveat_id_2af3840e ON public.caveats_caveat_subscribers USING btree (caveat_id);


--
-- Name: caveats_caveat_subscribers_user_id_e73d1ca4; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_caveat_subscribers_user_id_e73d1ca4 ON public.caveats_caveat_subscribers USING btree (user_id);


--
-- Name: caveats_comment_caveat_id_3f461a12; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_comment_caveat_id_3f461a12 ON public.caveats_comment USING btree (caveat_id);


--
-- Name: caveats_comment_creator_id_aa7a8223; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX caveats_comment_creator_id_aa7a8223 ON public.caveats_comment USING btree (creator_id);


--
-- Name: datasets_search_vector_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX datasets_search_vector_idx ON public.datasets USING gin (search_vector);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: django_site_domain_a2e37b91_like; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX django_site_domain_a2e37b91_like ON public.django_site USING btree (domain varchar_pattern_ops);


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
-- Name: socialaccount_socialaccount_user_id_8146e70c; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX socialaccount_socialaccount_user_id_8146e70c ON public.socialaccount_socialaccount USING btree (user_id);


--
-- Name: socialaccount_socialapp_sites_site_id_2579dee5; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX socialaccount_socialapp_sites_site_id_2579dee5 ON public.socialaccount_socialapp_sites USING btree (site_id);


--
-- Name: socialaccount_socialapp_sites_socialapp_id_97fb6e7d; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX socialaccount_socialapp_sites_socialapp_id_97fb6e7d ON public.socialaccount_socialapp_sites USING btree (socialapp_id);


--
-- Name: socialaccount_socialtoken_account_id_951f210e; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX socialaccount_socialtoken_account_id_951f210e ON public.socialaccount_socialtoken USING btree (account_id);


--
-- Name: socialaccount_socialtoken_app_id_636a42d7; Type: INDEX; Schema: public; Owner: jochen
--

CREATE INDEX socialaccount_socialtoken_app_id_636a42d7 ON public.socialaccount_socialtoken USING btree (app_id);


--
-- Name: words_word_idx; Type: INDEX; Schema: public; Owner: isimip_metadata
--

CREATE INDEX words_word_idx ON public.words USING gin (word public.gin_trgm_ops);


--
-- Name: account_emailaddress account_emailaddress_user_id_2c513194_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_user_id_2c513194_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_emailconfirmation account_emailconfirm_email_address_id_5b7f8c58_fk_account_e; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirm_email_address_id_5b7f8c58_fk_account_e FOREIGN KEY (email_address_id) REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_references annotations_annotati_annotation_id_2dcfae79_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_references
    ADD CONSTRAINT annotations_annotati_annotation_id_2dcfae79_fk_annotatio FOREIGN KEY (annotation_id) REFERENCES public.annotations_annotation(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_downloads annotations_annotati_annotation_id_8682f398_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_downloads
    ADD CONSTRAINT annotations_annotati_annotation_id_8682f398_fk_annotatio FOREIGN KEY (annotation_id) REFERENCES public.annotations_annotation(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_figures annotations_annotati_annotation_id_90157993_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_figures
    ADD CONSTRAINT annotations_annotati_annotation_id_90157993_fk_annotatio FOREIGN KEY (annotation_id) REFERENCES public.annotations_annotation(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_downloads annotations_annotati_download_id_89f27d7c_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_downloads
    ADD CONSTRAINT annotations_annotati_download_id_89f27d7c_fk_annotatio FOREIGN KEY (download_id) REFERENCES public.annotations_download(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_figures annotations_annotati_figure_id_acc1f8c0_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_figures
    ADD CONSTRAINT annotations_annotati_figure_id_acc1f8c0_fk_annotatio FOREIGN KEY (figure_id) REFERENCES public.annotations_figure(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: annotations_annotation_references annotations_annotati_reference_id_fec77861_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.annotations_annotation_references
    ADD CONSTRAINT annotations_annotati_reference_id_fec77861_fk_annotatio FOREIGN KEY (reference_id) REFERENCES public.annotations_reference(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat caveats_caveat_creator_id_97a744d6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat
    ADD CONSTRAINT caveats_caveat_creator_id_97a744d6_fk_auth_user_id FOREIGN KEY (creator_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_downloads caveats_caveat_downl_caveat_id_645a7184_fk_caveats_c; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_downloads
    ADD CONSTRAINT caveats_caveat_downl_caveat_id_645a7184_fk_caveats_c FOREIGN KEY (caveat_id) REFERENCES public.caveats_caveat(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_downloads caveats_caveat_downl_download_id_e2667ece_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_downloads
    ADD CONSTRAINT caveats_caveat_downl_download_id_e2667ece_fk_annotatio FOREIGN KEY (download_id) REFERENCES public.annotations_download(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_figures caveats_caveat_figur_figure_id_e18febb3_fk_annotatio; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_figures
    ADD CONSTRAINT caveats_caveat_figur_figure_id_e18febb3_fk_annotatio FOREIGN KEY (figure_id) REFERENCES public.annotations_figure(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_figures caveats_caveat_figures_caveat_id_c9c70c28_fk_caveats_caveat_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_figures
    ADD CONSTRAINT caveats_caveat_figures_caveat_id_c9c70c28_fk_caveats_caveat_id FOREIGN KEY (caveat_id) REFERENCES public.caveats_caveat(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_subscribers caveats_caveat_subsc_caveat_id_2af3840e_fk_caveats_c; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_subscribers
    ADD CONSTRAINT caveats_caveat_subsc_caveat_id_2af3840e_fk_caveats_c FOREIGN KEY (caveat_id) REFERENCES public.caveats_caveat(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_caveat_subscribers caveats_caveat_subscribers_user_id_e73d1ca4_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_caveat_subscribers
    ADD CONSTRAINT caveats_caveat_subscribers_user_id_e73d1ca4_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_comment caveats_comment_caveat_id_3f461a12_fk_caveats_caveat_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_comment
    ADD CONSTRAINT caveats_comment_caveat_id_3f461a12_fk_caveats_caveat_id FOREIGN KEY (caveat_id) REFERENCES public.caveats_caveat(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: caveats_comment caveats_comment_creator_id_aa7a8223_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.caveats_comment
    ADD CONSTRAINT caveats_comment_creator_id_aa7a8223_fk_auth_user_id FOREIGN KEY (creator_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: datasets datasets_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: isimip_metadata
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.datasets(id);


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


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
-- Name: socialaccount_socialtoken socialaccount_social_account_id_951f210e_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_social_account_id_951f210e_fk_socialacc FOREIGN KEY (account_id) REFERENCES public.socialaccount_socialaccount(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialtoken socialaccount_social_app_id_636a42d7_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_social_app_id_636a42d7_fk_socialacc FOREIGN KEY (app_id) REFERENCES public.socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_site_id_2579dee5_fk_django_si; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_social_site_id_2579dee5_fk_django_si FOREIGN KEY (site_id) REFERENCES public.django_site(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc FOREIGN KEY (socialapp_id) REFERENCES public.socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_user_id_8146e70c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: jochen
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_socialaccount_user_id_8146e70c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


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

