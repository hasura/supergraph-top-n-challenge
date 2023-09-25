import http from "k6/http";
import { check, fail, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  let query = `query ($limit: Int!) {
    threads (limit: $limit) {
      id
    }
  }`; // TODO
  // let graphqlEndpoint = `http://${__ENV.GRAPHQL_HOST}/`;
  let graphqlEndpoint = `http://localhost:8000`;
  let variables = { limit: 5 };

  let headers = {
    "Content-Type": "application/json",
  };

  let res = http.post(
    graphqlEndpoint,
    JSON.stringify({ query: query, variables: variables }),
    { headers: headers }
  );

  console.log(res.json());

  if (
    check(res, {
      "graphql errors": (res) => res.json().errors !== undefined,
    })
  ) {
    fail("graphql response error");
  }
}
