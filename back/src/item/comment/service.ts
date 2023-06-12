import { Inject, Injectable } from 'danet/mod.ts';
import { Comment } from './class.ts';
import { COMMENT_REPOSITORY } from './constant.ts';
import type { CommentRepository } from './repository.ts';
import { ActualUserService } from '../../auth/actual-user.service.ts';

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_REPOSITORY) private repository: CommentRepository,
    private actualUserService: ActualUserService,
  ) {
  }

  async create(comment: Omit<Comment, '_id' | 'createdAt'>) {
    const user = await this.actualUserService.get();
    return this.repository.create(
      new Comment(comment.text, comment.itemId, user._id, new Date()),
    );
  }

  async getItemComments(itemId: string) {
    return this.repository.getByItemId(itemId);
  }
}
