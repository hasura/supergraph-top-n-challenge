## Getting started

- Run docker compose to start services

```bash
docker compose -f docker-compose-api.yaml up -d --build
```

- Generate the composed Supergraph schema

```bash
rover supergraph compose --config ./router/supergraph-config.yaml > supergraph.graphql
```

- Run the Apollo Router instance locally

```bash
router --supergraph=supergraph.graphql
```

Optionally add the `--dev` flag for debugging and testing with a GraphiQL explorer.