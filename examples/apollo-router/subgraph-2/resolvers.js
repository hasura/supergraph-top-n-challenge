import { getFields } from "./utils.js";

const resolvers = {
  Query: {
    threads: async (_, args, { dataSources }, info) => {
      return dataSources.db.getThreads();
    },
    posts: async (_, args, { dataSources }, info) => {
      return dataSources.db.getPosts();
    },
  },
  Thread: {
    posts_batched: async (parent, args, { dataSources }, info) => {
      return dataSources.db.getPostsBatched.load(parent.id);
    },
    posts: async (parent, args, { dataSources }, info) => {
      return dataSources.db.getPostsNotBatched(parent, args);
    },
  },
};

export { resolvers };