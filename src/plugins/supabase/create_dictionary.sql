create table
  public.greek (
    id bigint,
    wrd character varying not null,
    def text not null,
    data jsonb null,
    constraint Greek_Dictionary_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.hebrew (
    id bigint,
    wrd character varying not null,
    def text not null,
    data jsonb null,
    constraint Hebrew_Dictionary_pkey primary key (id)
  ) tablespace pg_default;
