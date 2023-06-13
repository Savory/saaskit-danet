import { InMemoryRepository } from "../../database/repository.memory.ts";
import { Comment } from "./class.ts";
import { CommentRepository } from "./repository.ts";

export class InMemoryCommentRepository extends InMemoryRepository<Comment>
  implements CommentRepository {
  async getByItemId(itemId: string): Promise<Comment[]> {
    return this.items.filter((c) => c.itemId === itemId);
  }
}
