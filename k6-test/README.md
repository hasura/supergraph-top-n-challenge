## Run the test

Note: Change the graphql endpoint / query if required from `tests/graphql.js` file.

- Start docker containers
```bash
docker compose -f docker-compose-k6.yaml up -d 
```

- Run k6

```bash
docker compose -f docker-compose-k6.yaml run k6 run /scripts/graphql.js
```