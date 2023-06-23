import { Repository } from 'danet-database/repository.ts';
import { Comment } from './class.ts';

export interface CommentRepository extends Repository<Comment> {
  getByItemId(itemId: string): Promise<Comment[]>;
}
