import { Repository } from "../database/repository.ts";
import { Item } from "./class.ts";

export class InMemoryItemRepository implements Repository<Item> {
  private items: Item[] = [];
  async getAll(): Promise<Item[]> {
    return [...this.items];
  }

  async getById(id: string) {
    const item = this.items.find((t: Item) => t._id === id);
    if (item) {
      return { ...item } as Item;
    }
    return undefined;
  }

  async create(item: Omit<Item, "_id">) {
    const createdItem = new Item(item.title, item.url, item.userId);
    this.items.push(createdItem);
    return createdItem;
  }

  async updateOne(itemId: string, item: Item) {
    this.items.forEach((t: Item) => {
      if (t._id === itemId) {
        t.title = item.title;
        t.url = item.url;
      }
    });
    return undefined;
  }

  async deleteOne(itemId: string) {
    const itemIndex = this.items.findIndex((t: Item) => t._id === itemId);
    this.items.splice(itemIndex, 1);
  }

  async deleteAll() {
    this.items = [];
  }
}
