// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { SITE_WIDTH_STYLES } from "@/utils/constants.ts";
import Layout from "@/components/Layout.tsx";
import Head from "@/components/Head.tsx";
import type { State } from "./_middleware.ts";
import ItemSummary from "@/components/ItemSummary.tsx";
import {
  getAllItems,
  getUsersByIds,
  getVotedItemIdsByUser,
  type Item,
  type User,
} from "@/utils/db.ts";

interface HomePageData extends State {
  users: User[];
  items: Item[];
}

export function compareScore(a: Item, b: Item) {
  const x = Number(a.score);
  const y = Number(b.score);
  if (x > y) {
    return -1;
  }
  if (x < y) {
    return 1;
  }
  return 0;
}

export const handler: Handlers<HomePageData, State> = {
  async GET(_req, ctx) {
    /** @todo Add pagination functionality */
    const items = await getAllItems(ctx.state.accessToken);
    const users = await getUsersByIds(items.map((item) => item.userId));
    return ctx.render({ ...ctx.state, items, users });
  },
};

export default function HomePage(props: PageProps<HomePageData>) {
  return (
    <>
      <Head href={props.url.href} />
      <Layout actualUser={props.data.actualUser}>
        <div class={`${SITE_WIDTH_STYLES} flex-1 px-4`}>
          {props.data.items.map((item, index) => (
            <ItemSummary
              item={item}
              isVoted={item.userHasVoted}
              user={props.data.users[index]}
            />
          ))}
        </div>
      </Layout>
    </>
  );
}
