# The Supergraph Top-N Challenge

> $2250 in prizes. Can you build and execute the fastest GraphQL gateway?

- Build a supergraph that processes a simple “top N” query that fetches data from 2 domain services (backed by 2 different databases)
- Lowest P95 at 100 RPS wins!
- Use any stack or approach to build the GraphQL server.
Eg: GraphQL federation or schema stitching or GraphQL gateway talking to 2 different REST/gRPC services.

You have to build:
- The GraphQL server (ref: GraphQL gateway in diagram below)
- The 2 domain services (ref: Threads service, and Posts service in diagram below)

Submit a link to your git repository as a Github Issue!

**Deadline**: Submit your entry by Thursday, 12:00 pm PT (noon), 21 September 2023.

## TOC

- [Problem Statement](#problem-statement)
- [Goal](#goal)
- [Environment and Setup](#environment-and-setup)
- [Acceptance Criteria](#acceptance-criteria)
- [Test Cases / Examples](#test-cases--examples)
- [Prizes](#prizes)
- [Questions and Support](#questions-and-support)

## Problem Statement

You have two postgres databases. One contains the `threads` table and another contains the `posts` table.

The GraphQL gateway must be able to process the following query: retrieve the first `n` `threads` sorted by `created` descending and for each, return the first `m` `posts` sorted by `created` descending.

```
query {
  threads(limit: n) { # From Threads service
    id
    posts(limit: m) { # From Posts service
      id
    }
  }
}
```

The system mirrors the common pattern of having a domain service that resolves queries for each database, and a separate gateway component.

![System Architecture](https://github.com/hasura/graphqlconf-top-n-challenge/blob/efd453fd0a4bb2334cc5e7bc02d2a0ea90301795/architecture.png)

## Goal

While the challenge and prize money makes it fun, the goal of this challenge is really to highlight the different approaches & design decisions that go into building the GraphQL gateway and how domain services get unified.

The Hasura team will put together a blogpost summarizing the different stacks and design approaches used by the participants!

## Environment and Setup

- Use the provided database `docker-compose-db.yaml` file to start the two database services with preloaded test data
  - Use the ports bound on localhost to address the databases
  - Do not modify or optimise the database services
  - You can use the command `docker compose -f docker-compose-db.yaml up -d` to start the databases
  - The test bench will run these containers alongside the services you provide
- In an independent repository / directory, build the remaining three services as separate docker containers
  - Serve the gateway on port 8000
- This repository must contain one `docker-compose.yml` that describes all the services
- The test bench will run `docker compose up` in this directory, and this should completely initialise all three services

Your system will be run on an GCE E2 instance with 2 vCPU and 4 GB RAM by the test bench post submission.

## Acceptance Criteria

- Your repository must contain one `docker-compose.yml` that completely describes the three services (do not include the two database services provided)
- The gateway endpoint must serve GraphQL
  - Inter-service protocol need not be (but can be) GraphQL
- Do not implement query based response caching in your services (our test bench is pretty simple)
- The single query endpoint must return the data in the JSON format shown in the examples, but may contain additional root level properties

## Test Cases / Examples

These are based on the provided dataset, please use them to confirm your responses' correctness.

We have assumed the argument name as `limit` as the examples show.

### Case 1

```graphql
query ($threadLimit: Int!, $postLimit: Int!) {
  threads (limit: $threadLimit) {
    id
    posts (limit: $postLimit) {
      id
    }
  }
}
```

and we give the `threadLimit` as 1 and `postLimit` as 2. The response should be as below:

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

Limit values being updated for the respective variables. For `threadLimit` to be 2 and `postLimit` to be 1, the response should be like the one below:

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

## Prizes

Prizes are Amazon gift cards.

- Winner: $1000
- Runners-up: $750, $500

## Questions and Support

For any questions or support, just open a Github Issue on this repo!
