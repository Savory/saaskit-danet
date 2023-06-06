import { Repository } from "../database/repository.ts";

export class InMemoryRepository<T extends { _id: string }>
  implements Repository<T> {
  protected items: T[] = [];
  async getAll(): Promise<T[]> {
    return [...this.items];
  }

  async getById(id: string) {
    const item = this.items.find((t: T) => t._id === id);
    if (item) {
      return { ...item } as T;
    }
    return undefined;
  }

  async create(item: T) {
    this.items.push(item);
    console.log(this.items);
    return item;
  }

  async updateOne(itemId: string, item: T) {
    this.items.forEach((t: T) => {
      if (t._id === itemId) {
        t = {
          ...t,
          ...item,
        };
      }
    });
    return undefined;
  }

  async deleteOne(itemId: string) {
    const itemIndex = this.items.findIndex((t: T) => t._id === itemId);
    this.items.splice(itemIndex, 1);
  }

  async deleteAll() {
    this.items = [];
  }
}
