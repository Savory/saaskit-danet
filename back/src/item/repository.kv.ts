import { Injectable } from "danet/mod.ts";
import { Item } from "./class.ts";
import { KvService } from "../database/kv.service.ts";
import { KvRepository } from "../database/repository.kv.ts";

@Injectable()
export class KvItemRepository extends KvRepository<Item> {
  constructor(protected service: KvService) {
    super(service, "items");
  }
}
