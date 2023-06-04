// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import AuthFragmentCatcher from "@/islands/AuthFragmentCatcher.tsx";
import { State } from "../_middleware.ts";
import { setCookie } from "std/http/cookie.ts";
import { redirect } from "../../utils/http.ts";

export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || "";
    let response;
    if (token) {
      response = redirect("/");
      setCookie(response.headers, {
        name: "ACCESS_TOKEN",
        value: token,
        sameSite: "Lax",
        httpOnly: false,
        path: "/",
      });
      ctx.state.accessToken = token;
    } else {
      response = redirect("/login");
    }
    return response;
  },
};
