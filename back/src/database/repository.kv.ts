import { Repository } from "../database/repository.ts";
import { KvService } from "./kv.service.ts";

export abstract class KvRepository<T extends { _id: string }>
  implements Repository<T> {
  constructor(
    protected kv: KvService,
    public readonly collectionName: string,
  ) {
  }
  async getAll(): Promise<T[]> {
    const items: T[] = [];
    console.log("collections", this.collectionName);
    for await (
      const entry of this.kv.client().list<T>({ prefix: [this.collectionName] })
    ) {
      items.push(entry.value);
    }
    return items;
  }

  async getById(id: string) {
    if (!id) {
      return undefined;
    }
    const item = await this.kv.client().get([this.collectionName, id]);
    if (item) {
      return item.value as T;
    }
    return undefined;
  }

  async create(item: T): Promise<T> {
    const secondaryKeys = this.getSecondaryKeys(item);
    let transaction = this.kv.client().atomic()
      .set([this.collectionName, item._id], item);
    for (const secondaryKey of Object.keys(secondaryKeys)) {
      transaction = transaction.set(secondaryKeys[secondaryKey], item);
    }
    const transactionResult = await transaction.commit();
    if (!transactionResult.ok) {
      throw new Error("Could create entity");
    }
    return item;
  }

  async deleteOne(itemId: string): Promise<void> {
    const item = await this.getById(itemId);
    if (!item) {
      return;
    }
    const secondaryKeys = this.getSecondaryKeys(item);
    let transaction = this.kv.client().atomic().delete([
      this.collectionName,
      item._id,
    ]);
    for (const secondaryKey of Object.keys(secondaryKeys)) {
      transaction = transaction.delete(secondaryKeys[secondaryKey]);
    }
    await transaction
      .commit();
  }
  async updateOne(itemId: string, item: T) {
    const itemInDb = await this.kv.client().get([this.collectionName, itemId]);
    const itemToInsert = {
      ...itemInDb,
      ...item,
    };
    await this.kv.client().set([this.collectionName, itemId], itemToInsert);
    return itemToInsert;
  }

  async deleteAll() {
    const iter = await this.kv.client().list<T>({
      prefix: [this.collectionName],
    });
    for await (const res of iter) this.kv.client().delete(res.key);
  }

  protected getSecondaryKeys(item: T): any {
    return {};
  }
}
