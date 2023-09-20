drop table if exists threads;
drop table if exists posts;

create table threads (
  id integer,
  created timestamp
);

create table posts (
  id integer,
  thread_id integer,
  created timestamp
);

insert into threads (id, created)
select
  1 + ceil(random() * 2000000000),
  timestamp '2014-01-01 00:00:00' +
    random() * (timestamp '2023-01-01 00:00:00' -
                timestamp '2014-01-01 00:00:00')
from generate_series(1, 1000);

insert into posts (id, thread_id, created)
select p.id, p.thread_id, p.created
from threads t
left join lateral (
  select
    t.id thread_id,
    1 + ceil(random() * 2000000000) id,
    timestamp '2014-01-01 00:00:00' +
      random() * (timestamp '2023-01-01 00:00:00' -
                  timestamp '2014-01-01 00:00:00') created
  from generate_series(1, 2000)
) p on true;

alter table threads add primary key (id);

delete from posts
where id in
(
  select id from posts
  group by id
  having count(*) > 1
);

alter table posts add primary key (id);

select count(*) from
(
  select 1 from threads
  group by created
  having count(*) > 1
) x;

select count(*) from
(
  select 1 from posts
  group by created
  having count(*) > 1
) x;

create index on threads (created desc);
create index on posts (thread_id, created desc);

select t.id, t.created, p.id, p.created
from (
  select * from threads
  order by created desc
  limit 100
) t
left join lateral (
  select p.id, p.created
  from posts p
  where p.thread_id = t.id
  order by p.created desc
  limit 100
) p on true;

select t.id, p.id
from (
  select * from threads
  order by created desc
  limit 2
) t
left join lateral (
  select p.id, p.created
  from posts p
  where p.thread_id = t.id
  order by p.created desc
  limit 1
) p on true;