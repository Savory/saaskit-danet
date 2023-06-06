// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { stripe } from "./payments.ts";

export const kv = await Deno.openKv();

interface InitItem {
  title: string;
  url: string;
}

export interface Item extends InitItem {
  _id: string;
  createdAt: Date;
  score: number;
  userHasVoted: boolean;
}

export async function createItem(initItem: InitItem, accessToken: string) {
  const response = await fetch(`${Deno.env.get("API_URL")}/item`, {
    method: "POST",
    body: JSON.stringify(initItem),
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Creation failed");
  }
  return response.json();
}

export async function getAllItems(accessToken?: string) {
  return (await fetch(`${Deno.env.get("API_URL")}/item`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })).json();
}

export async function deleteAllItems() {
  const iter = await kv.list<Item>({ prefix: ["items"] });
  for await (const res of iter) kv.delete(res.key);
}

export async function getItemById(id: string, accessToken: string) {
  return (await fetch(`${Deno.env.get("API_URL")}/item/${id}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })).json();
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

export async function createComment(
  initComment: InitComment,
  accessToken: string,
) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${initComment.itemId}/comment`,
    {
      method: "POST",
      body: JSON.stringify(initComment),
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )).json();
}

export async function getCommentsByItem(
  itemId: string,
) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${itemId}/comment`,
    {
      method: "GET",
    },
  )).json();
}

interface InitVote {
  userId: string;
  itemId: string;
}

export async function createVote(initVote: InitVote, accessToken: string) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${initVote.itemId}/upvote`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )).json();
}

export async function deleteVote(initVote: InitVote, accessToken: string) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${initVote.itemId}/upvote`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )).body?.cancel();
}

export async function getItemUpvoteInfo(itemId: string, accessToken: string) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/item/${itemId}/upvote`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )).json();
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
  _id: string;
  stripeCustomerId?: string;
  username: string;
  email?: string;
}

export interface User extends InitUser {
  isSubscribed?: boolean;
}

export async function getUserById(id: string) {
  return (await fetch(
    `${Deno.env.get("API_URL")}/user/${id}`,
  )).json();
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
  const uniqueIds = [...new Set(ids)];
  return (await fetch(
    `${Deno.env.get("API_URL")}/user?${new URLSearchParams(
      uniqueIds.map((s) => ["id", s]),
    )}`,
  )).json();
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
