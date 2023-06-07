import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "std/testing/bdd.ts";
import {
  assertEquals,
  assertExists,
  assertNotEquals,
  assertRejects,
} from "std/testing/asserts.ts";
import { InMemoryUserRepository } from "../user/repository.memory.ts";
import { AuthService } from "./service.ts";
import { User } from "../user/class.ts";
describe("Auth Service", () => {
  const userRepo = new InMemoryUserRepository();
  const authService = new AuthService(userRepo);
  beforeAll(async () => {
    console.log("beforeall");
    Deno.env.set("JWT_SECRET", "MYENV");
    await authService.onAppBootstrap();
  });
  afterEach(async () => {
    await userRepo.deleteAll();
  });
  describe("oauth2 provider", () => {
    it("register new user", async () => {
      const token = await authService.registerOrLoginOAuth2(
        "myemail@email.com",
        "myusername",
        "google",
      );
      const userInDb = await userRepo.getByEmail("myemail@email.com");

      assertExists(userInDb, "User has not been created in DB");
      assertExists(token);
    });

    it("login user if it exists", async () => {
      await userRepo.create(new User("hello@email.com", "username"));
      const token = await authService.registerOrLoginOAuth2(
        "hello@email.com",
        "username",
        "google",
      );
      const userInDbCount = (await userRepo.getAll()).length;
      assertExists(token);
      assertEquals(
        userInDbCount,
        1,
        "A new user has been created when it should not",
      );
    });
  });

  describe("local provider", () => {
    it("password not safe", async () => {
      await assertRejects(() =>
        authService.registerUser({
          username: "myusername",
          password: "notenough",
          provider: "local",
          email: "my@email.com",
        })
      );
      await assertRejects(() =>
        authService.registerUser({
          username: "myusername",
          password: "1111111111111",
          provider: "local",
          email: "my@email.com",
        })
      );

      await assertRejects(() =>
        authService.registerUser({
          username: "myusername",
          password: "aaaaaaaaaaaaaaaaaaa",
          provider: "local",
          email: "my@email.com",
        })
      );
    });

    it("register new user", async () => {
      const token = await authService.registerUser({
        username: "myusername",
        email: "my@email.com",
        provider: "local",
        password: "mypasswordisSafeBecauseitsLongandNumber1",
      });
      const userInDb = await userRepo.getByEmail("my@email.com");
      assertExists(token);
      assertExists(userInDb);
      assertNotEquals(
        userInDb.password,
        "mypasswordisSafeBecauseitsLongandNumber1",
      );
    });

    it("does not register if email already exist", async () => {
      await userRepo.create(new User("hello@email.com", "username"));
      await assertRejects(() =>
        authService.registerUser({
          username: "myusername",
          email: "hello@email.com",
          provider: "local",
          password: "mypasswordisSafeBecauseitsLongandNumber1",
        })
      );
    });

    it("login", async () => {
      await authService.registerUser({
        username: "myusername",
        email: "my@email.com",
        provider: "local",
        password: "mypasswordisSafeBecauseitsLongandNumber1",
      });
      const token = await authService.login(
        "my@email.com",
        "mypasswordisSafeBecauseitsLongandNumber1",
      );
      assertExists(token);
    });
  });
});
