import { InMemoryRepository } from '../../database/repository.memory.ts';
import { Vote } from './class.ts';
import { type VoteRepository } from './repository.ts';

export class InMemoryVoteRepository extends InMemoryRepository<Vote>
  implements VoteRepository {
  async getByItemId(itemId: string): Promise<Vote[]> {
    return this.items.filter((c) => c.itemId === itemId);
  }

  async getByItemIdAndUserId(
    itemId: string,
    userId: string,
  ): Promise<Vote | undefined> {
    return this.items.find((c) => c.itemId === itemId && c.userId === userId);
  }
}
