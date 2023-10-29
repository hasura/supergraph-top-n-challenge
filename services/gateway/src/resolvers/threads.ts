import { ThreadResolvers } from "../__generated__/resolvers-types";

// Use the generated `QueryResolvers` type to type check our queries!
const threads: ThreadResolvers = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  posts: async (parent, args, { dataSources }) => {
    return dataSources.postsAPI.getPosts(args.limit, parent.id);
  },
};

export default threads;
