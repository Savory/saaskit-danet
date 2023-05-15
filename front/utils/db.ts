// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { stripe } from "./payments.ts";

export const kv = await Deno.openKv();

interface InitItem {
  userId: string;
  title: string;
  url: string;
}

export interface Item extends InitItem {
  _id: string;
  createdAt: Date;
  score: number;
}

export async function createItem(initItem: InitItem) {
  return (await fetch(`${Deno.env.get("API_URL")}/item`, {
    method: "POST",
    body: JSON.stringify(initItem),
  })).json();
}

export async function getAllItems(options?: Deno.KvListOptions) {
  const iter = await kv.list<Item>({ prefix: ["items"] }, options);
  const items = [];
  for await (const res of iter) items.push(res.value);
  return items;
}

export async function deleteAllItems() {
  const iter = await kv.list<Item>({ prefix: ["items"] });
  for await (const res of iter) kv.delete(res.key);
}

export async function getItemById(id: string) {
  return (await fetch(`${Deno.env.get("API_URL")}/item/${id}`)).json();
}

export async function getItemByUser(userId: string, itemId: string) {
  const res = await kv.get<Item>(["items_by_users", userId, itemId]);
  return res.value;
}

interface InitComment {
  userId: string;
  itemId: string;
  text: string;
}

export interface Comment extends InitComment {
  id: string;
  createdAt: Date;
}

export async function createComment(initComment: InitComment) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${initComment.itemId}/add-comment`,
    {
      method: "POST",
      body: JSON.stringify(initComment),
    },
  )).json();
}

export async function getCommentsByItem(
  itemId: string,
) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${itemId}/comments`,
    {
      method: "GET",
    },
  )).json();
}

interface InitVote {
  userId: string;
  itemId: string;
}

export async function createVote(initVote: InitVote) {
  const itemKey = ["items", initVote.itemId];
  const voteByUserKey = ["votes_by_users", initVote.userId, initVote.itemId];

  let res = { ok: false };
  while (!res.ok) {
    const itemRes = await kv.get<Item>(itemKey);

    if (itemRes.value === null) throw new Error("Item does not exist");

    const itemByUserKey = [
      "items_by_user",
      itemRes.value.userId,
      itemRes.value._id,
    ];

    const itemByUserRes = await kv.get<Item>(itemByUserKey);

    if (itemByUserRes.value === null) {
      throw new Error("Item by user does not exist");
    }

    itemByUserRes.value.score++;
    itemRes.value.score++;

    res = await kv.atomic()
      .check({ key: voteByUserKey, versionstamp: null })
      .check(itemByUserRes)
      .check(itemRes)
      .set(itemByUserRes.key, itemByUserRes.value)
      .set(itemRes.key, itemRes.value)
      .set(voteByUserKey, undefined)
      .commit();
  }
}

export async function deleteVote(initVote: InitVote) {
  const itemKey = ["items", initVote.itemId];
  const voteByUserKey = ["votes_by_users", initVote.userId, initVote.itemId];

  let res = { ok: false };
  while (!res.ok) {
    const itemRes = await kv.get<Item>(itemKey);
    const voteByUserRes = await kv.get<Item>(voteByUserKey);

    if (itemRes.value === null) throw new Error("Item does not exist");

    const itemByUserKey = [
      "items_by_user",
      itemRes.value.userId,
      itemRes.value._id,
    ];

    const itemByUserRes = await kv.get<Item>(itemByUserKey);

    if (itemByUserRes.value === null) {
      throw new Error("Item by user does not exist");
    }
    if (voteByUserRes.value === null) return;

    itemByUserRes.value.score--;
    itemRes.value.score--;

    res = await kv.atomic()
      .check(itemByUserRes)
      .check(itemRes)
      .check(voteByUserRes)
      .set(itemByUserRes.key, itemByUserRes.value)
      .set(itemRes.key, itemRes.value)
      .delete(voteByUserKey)
      .commit();
  }
}

export async function getVotedItemIdsByUser(
  userId: string,
  options?: Deno.KvListOptions,
) {
  const iter = await kv.list<undefined>({
    prefix: ["votes_by_users", userId],
  }, options);
  const voteItemIds = [];
  for await (const res of iter) voteItemIds.push(res.key.at(-1));
  return voteItemIds;
}

interface InitUser {
  id: string;
  stripeCustomerId: string;
  displayName: string;
}

export interface User extends InitUser {
  isSubscribed: boolean;
}

export async function createUser(initUser: InitUser) {
  const usersKey = ["users", initUser.id];
  const stripeCustomersKey = [
    "user_ids_by_stripe_customer",
    initUser.stripeCustomerId,
  ];
  const user: User = { ...initUser, isSubscribed: false };

  const res = await kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: stripeCustomersKey, versionstamp: null })
    .set(usersKey, user)
    .set(stripeCustomersKey, user.id)
    .commit();

  if (!res.ok) {
    throw res;
  }

  return user;
}

export async function getUserById(id: string) {
  const res = await kv.get<User>(["users", id]);
  return res.value;
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const res = await kv.get<string>([
    "user_ids_by_stripe_customer",
    stripeCustomerId,
  ]);
  if (!res.value) return null;
  return await getUserById(res.value);
}

export async function setUserSubscription(
  id: string,
  isSubscribed: boolean,
) {
  const key = ["users", id];
  const userRes = await kv.get<User>(key);

  if (userRes.value === null) throw new Error("User with ID does not exist");

  const res = await kv.atomic()
    .check(userRes)
    .set(key, { ...userRes.value, isSubscribed } as User)
    .commit();

  if (!res.ok) {
    throw new TypeError("Atomic operation has failed");
  }
}

export async function getUsersByIds(ids: string[]) {
  const keys = ids.map((id) => ["users", id]);
  const res = await kv.getMany<User[]>(keys);
  return res.map((entry) => entry.value!);
}

export async function getOrCreateUser(id: string, email: string) {
  const user = await getUserById(id);
  if (user) return user;

  const customer = await stripe.customers.create({ email });
  return await createUser({
    id,
    stripeCustomerId: customer.id,
    displayName: "",
  });
}

export function getUserDisplayName(user?: User) {
  return user?.displayName || user?.id || "unknown user";
}

export async function setUserDisplayName(
  userId: User["id"],
  displayName: User["displayName"],
) {
  const userKey = ["users", userId];
  const userRes = await kv.get<User>(userKey);

  if (!userRes.versionstamp) throw new Error("User does not exist");

  await kv.atomic()
    .check(userRes)
    .set(userKey, { ...userRes.value, displayName })
    .commit();
}

export async function getAllUsers(options?: Deno.KvListOptions) {
  const iter = await kv.list<Item>({ prefix: ["users"] }, options);
  const items = [];
  for await (const res of iter) items.push(res.value);
  return items;
}

export async function deleteAllUsers() {
  const iter = await kv.list<Item>({ prefix: ["users"] });
  for await (const res of iter) kv.delete(res.key);
}
