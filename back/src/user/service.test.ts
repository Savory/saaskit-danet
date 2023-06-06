import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "std/testing/bdd.ts";
import {
  assertEquals,
  assertExists,
  assertRejects,
  assertThrows,
} from "std/testing/asserts.ts";
import { UserService } from "./service.ts";
import { InMemoryUserRepository } from "./repository.memory.ts";
import { User } from "./class.ts";

const userId = "hardcodeduser";
describe("user service", () => {
  const inMemoryUserRepository = new InMemoryUserRepository();
  const userService = new UserService(inMemoryUserRepository);
  const users = [
    new User("toto@toto.com", "toto"),
    new User("titi@titi.com", "titi"),
  ];
  beforeEach(async () => {
    for (const user of users) {
      await inMemoryUserRepository.create(user);
    }
  });

  afterEach(async () => {
    await inMemoryUserRepository.deleteAll();
  });

  describe(userService.getUserPublicInformation.name, () => {
    it("get user public information if exist", async () => {
      const user = await userService.getUserPublicInformation(users[0]._id);
      assertEquals(user, {
        username: users[0].username,
        avatarUrl: users[0].avatarUrl,
        _id: users[0]._id,
      });
    });
    it("throw if does not exist", async () => {
      await assertRejects(() => userService.getUserPublicInformation("nop"));
    });
  });

  describe(userService.getMultipleUserPublicInformation.name, () => {
    it("get users public information if they exist", async () => {
      const user = await userService.getMultipleUserPublicInformation([
        users[0]._id,
        "nonexisting",
        users[1]._id,
      ]);
      assertEquals(user, [{
        username: users[0].username,
        avatarUrl: users[0].avatarUrl,
        _id: users[0]._id,
      }, {
        username: users[1].username,
        avatarUrl: users[1].avatarUrl,
        _id: users[1]._id,
      }]);
    });
  });
});
