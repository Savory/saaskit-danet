import { Injectable } from "danet/mod.ts";
import { User } from "./class.ts";
import { UserRepository } from "./repository.ts";
import { KvService } from "../database/kv.service.ts";
import { KvRepository } from "../database/repository.kv.ts";

@Injectable()
export class KvUserRepository extends KvRepository<User>
  implements UserRepository {
  constructor(protected kv: KvService) {
    super(kv, "users");
  }
  async getByEmail(email: string): Promise<User | undefined> {
    const entry = await this.kv.client().get<User>([
      this.collectionName,
      email,
    ]);
    return entry.value !== null ? entry.value : undefined;
  }

  protected getSecondaryKeys(user: User) {
    const userByEmail = [this.collectionName, user.email];
    return { userByEmail };
  }
}
