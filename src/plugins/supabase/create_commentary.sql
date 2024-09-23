-- Gill's exposition for english readers
create table
  public.gill (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text null,
    com text null,
    constraint gill_pkey primary key (id)
  ) tablespace pg_default;

-- Ellicott bible commentary
create table
  public.ellicott (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text null,
    com text null,
    constraint ellicott_pkey primary key (id)
  ) tablespace pg_default;

-- Pulpit commentary
create table
  public.pulpit (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text null,
    com text null,
    constraint pulpit_pkey primary key (id)
  ) tablespace pg_default;

-- Matthew Henry's Concise Commentary
create table
  public.mhc (
    id bigint,

    rf character varying not null,
    bk character varying not null,
    ch smallint,
    vs smallint,
    txt text null,
    com text null,
    constraint mhc_pkey primary key (id)
  ) tablespace pg_default;
