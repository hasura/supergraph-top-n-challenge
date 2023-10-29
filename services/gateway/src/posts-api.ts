import { RESTDataSource } from '@apollo/datasource-rest';
import { Post } from "__generated__/resolvers-types";

export class PostsAPI extends RESTDataSource {
  override baseURL = process.env.POSTS_URL || 'http://localhost:4002/posts';

  async getPosts(limit = 10, threadId: number): Promise<Post[]> {
    const data = await this.post("", {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            limit: limit,
            id: threadId
        })}
    );
    return data;
  }
}