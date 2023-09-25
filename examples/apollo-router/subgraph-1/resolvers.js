import { getFields } from "./utils.js";

const resolvers = {
  Query: {
    threads: async (_, args, { dataSources }, info) => {
      return dataSources.db.getThreads(args);
    },
  },
};

export { resolvers };