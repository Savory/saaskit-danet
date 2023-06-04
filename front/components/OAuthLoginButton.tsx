// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Provider } from "@supabase/supabase-js";
import type { ComponentChild } from "preact";

interface OAuthLoginButtonProps {
  provider: Provider;
  disabled: boolean;
  children: ComponentChild;
  redirectUrl: string;
}

export default function OAuthLoginButton(props: OAuthLoginButtonProps) {
  return (
    <form
      action={Deno.env.get("API_URL") + "/oauth2/login/" + props.provider}
    >
      <input type="hidden" value={props.redirectUrl} name="redirecturl" />
      <button
        type="submit"
        class="px-4 py-2 w-full bg-white text-black text-lg rounded-lg border-2 border-black disabled:(opacity-50 cursor-not-allowed)"
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </form>
  );
}
