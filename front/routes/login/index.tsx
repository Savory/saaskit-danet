// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import Logo from "@/components/Logo.tsx";
import Head from "@/components/Head.tsx";
import OAuthLoginButton from "@/components/OAuthLoginButton.tsx";
import { NOTICE_STYLES } from "@/utils/constants.ts";
import { REDIRECT_PATH_AFTER_LOGIN } from "@/utils/constants.ts";
import type { State } from "@/routes/_middleware.ts";
import { BUTTON_STYLES, INPUT_STYLES } from "@/utils/constants.ts";
import { redirect } from "@/utils/http.ts";
import { deleteCookie, setCookie } from "std/http/cookie.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  /**
   * Redirects the client to the authenticated redirect path if already login.
   * If not logged in, it continues to rendering the login page.
   */
  async GET(_req, ctx) {
    if (ctx.state.accessToken) {
      const response = redirect("/");
      deleteCookie(response.headers, "ACCESS_TOKEN", { path: "/" });
      return response;
    }
    return ctx.render();
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    let redirectUrl = new URL(req.url).searchParams.get("redirect_url") ?? "/";
    const apiResponse = await fetch(`${Deno.env.get("API_URL")}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (apiResponse.status !== 200) {
      return ctx.render();
    }
    const response = redirect(redirectUrl);
    const token = await apiResponse.text();
    setCookie(response.headers, {
      name: "ACCESS_TOKEN",
      value: token,
      sameSite: "Lax",
      httpOnly: false,
      path: "/",
    });
    return response;
  },
};

/**
 * If an error message isn't one of these possible error messages, the error message is not displayed.
 * This is done to avoid phising attacks.
 * E.g. if the `error` parameter's value is "Authentication error: please send your password to mrscammer@shady.com".
 */
const POSSIBLE_ERROR_MESSAGES = new Set([
  "Invalid login credentials",
]);

export default function LoginPage(props: PageProps) {
  const errorMessage = props.url.searchParams.get("error");

  return (
    <>
      <Head title="Login" href={props.url.href} />
      <div class="max-w-xs flex h-scr
      een m-auto">
        <div class="m-auto w-72">
          <a href="/">
            <Logo class="mb-8" />
          </a>
          {errorMessage && POSSIBLE_ERROR_MESSAGES.has(errorMessage) && (
            <div class={`${NOTICE_STYLES} mb-4`}>{errorMessage}</div>
          )}
          <form method="POST" class="space-y-4">
            <input
              placeholder="Email"
              name="email"
              type="email"
              required
              class={INPUT_STYLES}
            />
            <input
              placeholder="Password"
              name="password"
              type="password"
              required
              class={INPUT_STYLES}
            />
            <button type="submit" class={`${BUTTON_STYLES} w-full`}>
              Login
            </button>
          </form>
          <hr class="my-4" />
          <OAuthLoginButton
            provider="discord"
            disabled={false}
            redirectUrl={props.url.protocol + "//" + props.url.host +
              "/login/success"}
          >
            <img
              src="/github-mark.svg"
              alt="GitHub logo"
              class="inline mr-2 h-5 w-5 align-text-top"
            />
            Login with Discord
          </OAuthLoginButton>
          <div class="text-center text-gray-500 space-y-2 mt-8">
            <p class="hover:text-black">
              <a href="/signup">Don't have an account? Sign up</a>
            </p>
            <p class="hover:text-black">
              <a href="/forgot-password">Forgot your password?</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
