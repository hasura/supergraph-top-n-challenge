# Database Techniques to Solve the Top N Problem

See repository README.md for the Supergraph Top N Challenge.

This is also the same logic you'd need to implement for efficient cursor based pagination.

You'd also find these patterns very often to optimise queries when using the Dataloader pattern.

Please raise a PR if you know another way to do this!

## Lateral joins

```sql
select *
from threads
left join lateral (
  select *
  from posts
  where thread_id = thread.id
  order by created_at desc
  limit 10
) posts on true;
where thread.id in (1,2,3)
```

## Window Queries

```sql
select *
from (
  select *,
    row_number() over (partition by thread_id order by created_at desc) rown
    from threads
    left join posts on posts.thread_id = threads.id
    where threads.id in (1,2,3)
) t
where rown <= 10
order by created_at desc
```

## Union
 
```sql
select *
from threads
left join posts on posts.thread_id = threads.id
where threads.id = 1 -- one query for each ID
order by threads.created_at desc
limit 10

union all -- then combine each separate query

select *
from threads
left join posts on posts.thread_id = threads.id
where threads.id = 2
order by threads.created_at desc
limit 10
```
