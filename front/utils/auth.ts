// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { MiddlewareHandlerContext } from "$fresh/server.ts";
import { redirect } from "./http.ts";

export async function ensureLoggedInMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  if (!ctx.state.actualUser) {
    return redirect(`/login?redirect_url=${encodeURIComponent(req.url)}`);
  }

  return await ctx.next();
}
