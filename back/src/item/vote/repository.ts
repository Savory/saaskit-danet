import { Repository } from '../../database/repository.ts';
import { Vote } from './class.ts';

export interface VoteRepository extends Repository<Vote> {
  getByItemId(itemId: string): Promise<Vote[]>;
  getByItemIdAndUserId(
    itemId: string,
    userId: string,
  ): Promise<Vote | undefined>;
}
