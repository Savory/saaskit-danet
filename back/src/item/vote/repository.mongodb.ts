import { Injectable } from 'danet/mod.ts';
import { Vote } from './class.ts';
import { type VoteRepository } from './repository.ts';
import { MongodbRepository } from "danet-database/mongodb/repository.ts";
import { MongodbService } from "danet-database/mongodb/service.ts";

@Injectable()
export class MongodbVoteRepository extends MongodbRepository<Vote>
  implements VoteRepository {
  constructor(protected service: MongodbService) {
    super(service, 'votes');
  }

  async getByItemId(itemId: string): Promise<Vote[]> {
    return this.getAll({ itemId });
  }

  async getByItemIdAndUserId(
    itemId: string,
    userId: string,
  ): Promise<Vote | undefined> {
    return this.getOne({ itemId, userId });
  }
}
