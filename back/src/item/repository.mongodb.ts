import { Injectable } from 'danet/mod.ts';
import { Item } from './class.ts';
import { MongodbRepository } from "danet-database/mongodb/repository.ts";
import { MongodbService } from "danet-database/mongodb/service.ts";

@Injectable()
export class MongodbItemRepository extends MongodbRepository<Item> {
  constructor(protected service: MongodbService) {
    super(service, 'items');
  }
}
