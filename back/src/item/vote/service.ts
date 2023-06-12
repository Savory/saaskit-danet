import { Inject, Injectable } from 'danet/mod.ts';
import { Vote } from './class.ts';
import { VOTE_REPOSITORY } from './constant.ts';
import type { VoteRepository } from './repository.ts';
import { ActualUserService } from '../../auth/actual-user.service.ts';

@Injectable()
export class VoteService {
  constructor(
    @Inject(VOTE_REPOSITORY) private repository: VoteRepository,
    private actualUserService: ActualUserService,
  ) {}

  async upvote(itemId: string) {
    const user = await this.actualUserService.get();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user._id,
    );
    if (userVoteOnitem) {
      throw new Error('userAlreadyVoted');
    }
    return this.repository.create(
      new Vote(itemId, user._id, new Date()),
    );
  }

  async getItemVoteCount(itemId: string) {
    return (await this.repository.getByItemId(itemId)).length;
  }

  async userHasVotedOnItem(itemId: string) {
    let userVoteOnitem = false;
    try {
      const user = await this.actualUserService.get();
      userVoteOnitem = !!(await this.repository.getByItemIdAndUserId(
        itemId,
        user._id,
      ));
    } catch (_e) {
      // user not connected
    }
    return userVoteOnitem;
  }

  async removeUpvote(itemId: string) {
    const user = await this.actualUserService.get();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user._id,
    );
    if (!userVoteOnitem) {
      throw new Error('userDidNotUpvote');
    }
    return this.repository.deleteOne(userVoteOnitem._id);
  }
}
