import { ItemController } from "./controller.ts";
import { ItemService } from "./service.ts";
import { Module, TokenInjector } from "danet/mod.ts";
import { ITEM_REPOSITORY } from "./constant.ts";
import { InMemoryItemRepository } from "./repository.memory.ts";
import { CommentService } from "./comment/service.ts";
import { InMemoryCommentRepository } from "./comment/repository.memory.ts";
import { InMemoryVoteRepository } from "./vote/repository.memory.ts";
import { COMMENT_REPOSITORY } from "./comment/constant.ts";
import { VOTE_REPOSITORY } from "./vote/constant.ts";
import { VoteService } from "./vote/service.ts";

@Module({
  controllers: [ItemController],
  injectables: [
    new TokenInjector(InMemoryItemRepository, ITEM_REPOSITORY),
    new TokenInjector(InMemoryCommentRepository, COMMENT_REPOSITORY),
    new TokenInjector(InMemoryVoteRepository, VOTE_REPOSITORY),
    ItemService,
    CommentService,
    VoteService,
  ], // change InMemoryTodoRepository by any custom repository using other database engine if needed
})
export class ItemModule {}
