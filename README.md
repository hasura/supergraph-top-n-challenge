# GraphQL Conf Federation Challenge 2023

You have two postgres databases. One contains the `threads` table and another contains the `posts` table.

Build a federated GraphQL endpoint that can process the following query: retrieve the first `n` `threads` sorted by `created` descending and for each, return the first `m` `posts` sorted by `created` descending.

The system must mirror the common pattern of having a service that resolves queries for each database, and a separate federation component.

![System Architecture](https://github.com/hasura/graphqlconf-federation-competition-databases/blob/064dbe966586b28724e7dccc18eb6e3e552d36f6/architecture.png)

Submit a link to your git repository as a Github Issue.

## How to Win

Have the lowest P95 latency at 100rps (we may decide to change the rps depending on the latency spread).

Your system will be run on an GCE E2 instance with 2 vCPU and 4 GB RAM.

## Environment and Setup

- Use the provided database `docker-compose.yml` file to start the two database services with preloaded test data
  - Use the ports bound on localhost to address the databases
  - Do not modify or optimise the database services
- In an independent repository / directory, build the remaining three services as separate docker containers
  - Serve the federated endpoint on port 8000
- This repository must contain one `docker-compose.yml` that describes all the services
- The test bench will run `docker compose up` in this directory, and this should completely initialise all services

## Acceptance Criteria

- Your repository must contain one `docker-compose.yml` that completely describes the three services excluding the two database services provided
- The federation endpoint must serve GraphQL
  - Inter-service protocol need not be (but can be) GraphQL
- Do not implement query based response caching in your services (our test bench is pretty simple)
- The single query endpoint must return the data in the JSON format shown in the examples, but may contain additional root level properties
- Submit your entry by Thursday, 12 noon 21 September 2023

## Test Cases / Examples

These are based on the provided dataset, please use them to confirm your responses' correctness.

Feel free to change the argument name for `limit` or `first` as the examples show.

Specify this argument name in your Github Issue.

### Case 1

```graphql
query {
  threads (limit: 1) {
    id
    posts (limit: 2) {
      id
    }
  }
}
```

```json
{
  "data": {
    "threads": [
      {
        "id": 212991383,
        "posts": [
          {
            "id": 1300957267
          },
          {
            "id": 1679625662
          }
        ]
      }
    ]
  }
}
```

### Case 2

```graphql
query {
  threads (first: 2) {
    id
    posts (first: 1) {
      id
    }
  }
}
```

```json
{
  "data": {
    "threads": [
      {
        "id": 212991383,
        "posts": [
          {
            "id": 1300957267
          }
        ]
      },
      {
        "id": 1194533456,
        "posts": [
          {
            "id": 1206315650
          }
        ]
      }
    ]
  }
}
```
