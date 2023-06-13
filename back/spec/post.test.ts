import { bootstrap } from "../src/bootstrap.ts";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from "std/testing/bdd.ts";
import { assertEquals, assertExists } from "std/testing/asserts.ts";
import { DanetApplication } from "danet/mod.ts";
import { ItemService } from "../src/item/service.ts";
import { Item } from "../src/item/class.ts";
import { Comment } from "../src/item/comment/class.ts";
import { Repository } from "../src/database/repository.ts";
import { COMMENT_REPOSITORY } from "../src/item/comment/constant.ts";
import { AuthService } from "../src/auth/service.ts";
import { USER_REPOSITORY, UserRepository } from "../src/user/repository.ts";
import { VoteRepository } from "../src/item/vote/repository.ts";
import { VOTE_REPOSITORY } from "../src/item/vote/constant.ts";
import { CommentRepository } from "../src/item/comment/repository.ts";

let app: DanetApplication;
let server;
let postService: ItemService;
let authService: AuthService;
let port: number;
let apiUrl: string;
let token: string;
const payload: Omit<Item, "_id" | "createdAt" | "userId" | "score"> = {
  title: "my todo",
  url: "https://www.google.com",
};

describe("Item", () => {
  beforeAll(async () => {
    app = await bootstrap();
    server = await app.listen(0);
    postService = await app.get<ItemService>(ItemService);
    authService = await app.get<AuthService>(AuthService);
    const userRepository = await app.get<UserRepository>(USER_REPOSITORY);
    const voteRepository = await app.get<VoteRepository>(VOTE_REPOSITORY);
    const commentRepository = await app.get<CommentRepository>(
      COMMENT_REPOSITORY,
    );
    await userRepository.deleteAll();
    await voteRepository.deleteAll();
    await commentRepository.deleteAll();
    token = await authService.registerUser({
      username: "myusername",
      password: "MySafePassword0123",
      email: "myfakeemail@test.com",
      provider: "local",
    });

    port = server.port;
    apiUrl = `http://localhost:${port}`;
    // we need this to make oak listen outside of any test to not leak
    const res = await fetch(apiUrl);
    await res.text();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await postService.deleteAll();
  });

  it("create item", async () => {
    const res = await fetch(`${apiUrl}/item`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(payload),
    });
    const returnedData: Item = await res.json();
    assertEquals(res.status, 200);
    assertExists(returnedData._id);
    assertEquals(returnedData.score, 0);
    assertEquals(returnedData.title, payload.title);
    assertEquals(returnedData.url, payload.url);
  });

  it("fails to create item if url is not valid", async () => {
    const res = await fetch(`${apiUrl}/item`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...payload,
        url: "badurl",
      }),
    });
    await res.body?.cancel();
    assertEquals(res.status, 400);
  });

  it("get items", async () => {
    (await fetch(`${apiUrl}/item`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    (await fetch(`${apiUrl}/item`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    (await fetch(`${apiUrl}/item`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    const res = await fetch(`${apiUrl}/item`);
    const items = await res.json();
    assertEquals(items.length, 3);
  });

  it("get items by id", async () => {
    const createdPost = await (await fetch(`${apiUrl}/item`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })).json();
    const post = await (await fetch(`${apiUrl}/item/${createdPost._id}`))
      .json();
    assertEquals(post._id, createdPost._id);
  });

  it("add comment to item", async () => {
    const createdPost = await createPostAndComment();
    const commentRepository = app.get<Repository<Comment>>(COMMENT_REPOSITORY);
    const comments: Comment[] = await commentRepository.getAll();
    assertEquals(comments.length, 1);
    assertEquals(comments[0].itemId, createdPost._id);
  });

  it("get item comments", async () => {
    const createdPost = await createPostAndComment();
    const comments = await (await fetch(
      `${apiUrl}/item/${createdPost._id}/comment`,
    ))
      .json();
    assertEquals(comments.length, 1);
    assertEquals(comments[0].itemId, createdPost._id);
  });

  it("upvote item and get item upvote count", async () => {
    const createdPost = await createPostAndComment();
    (await fetch(`${apiUrl}/item/${createdPost._id}/upvote`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "POST",
    }))
      .body?.cancel();
    const item: Item = await (await fetch(`${apiUrl}/item/${createdPost._id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    })).json();
    console.log(item);
    assertEquals(item.score, 1);
    assertEquals(item.userHasVoted, true);
  });

  it("upvote item, remove upvote, get item upvote count", async () => {
    const createdPost = await createPostAndComment();
    (await fetch(`${apiUrl}/item/${createdPost._id}/upvote`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
      },
    }))
      .body?.cancel();
    (await fetch(`${apiUrl}/item/${createdPost._id}/upvote`, {
      headers: {
        authorization: "Bearer " + token,
      },
      method: "DELETE",
    }))
      .body?.cancel();
    const item: Item = await (await fetch(`${apiUrl}/item/${createdPost._id}`))
      .json();
    assertEquals(item.score, 0);
    assertEquals(item.userHasVoted, false);
  });
});

async function createPostAndComment() {
  const createdPost = await (await fetch(`${apiUrl}/item`, {
    headers: {
      authorization: "Bearer " + token,
    },
    method: "POST",
    body: JSON.stringify(payload),
  })).json();
  await (await fetch(
    `${apiUrl}/item/${createdPost._id}/comment`,
    {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        text: "hellow !",
      }),
    },
  )).json();
  return createdPost;
}
