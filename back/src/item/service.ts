import { BadRequestException, Inject, Injectable } from "danet/mod.ts";
import { CreateItemDTO, Item } from "./class.ts";
import { Comment } from "./comment/class.ts";
import type { Repository } from "../database/repository.ts";
import { ITEM_REPOSITORY } from "./constant.ts";
import { CommentService } from "./comment/service.ts";
import { VoteService } from "./vote/service.ts";
import { Vote } from "./vote/class.ts";
import type { ActualUserService } from "../auth/actual-user.service.ts";
import { ACTUAL_USER_SERVICE } from "../auth/module.ts";

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private repository: Repository<Item>,
    @Inject(ACTUAL_USER_SERVICE) private authService: ActualUserService,
    private commentService: CommentService,
    private voteService: VoteService,
  ) {
  }

  async getAll() {
    const items = await this.repository.getAll();
    const promises = items.map(async (item: Item) => {
      const voteData = await this.getUpvoteCount(item._id);
      return {
        ...item,
        userHasVoted: voteData.userHasVoted,
        score: voteData.count,
      };
    });
    return Promise.all(promises);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  async create(item: CreateItemDTO) {
    const user = await this.authService.get();
    return this.repository.create(
      new Item(item.title, item.url, user.id, new Date()),
    );
  }

  update(itemId: string, item: Item) {
    return this.repository.updateOne(itemId, item);
  }

  async deleteOneById(itemId: string) {
    await this.repository.deleteOne(itemId);
  }

  deleteAll() {
    return this.repository.deleteAll();
  }

  async addComment(
    itemId: string,
    comment: Omit<Comment, "_id" | "createdAt">,
  ) {
    const item = await this.repository.getById(itemId);
    if (!item) throw new BadRequestException();
    return this.commentService.create({ ...comment, itemId: itemId });
  }

  async getComments(itemId: string) {
    return this.commentService.getItemComments(itemId);
  }

  async upvote(itemId: string) {
    return this.voteService.upvote(itemId);
  }

  async removeUpvote(itemId: string) {
    return this.voteService.removeUpvote(itemId);
  }

  async getUpvoteCount(itemId: string) {
    const [count, userHasVoted] = await Promise.all([
      this.voteService.getItemVoteCount(itemId),
      this.voteService.userHasVotedOnItem(itemId),
    ]);
    return { count, userHasVoted };
  }
}
