import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ThreadsAPI } from "./threads-api.js";
import { PostsAPI } from "./posts-api.js";
import resolvers from "./resolvers/index.js";
import { readFileSync } from "fs";

// Note: this only works locally because it relies on `npm` routing
// from the root directory of the project.
const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

export interface MyContext {
  dataSources: {
    threadsAPI: ThreadsAPI;
    postsAPI: PostsAPI;
  };
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
  });

const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;
    return {
      // We are using a static data set for this example, but normally
      // this would be where you'd add your data source connections
      // or your REST API classes.
      dataSources: {
        threadsAPI: new ThreadsAPI({ cache }),
        postsAPI: new PostsAPI({ cache })
      },
    };
  },
  listen: { port: Number(process.env.PORT) || 8000 },
});

console.log(`🚀 Server listening at: ${url}`);
