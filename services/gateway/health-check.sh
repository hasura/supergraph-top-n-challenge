#!/bin/bash

if [ ! -f /tmp/health.txt ]
then 
    (curl 'http://localhost:8000/graphql' -H 'Content-Type: application/json' --data-raw $'{"query":"query ($threadLimit: Int\u0021, $postLimit: Int\u0021) {\\n  threads(limit: $threadLimit) {\\n    id\\n    posts(limit: $postLimit) {\\n      id\\n    }\\n  }\\n}","variables":{"threadLimit":2,"postLimit":2}}' || exit 1) && touch /tmp/health.txt 
else
    echo "healthcheck already executed"
fi