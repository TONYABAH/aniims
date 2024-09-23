-- American Standard version
create table
  public.asv (
    id bigint,
    
    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint ASV_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists asv_fts on public.asv using gin (fts) tablespace pg_default;

-- King James version
create table
  public.kjv (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint KJV_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists kjv_fts on public.kjv using gin (fts) tablespace pg_default;

-- English revised version
create table
  public.erv (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint ERV_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists erv_fts on public.erv using gin (fts) tablespace pg_default;

-- Bible in basic english
create table
  public.bbe (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint BBE_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists bbe_fts on public.bbe using gin (fts) tablespace pg_default;

-- World English Bible
create table
  public.web (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint WEB_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists web_fts on public.web using gin (fts) tablespace pg_default;

-- Sacred Name
create table
  public.sacrednm (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint SACRED_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists sacrednm_fts on public.sacrednm using gin (fts) tablespace pg_default;

-- JPS OT and Weymouth NT
create table
  public.jps (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint JPS_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists jps_fts on public.jps using gin (fts) tablespace pg_default;

-- Darby Bible Translation
create table
  public.dbt (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint DBT_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists dbt_fts on public.dbt using gin (fts) tablespace pg_default;

-- Young literal translation
create table
  public.ylt (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint YLT_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists yly_fts on public.ylt using gin (fts) tablespace pg_default;

-- Smith literal translation
create table
  public.slt (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint SLT_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists slt_fts on public.slt using gin (fts) tablespace pg_default;

-- Douay Rheims Bible
create table
  public.drb (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint DRB_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists drb_fts on public.drb using gin (fts) tablespace pg_default;

-- Noah Webster Bible Translation
create table
  public.wbt (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint WBT_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists wbt_fts on public.wbt using gin (fts) tablespace pg_default;

-- Weymouth New Testament
create table
  public.weymouth (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint WEYMOUTH_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists weymouth_fts on public.weymouth using gin (fts) tablespace pg_default;

-- Greek new testament
create table
  public.greeknt (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint GREEK_NT_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists greeknt_fts on public.greeknt using gin (fts) tablespace pg_default;

-- Catholic public domain bible
create table
  public.cpdv (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text not null,
    fts tsvector null,
    constraint CPDV_pkey primary key (id)
  ) tablespace pg_default;

create index if not exists cpdv_fts on public.cpdv using gin (fts) tablespace pg_default;
