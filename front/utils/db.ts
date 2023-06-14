// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { stripe } from "./payments.ts";

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
export async function getUsersByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  return (await fetch(
    `${Deno.env.get("API_URL")}/user?${new URLSearchParams(
      uniqueIds.map((s) => ["id", s]),
    )}`,
  )).json();
}
