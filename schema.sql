--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Ubuntu 14.2-1.pgdg20.04+1+b1)
-- Dumped by pg_dump version 14.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    text character varying(250) NOT NULL,
    username character varying(30),
    is_flagged boolean DEFAULT false,
    post_date timestamp with time zone
);


ALTER TABLE public.comments OWNER TO pavldkvmlvbxfk;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_comment_id_seq OWNER TO pavldkvmlvbxfk;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--added
--
-- Name: reply; Type: TABLE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE TABLE public.reply (
    reply_id integer NOT NULL,
    comment_id integer,
    text character varying(250) NOT NULL,
    username character varying(30),
    is_flagged boolean DEFAULT false,
    post_date timestamp with time zone
);


--added
ALTER TABLE public.reply OWNER TO pavldkvmlvbxfk;


--added
--
-- Name: reply_reply_id_seq; Type: SEQUENCE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE SEQUENCE public.reply_reply_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--added
ALTER TABLE public.reply_reply_id_seq OWNER TO pavldkvmlvbxfk;


--added
ALTER SEQUENCE public.reply_reply_id_seq OWNED BY public.reply.reply_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE TABLE public.users (
    username character varying(30) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    is_admin boolean DEFAULT false,
    user_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO pavldkvmlvbxfk;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: pavldkvmlvbxfk
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO pavldkvmlvbxfk;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--added
--
-- Name: reply reply_id; Type: DEFAULT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.reply ALTER COLUMN reply_id SET DEFAULT nextval('public.reply_reply_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--added
--
-- Name: reply reply_pkey; Type: CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.reply
    ADD CONSTRAINT reply_pkey PRIMARY KEY (reply_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: comments comments_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--added
--
-- Name: reply reply_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.reply
    ADD CONSTRAINT reply_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--added
--
-- Name: reply reply_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pavldkvmlvbxfk
--

ALTER TABLE ONLY public.reply
    ADD CONSTRAINT reply_username_fkey FOREIGN KEY (username) REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pavldkvmlvbxfk
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO pavldkvmlvbxfk;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO pavldkvmlvbxfk;


--
-- PostgreSQL database dump complete
--

