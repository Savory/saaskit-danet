import { Module, TokenInjector } from "danet/mod.ts";
import { InMemoryUserRepository } from "./in-memory.repository.ts";
import { USER_REPOSITORY } from "./repository.ts";
import { UserService } from "./service.ts";

@Module({
  injectables: [
    new TokenInjector(InMemoryUserRepository, USER_REPOSITORY),
    UserService,
  ],
})
export class UserModule {}
