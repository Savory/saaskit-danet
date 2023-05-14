import { Inject, Injectable } from "danet/mod.ts";
import { Item } from "./class.ts";
import type { Repository } from "../database/repository.ts";
import { ITEM_REPOSITORY } from "./constant.ts";

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private repository: Repository<Item>,
  ) {
  }

  getAll() {
    return this.repository.getAll();
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  async create(item: Omit<Item, "_id">) {
    item.userId = 'toto';
    item.score = 0;
    return this.repository.create(item);
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
}
