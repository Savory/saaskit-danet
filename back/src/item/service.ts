import { BadRequestException, Inject, Injectable } from "danet/mod.ts";
import { Item } from "./class.ts";
import { Comment } from "./comment/class.ts";
import type { Repository } from "../database/repository.ts";
import { ITEM_REPOSITORY } from "./constant.ts";
import { CommentService } from "./comment/service.ts";

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private repository: Repository<Item>,
    private commentService: CommentService,
  ) {
  }

  getAll() {
    return this.repository.getAll();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  async create(item: Omit<Item, "_id">) {
    return this.repository.create(
      new Item(item.title, item.url, item.userId, new Date()),
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
}
