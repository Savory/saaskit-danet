import { InMemoryRepository } from "../database/repository.memory.ts";
import { Item } from "./class.ts";

export class InMemoryItemRepository extends InMemoryRepository<Item> {}
