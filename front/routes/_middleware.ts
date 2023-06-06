// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { getCookies } from "std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { walk } from "std/fs/walk.ts";
import { decode, Payload } from "jwt/mod.ts";
import { User } from "../utils/db.ts";
const STATIC_DIR_ROOT = new URL("../static", import.meta.url);
const staticFileNames: string[] = [];
for await (const { name } of walk(STATIC_DIR_ROOT, { includeDirs: false })) {
  staticFileNames.push(name);
}

function isExpired(exp: number, leeway: number): boolean {
  return exp + leeway < Date.now() / 1000;
}

export interface State {
  accessToken: string;
  actualUser: User;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const { pathname } = new URL(req.url);
  // Don't process session-related data for keepalive and static requests
  if (["_frsh", ...staticFileNames].some((part) => pathname.includes(part))) {
    return await ctx.next();
  }
  const accessToken = getAccessToken(req.headers);
  if (accessToken) {
    const [_header, payload, _signature] = decode(accessToken);
    if (!isExpired((payload as Payload).exp!, 0)) {
      ctx.state.accessToken = accessToken;
      ctx.state.actualUser = payload as {
        _id: string;
        username: string;
        email: string;
      };
    }
  }
  return ctx.next();
}

function getAccessToken(headers: Headers) {
  return getCookies(headers)["ACCESS_TOKEN"];
}
