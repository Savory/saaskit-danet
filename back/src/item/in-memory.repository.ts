import { InMemoryRepository } from "../database/in-memory.repository.ts";
import { Item } from "./class.ts";

export class InMemoryItemRepository extends InMemoryRepository<Item> {}
