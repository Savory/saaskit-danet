import { User } from "../user/class.ts";

export interface ActualUserService {
  get(): Promise<User>;
}
