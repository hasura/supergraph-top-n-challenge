import { QueryResolvers } from "../__generated__/resolvers-types";

// Use the generated `QueryResolvers` type to type check our queries!
const queries: QueryResolvers = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  threads: async (_, args, { dataSources }) => {
    return dataSources.threadsAPI.getThreads(args.limit);
  },
};

export default queries;
