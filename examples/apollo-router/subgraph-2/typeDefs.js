import gql from 'graphql-tag';
import {
    typeDefs as scalarTypeDefs,
    resolvers as scalarResolvers,
  } from 'graphql-scalars'

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  scalar timestamp

  type Thread @key(fields: "id") {
    id: Int
    posts(limit: Int, orderBy: String): [Post]
    posts_batched: [Post]
  }

  type Post {
    id: Int
    thread_id: Int
    created: Int
  }

  type Query {
    posts(limit: Int, orderBy: String): [Thread]
  }

`;

export { typeDefs, scalarTypeDefs, scalarResolvers };