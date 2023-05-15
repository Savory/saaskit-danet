import { bootstrap } from "../src/bootstrap.ts";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from "https://deno.land/std@0.140.0/testing/bdd.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { DanetApplication } from "danet/mod.ts";
import { ItemService } from "../src/item/service.ts";
import { Item } from "../src/item/class.ts";
import { Comment } from "../src/item/comment/class.ts";
import { InMemoryCommentRepository } from "../src/item/comment/in-memory-repository.ts";
import { Repository } from "../src/database/repository.ts";
import { COMMENT_REPOSITORY } from "../src/item/comment/constant.ts";

let app: DanetApplication;
let server;
let postService: ItemService;
let port: number;
const payload: Omit<Item, "_id" | "createdAt" | "userId" | "score"> = {
  title: "my todo",
  url: "https://www.google.com",
};

describe("Item", () => {
  beforeAll(async () => {
    app = await bootstrap();
    server = await app.listen(0);
    postService = await app.get<ItemService>(ItemService);
    port = server.port;

    // we need this to make oak listen outside of any test to not leak
    const res = await fetch(`http://localhost:${port}`);
    await res.text();
  });

  afterEach(async () => {
    await postService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  it("create item", async () => {
    const res = await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const returnedData: Item = await res.json();
    assertExists(returnedData._id);
    assertEquals(returnedData.score, 0);
    assertEquals(returnedData.title, payload.title);
    assertEquals(returnedData.url, payload.url);
  });

  it("fails to create item if url is not valid", async () => {
    const res = await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        url: "badurl",
      }),
    });
    await res.body?.cancel();
    assertEquals(res.status, 400);
  });

  it("get items", async () => {
    (await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    (await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    (await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify(payload),
    })).body?.cancel();
    const res = await fetch(`http://localhost:${port}/item`);
    const items = await res.json();
    assertEquals(items.length, 3);
  });

  it("get items by id", async () => {
    const createdPost = await (await fetch(`http://localhost:${port}/item`, {
      method: "POST",
      body: JSON.stringify(payload),
    })).json();
    const post =
      await (await fetch(`http://localhost:${port}/item/${createdPost._id}`))
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
      `http://localhost:${port}/item/${createdPost._id}/comments`,
    ))
      .json();
    assertEquals(comments.length, 1);
    assertEquals(comments[0].itemId, createdPost._id);
  });
});

async function createPostAndComment() {
  const createdPost = await (await fetch(`http://localhost:${port}/item`, {
    method: "POST",
    body: JSON.stringify(payload),
  })).json();
  const createdComment = await (await fetch(
    `http://localhost:${port}/item/${createdPost._id}/add-comment`,
    {
      method: "POST",
      body: JSON.stringify({
        text: "hellow !",
      }),
    },
  )).json();
  return createdPost;
}
