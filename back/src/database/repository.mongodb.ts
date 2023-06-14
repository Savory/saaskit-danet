import { Repository } from './repository.ts';
import { Filter, ObjectId } from 'mongo/mod.ts';
import { MongodbService } from '../database/mongodb.service.ts';

interface Document {
  _id: string | ObjectId;
}

export abstract class MongodbRepository<T extends Document>
  implements Repository<T> {
  constructor(
    protected dbService: MongodbService,
    public readonly collectionName: string,
  ) {
  }
  async getAll(filter: Filter<T> = {}): Promise<T[]> {
    return (await this.dbService.getCollection<T>(this.collectionName).find(
      filter,
    )
      .toArray()).map((obj) => ({ ...obj, _id: obj._id.toString() }));
  }

  async getOne(filter: Filter<T>) {
    const obj = await this.dbService.getCollection<T>(this.collectionName)
      .findOne(filter);
    if (!obj) return undefined;
    return {
      ...obj,
      _id: obj._id.toString(),
    };
  }

  async getById(id: string) {
    const obj = await this.dbService.getCollection<T>(this.collectionName)
      .findOne({
        _id: new ObjectId(id),
      });
    if (!obj) return undefined;
    return {
      ...obj,
      _id: obj._id.toString(),
    };
  }

  async create(obj: T) {
    obj._id = new ObjectId();
    await this.dbService.getCollection<T>(
      this.collectionName,
    ).insertOne(obj);
    return obj;
  }

  async updateOne(objId: string, obj: Partial<T>) {
    const _id = new ObjectId(objId);
    const updated = await this.dbService.getCollection<T>(this.collectionName)
      .updateOne(
        // deno-lint-ignore no-explicit-any
        { _id } as any,
        // deno-lint-ignore no-explicit-any
        { $set: { ...obj } } as any,
      );
    return updated;
  }

  async deleteOne(objId: string) {
    return this.dbService.getCollection<T>(this.collectionName).deleteOne({
      _id: new ObjectId(objId),
    });
  }

  async deleteAll() {
    return this.dbService.getCollection<T>(this.collectionName).deleteMany({});
  }
}
