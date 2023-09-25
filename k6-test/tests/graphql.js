import http from "k6/http";
import { check, fail, sleep } from "k6";

export const options = {
  vus: 10,
  duration: '10s',
};

export default function() {
  let query = `query ($threadLimit: Int!, $postLimit: Int!) {
    threads (limit: $threadLimit) {
      id
      posts(limit: $postLimit) {
        id
      }
    }
  }`; // TODO
  // let graphqlEndpoint = `http://${__ENV.GRAPHQL_HOST}/`;
  let graphqlEndpoint = `http://host.docker.internal:4000/`;
  let variables = {"threadLimit": 5, "postLimit": 10}

  let headers = {
    "Content-Type": "application/json"
  };

  let res = http.post(graphqlEndpoint,
    JSON.stringify({ query: query, variables: variables }),
    {headers: headers}
  );

  console.log(res.json());

  if (
    check(res, {
      'graphql errors': (res) => res.json().errors !== undefined,
    })
  ) {
    fail('graphql response error');
  }
}