import { Inject, Injectable } from "danet/mod.ts";
import { Comment } from "./class.ts";
import { COMMENT_REPOSITORY } from "./constant.ts";
import type { CommentRepository } from "./repository.ts";
import { AUTH_SERVICE } from "../../auth/module.ts";
import type { AuthService } from "../../auth/service.ts";

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY) private repository: CommentRepository,
    @Inject(AUTH_SERVICE) private authService: AuthService,
  ) {
  }

  async create(comment: Omit<Comment, "_id" | "createdAt">) {
    const user = await this.authService.getActualUser();
    return this.repository.create(
      new Comment(comment.text, comment.itemId, user.id, new Date()),
    );
  }

  async getItemComments(itemId: string) {
    return this.repository.getByItemId(itemId);
  }
}
