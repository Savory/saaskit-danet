export class HardCodedAuthService {
  async getActualUser(): Promise<{ id: string }> {
    return { id: "hardcodedUser" };
  }
}
