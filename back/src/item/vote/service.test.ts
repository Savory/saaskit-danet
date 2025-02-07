import { afterEach, describe, it } from 'std/testing/bdd.ts';
import { VoteService } from './service.ts';
import { InMemoryVoteRepository } from './repository.memory.ts';
import { assertEquals, assertRejects } from 'std/testing/asserts.ts';

const userId = 'hardcodeduser';
describe('vote service', () => {
  const inMemoryVoteRepository = new InMemoryVoteRepository();
  const voteService = new VoteService(inMemoryVoteRepository, {
    get: async () => ({ _id: userId, email: 'whocare', username: 'ok' }),
    // deno-lint-ignore no-explicit-any
  } as any);

  afterEach(async () => {
    await inMemoryVoteRepository.deleteAll();
  });

  it('upvote', async () => {
    await voteService.upvote('itemId');
    const itemVotes = await inMemoryVoteRepository.getByItemId('itemId');
    assertEquals(itemVotes.length, 1);
  });

  it('cannot upvote if already upvoted', async () => {
    await voteService.upvote('itemId');
    await assertRejects(async () => {
      await voteService.upvote('itemId');
    });
    const itemVotes = await inMemoryVoteRepository.getByItemId('itemId');
    assertEquals(itemVotes.length, 1);
  });

  it('remove upvote', async () => {
    await inMemoryVoteRepository.create({
      _id: 'id',
      userId,
      itemId: 'itemId',
      createdAt: new Date(),
    });
    await voteService.removeUpvote('itemId');
    const itemVotes = await inMemoryVoteRepository.getByItemId('itemId');
    assertEquals(itemVotes.length, 0);
  });

  it('cannot remove upvote if user did not vote', async () => {
    await assertRejects(async () => {
      await voteService.removeUpvote('itemId');
    });
  });
});
