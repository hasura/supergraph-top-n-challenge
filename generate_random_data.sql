create extension if not exists "uuid-ossp";

drop table if exists threads;
drop table if exists posts;

create table threads (
  id uuid,
  created timestamp
);

create table posts (
  id uuid,
  thread_id text,
  created timestamp
);

insert into threads (id, created)
select
  uuid_generate_v4(),
  timestamp '2014-01-01 00:00:00' +
    random() * (timestamp '2023-01-01 00:00:00' -
                timestamp '2014-01-01 00:00:00')
from generate_series(1, 2);

insert into posts (id, thread_id, created)
select p.id, p.thread_id, p.created
from threads t
left join lateral (
  select
    t.id thread_id,
    uuid_generate_v4() id,
    timestamp '2014-01-01 00:00:00' +
      random() * (timestamp '2023-01-01 00:00:00' -
                  timestamp '2014-01-01 00:00:00') created
  from generate_series(1, 3)
) p on true;

-- alter table threads add primary key (id);
-- alter table posts add primary key (id);

select * from posts;