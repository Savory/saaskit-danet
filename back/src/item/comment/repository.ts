import { Repository } from '../../database/repository.ts';
import { Comment } from './class.ts';

export interface CommentRepository extends Repository<Comment> {
  getByItemId(itemId: string): Promise<Comment[]>;
}
