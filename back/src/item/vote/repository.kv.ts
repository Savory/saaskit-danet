import { Injectable } from 'danet/mod.ts';
import { Vote } from './class.ts';
import { type VoteRepository } from './repository.ts';
import { KvRepository } from "danet-database/kv/repository.ts";
import { KvService } from "danet-database/kv/service.ts";

@Injectable()
export class KvVoteRepository extends KvRepository<Vote>
  implements VoteRepository {
  constructor(protected kv: KvService) {
    super(kv, 'votes');
  }

  async getByItemId(itemId: string): Promise<Vote[]> {
    const votes = [];
    for await (
      const entry of this.kv.client().list<Vote>({
        prefix: [this.collectionName, itemId],
      })
    ) {
      votes.push(entry.value as Vote);
    }
    return votes;
  }

  async getByItemIdAndUserId(
    itemId: string,
    userId: string,
  ): Promise<Vote | undefined> {
    const entry = await this.kv.client().get<Vote>([
      this.collectionName,
      userId,
      itemId,
    ]);
    return entry.value !== null ? entry.value : undefined;
  }

  protected getSecondaryKeys(vote: Vote) {
    const voteByItemIdKey = [this.collectionName, vote.itemId, vote._id];
    const voteByUserIdAndItemIdKey = [
      this.collectionName,
      vote.userId,
      vote.itemId,
    ];
    return { voteByUserIdAndItemIdKey, voteByItemIdKey };
  }
}
