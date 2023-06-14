import { Injectable } from 'danet/mod.ts';
import { MongodbService } from '../database/mongodb.service.ts';
import { MongodbRepository } from '../database/repository.mongodb.ts';
import { Item } from './class.ts';

@Injectable()
export class MongodbItemRepository extends MongodbRepository<Item> {
  constructor(protected service: MongodbService) {
    super(service, 'items');
  }
}
