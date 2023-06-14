import { Module, TokenInjector } from "danet/mod.ts";
import { USER_REPOSITORY } from "./repository.ts";
import { UserService } from "./service.ts";
import { UserController } from "./controller.ts";
import { InMemoryUserRepository } from "./repository.memory.ts";
import { MongoDbUserRepository } from "./repository.mongodb.ts";

function getRepositoryForProvider(provider: string | undefined) {
  if (provider === "MONGO") {
    return MongoDbUserRepository;
  }
  return InMemoryUserRepository;
}

@Module({
  controllers: [UserController],
  injectables: [
    new TokenInjector(
      getRepositoryForProvider(Deno.env.get("DB_PROVIDER")),
      USER_REPOSITORY,
    ),
    UserService,
  ],
})
export class UserModule {}
