import {
  afterAll,
  afterEach,
  beforeAll,
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
import { InMemoryUserRepository } from "./in-memory.repository.ts";
import { User } from "./class.ts";

const userId = "hardcodeduser";
describe("user service", () => {
  const inMemoryUserRepository = new InMemoryUserRepository();
  const userService = new UserService(inMemoryUserRepository);

  afterEach(async () => {
    await inMemoryUserRepository.deleteAll();
  });

  it("create user when it does not exist", async () => {
    const user = await userService.getOrCreateUser(
      "nonexistentemail@email.com",
      "username",
    );
    assertEquals(user.email, "nonexistentemail@email.com");
    assertExists(user._id);
  });

  it("get user when it exist", async () => {
    const existingUser = await inMemoryUserRepository.create(
      new User("existing@email.com", "username"),
    );
    const user = await userService.getOrCreateUser(
      "existing@email.com",
      "username",
    );
    assertEquals(user, existingUser);
  });
});
