import { Inject, Injectable } from "danet/mod.ts";
import { Vote } from "./class.ts";
import { VOTE_REPOSITORY } from "./constant.ts";
import type { CommentRepository } from "./repository.ts";
import type { ActualUserService } from "../../auth/actual-user.service.ts";
import { ACTUAL_USER_SERVICE } from "../../auth/constant.ts";

@Injectable()
export class VoteService {
  constructor(
    @Inject(VOTE_REPOSITORY) private repository: CommentRepository,
    @Inject(ACTUAL_USER_SERVICE) private actualUserService: ActualUserService,
  ) {}

  async upvote(itemId: string) {
    const user = await this.actualUserService.get();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    if (userVoteOnitem) {
      throw new Error("userAlreadyVoted");
    }
    return this.repository.create(
      new Vote(itemId, user.id, new Date()),
    );
  }

  async getItemVoteCount(itemId: string) {
    return (await this.repository.getByItemId(itemId)).length;
  }

  async userHasVotedOnItem(itemId: string) {
    const user = await this.actualUserService.get();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    return !!userVoteOnitem;
  }

  async removeUpvote(itemId: string) {
    const user = await this.actualUserService.get();
    const userVoteOnitem = await this.repository.getByItemIdAndUserId(
      itemId,
      user.id,
    );
    if (!userVoteOnitem) {
      throw new Error("userDidNotUpvote");
    }
    return this.repository.deleteOne(userVoteOnitem._id);
  }
}
