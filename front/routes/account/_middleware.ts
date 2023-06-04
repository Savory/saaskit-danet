// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { ensureLoggedInMiddleware } from "@/utils/auth.ts";

export const handler = ensureLoggedInMiddleware;
