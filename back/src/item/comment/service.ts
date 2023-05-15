import { Inject, Injectable } from "danet/mod.ts";
import { Comment } from "./class.ts";
import { COMMENT_REPOSITORY } from "./constant.ts";
import type { CommentRepository } from "./repository.ts";

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY) private repository: CommentRepository,
  ) {
  }

  async create(comment: Omit<Comment, "_id" | "createdAt">) {
    return this.repository.create(
      new Comment(comment.text, comment.itemId, comment.userId, new Date()),
    );
  }

  async getItemComments(itemId: string) {
    return this.repository.getByItemId(itemId);
  }
}
