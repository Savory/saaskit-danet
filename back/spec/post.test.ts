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

  it("simple item creation", async () => {
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
});
