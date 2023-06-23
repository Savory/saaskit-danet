import { Injectable } from 'danet/mod.ts';
import { Item } from './class.ts';
import { KvRepository } from "danet-database/kv/repository.ts";
import { KvService } from "danet-database/kv/service.ts";

@Injectable()
export class KvItemRepository extends KvRepository<Item> {
  constructor(protected service: KvService) {
    super(service, 'items');
  }
}
