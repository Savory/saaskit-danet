import { InMemoryRepository } from "../../database/in-memory.repository.ts";
import { Vote } from "./class.ts";
import { CommentRepository } from "./repository.ts";

export class InMemoryVoteRepository extends InMemoryRepository<Vote>
  implements CommentRepository {
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
