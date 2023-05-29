import { ActualUserService } from "./actual-user.service.ts";

export class HardCodedAuthService implements ActualUserService {
  async get(): Promise<{ id: string }> {
    return { id: "hardcodedUser" };
  }
}
