import { InMemoryRepository } from "../../database/in-memory.repository.ts";
import { Comment } from "./class.ts";
import { CommentRepository } from "./repository.ts";

export class InMemoryCommentRepository extends InMemoryRepository<Comment>
  implements CommentRepository {
  async getByItemId(itemId: string): Promise<Comment[]> {
    console.log(this.items);
    return this.items.filter((c) => c.itemId === itemId);
  }
}
