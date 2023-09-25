import { BatchedSQLDataSource } from "@nic-jennings/sql-datasource"

export class PostgresDataSource extends BatchedSQLDataSource {

  constructor(config) {
    super(config);

    // batching
    this.getPostsBatched = this.db.query
      .select("*")
      .from({c: "posts"})
      .batch(async (query, keys) => {
        const result = await query.whereIn("c.thread_id", keys);
        return keys.map((x) => {
          return result.filter((y) => y.thread_id === x);
        })
      });
  }

  getPosts() {
    return this.db.query
      .select("*")
      .from("posts")
  }

  getPostsNotBatched(parent, args) {
    return this.db.query
      .select("*")
      .from("posts")
      .where("thread_id", parent.id)
      .limit(args.limit ? args.limit : null)
      .orderBy("created", args.orderBy ? args.orderBy : "desc")
  }

}