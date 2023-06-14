import { ItemController } from "./controller.ts";
import { ItemService } from "./service.ts";
import { Module, TokenInjector } from "danet/mod.ts";
import { ITEM_REPOSITORY } from "./constant.ts";
import { CommentService } from "./comment/service.ts";
import { COMMENT_REPOSITORY } from "./comment/constant.ts";
import { VOTE_REPOSITORY } from "./vote/constant.ts";
import { VoteService } from "./vote/service.ts";
import { InMemoryItemRepository } from "./repository.memory.ts";
import { InMemoryCommentRepository } from "./comment/repository.memory.ts";
import { InMemoryVoteRepository } from "./vote/repository.memory.ts";
import { MongodbItemRepository } from "./repository.mongodb.ts";
import { MongodbVoteRepository } from "./vote/repository.mongodb.ts";
import { MongodbCommentRepository } from "./comment/repository.mongodb.ts";

function getRepositoriesForProvider(provider: string | undefined) {
  if (provider === "MONGO") {
    return [
      new TokenInjector(MongodbItemRepository, ITEM_REPOSITORY),
      new TokenInjector(MongodbCommentRepository, COMMENT_REPOSITORY),
      new TokenInjector(MongodbVoteRepository, VOTE_REPOSITORY),
    ];
  }
  return [
    new TokenInjector(InMemoryItemRepository, ITEM_REPOSITORY),
    new TokenInjector(InMemoryCommentRepository, COMMENT_REPOSITORY),
    new TokenInjector(InMemoryVoteRepository, VOTE_REPOSITORY),
  ];
}

@Module({
  controllers: [ItemController],
  injectables: [
    ...getRepositoriesForProvider(Deno.env.get("DB_PROVIDER")),
    ItemService,
    CommentService,
    VoteService,
  ], // change InMemoryTodoRepository by any custom repository using other database engine if needed
})
export class ItemModule {}
