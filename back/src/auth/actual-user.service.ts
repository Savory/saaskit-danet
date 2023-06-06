import { User } from "../user/class.ts";
import { UpdateAccountDTO } from "./class.ts";

export interface ActualUserService {
  get(): Promise<User>;
  updateInfo(date: UpdateAccountDTO): Promise<void>;
}
