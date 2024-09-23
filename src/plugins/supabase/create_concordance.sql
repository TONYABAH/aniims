-- Greek concordance
create table
  public.congrk (
    id bigint,

    sno character varying not null,
    data jsonb null,
    constraint Congrk_pkey primary key (id)
  ) tablespace pg_default;
-- Hebrew concordance
create table
  public.conheb (
    id bigint,

    sno character varying not null,
    data jsonb null,
    constraint Conheb_pkey primary key (id)
  ) tablespace pg_default;

-- Strongs's Greek
create table
  public.strgrk (
    id bigint,

    sno character varying not null,
    data jsonb null,
    constraint Strgrk_pkey primary key (id)
  ) tablespace pg_default;

-- Strong's Hebrew
create table
  public.strheb (
    id bigint,

    sno character varying not null,
    data jsonb null,
    constraint Strheb_pkey primary key (id)
  ) tablespace pg_default;
