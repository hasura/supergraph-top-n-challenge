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
    created: timestamp
  }

  type Query {
    threads(limit: Int): [Thread]
  }

`;

export { typeDefs, scalarTypeDefs, scalarResolvers };