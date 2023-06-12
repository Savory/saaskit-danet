import { InMemoryRepository } from '../database/in-memory.repository.ts';
import { User } from './class.ts';
import { UserRepository } from './repository.ts';

export class InMemoryUserRepository extends InMemoryRepository<User>
  implements UserRepository {
  async getByEmail(email: string): Promise<User | undefined> {
    return this.items.find((u) => u.email === email);
  }
}
