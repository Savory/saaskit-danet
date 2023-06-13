import { Module, TokenInjector } from "danet/mod.ts";
import { USER_REPOSITORY } from "./repository.ts";
import { UserService } from "./service.ts";
import { UserController } from "./controller.ts";
import { InMemoryUserRepository } from "./repository.memory.ts";

// import { MongoDbUserRepository } from "./repository.mongodb.ts";

@Module({
  controllers: [UserController],
  injectables: [
    new TokenInjector(InMemoryUserRepository, USER_REPOSITORY),
    // new TokenInjector(MongoDbUserRepository, USER_REPOSITORY),
    UserService,
  ],
})
export class UserModule {}
