#!/usr/bin/env bash

function prepdata() {
  iconv -f ISO-8859-1 -t UTF-8 Chinook_PostgreSql.sql > Chinook_PostgreSql_utf8.sql

  dcf cp ./Chinook_PostgreSql_utf8.sql db1:/
  dcf exec db1 psql -U dbuser -d db -f /Chinook_PostgreSql_utf8.sql -q

  dcf exec db1 pg_dump -U dbuser -d db -Fc > ./Chinook.pgdump
}

function dcf() {
    docker compose -f docker-compose.database.yml "$@"
}

function listarchive() {
  dcf cp ./Chinook.pgdump db1:/
  dcf exec db1 pg_restore -U dbuser -l -f - /Chinook.pgdump
}

dcf cp ./Chinook.pgdump db1:/
dcf exec db1 pg_restore -U dbuser -d postgres -c -C --strict-names -v -t Artist /Chinook.pgdump
dcf exec db1 psql -U dbuser -d db -c 'alter table "Artist" add primary key ("ArtistId");'

dcf cp ./Chinook.pgdump db2:/
dcf exec db2 pg_restore -U dbuser -d postgres -c -C --strict-names -v -t Album -I IFK_AlbumArtistId /Chinook.pgdump
dcf exec db2 psql -U dbuser -d db -c 'alter table "Album" add primary key ("AlbumId");'


####

# changed dataset

dcf exec db1 pg_dump -U dbuser -d db -Fc > ./threads_posts.pgdump

dcf exec db1 pg_dump -U dbuser -d db -t threads > ./threads.sql
dcf exec db1 pg_dump -U dbuser -d db -t posts > ./posts.sql

dcf cp ./threads_posts.pgdump db1:/
dcf exec db1 pg_restore -U dbuser -l -f - /threads_posts.pgdump

dcf cp ./threads_posts.pgdump db1:/
dcf exec db1 pg_restore -U dbuser -d postgres -c -C --strict-names -v -t threads /threads_posts.pgdump
dcf exec db1 psql -U dbuser -d db -c 'alter table "Artist" add primary key ("ArtistId");'

dcf cp ./threads_posts.pgdump db2:/
dcf exec db2 pg_restore -U dbuser -d postgres -c -C --strict-names -v -t Album -I IFK_AlbumArtistId /threads_posts.pgdump
dcf exec db2 psql -U dbuser -d db -c 'alter table "Album" add primary key ("AlbumId");'