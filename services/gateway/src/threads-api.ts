import { RESTDataSource } from '@apollo/datasource-rest';
import { Thread } from "__generated__/resolvers-types";

export class ThreadsAPI extends RESTDataSource {
  override baseURL = process.env.THREADS_URL || 'http://localhost:4001/threads';

  async getThreads(limit = 10): Promise<Thread[]> {
    const data = await this.get(`?limit=${limit}`);
    return data;
  }
}