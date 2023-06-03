import { User } from "./class.ts";

export const USER_REPOSITORY = "USER_REPOSITORY";
export interface UserRepository {
  getByEmail(email: string): Promise<User | undefined>;
  getById(id: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
}
