import { Injectable } from 'danet/mod.ts';
import { Comment } from './class.ts';
import { CommentRepository } from './repository.ts';
import { KvRepository } from "danet-database/kv/repository.ts";
import { KvService } from "danet-database/kv/service.ts";

@Injectable()
export class KvCommentRepository extends KvRepository<Comment>
  implements CommentRepository {
  constructor(protected kv: KvService) {
    super(kv, 'comments');
  }
  async getByItemId(itemId: string): Promise<Comment[]> {
    const comments = [];
    for await (
      const entry of this.kv.client().list<Comment>({
        prefix: [this.collectionName, itemId],
      })
    ) {
      comments.push(entry.value as Comment);
    }
    return comments;
  }

  protected getSecondaryKeys(comment: Comment) {
    const commentByItemId = [this.collectionName, comment.itemId, comment._id];
    const commentByUserIdKey = [
      this.collectionName,
      comment.userId,
      comment._id,
    ];
    return { commentByUserIdKey, commentByItemId };
  }
}
