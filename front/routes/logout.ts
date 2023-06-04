// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import { redirect } from "@/utils/http.ts";
import type { State } from "./_middleware.ts";
import { deleteCookie } from "std/http/cookie.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const response = redirect("/");
    deleteCookie(response.headers, "ACCESS_TOKEN", { path: "/" });
    return response;
  },
};
