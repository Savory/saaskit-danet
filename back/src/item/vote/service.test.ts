import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from "std/testing/bdd.ts";
import { VoteService } from "./service.ts";
import { InMemoryVoteRepository } from "./in-memory.repository.ts";
import {
  assertEquals,
  assertRejects,
  assertThrows,
} from "std/testing/asserts.ts";

const userId = "hardcodeduser";
describe("vote service", () => {
  const inMemoryVoteRepository = new InMemoryVoteRepository();
  const voteService = new VoteService(inMemoryVoteRepository, {
    get: async () => ({ id: userId }),
  });

  afterEach(async () => {
    await inMemoryVoteRepository.deleteAll();
  });

  it("upvote", async () => {
    await voteService.upvote("itemId");
    const itemVotes = await inMemoryVoteRepository.getByItemId("itemId");
    assertEquals(itemVotes.length, 1);
  });

  it("cannot upvote if already upvoted", async () => {
    await voteService.upvote("itemId");
    await assertRejects(async () => {
      await voteService.upvote("itemId");
    });
    const itemVotes = await inMemoryVoteRepository.getByItemId("itemId");
    assertEquals(itemVotes.length, 1);
  });

  it("remove upvote", async () => {
    await inMemoryVoteRepository.create({
      _id: "id",
      userId,
      itemId: "itemId",
      createdAt: new Date(),
    });
    await voteService.removeUpvote("itemId");
    const itemVotes = await inMemoryVoteRepository.getByItemId("itemId");
    assertEquals(itemVotes.length, 0);
  });

  it("cannot remove upvote if user did not vote", async () => {
    await assertRejects(async () => {
      await voteService.removeUpvote("itemId");
    });
  });
});
