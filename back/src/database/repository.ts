export interface Repository<T extends unknown> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  // deno-lint-ignore no-explicit-any
  create(dto: unknown): Promise<any>;
  updateOne(id: string, dto: T): Promise<unknown>;
  deleteOne(id: string): Promise<unknown>;
  deleteAll(): Promise<unknown>;
}
