Clone saaskit Create a front folder and move everything except tools and import
map Modify front/deno.json to point to import map in the root folder Create a
deno.json to encapsulate front tasks:

```
{
  "lock": false,
  "tasks": {
    "init:stripe": "deno run --allow-read --allow-env --allow-net tools/init_stripe.ts ",
    "front:start": "cd front && deno task start",
    "front:test": "cd front && deno task test",
    "front:test:e2e": "cd front && deno task test:e2e",
    "check:license": "deno run --allow-read --allow-write tools/check_license.ts",
    "ok": "deno fmt --check && deno lint && deno task check:license --check && deno check main.ts && deno task test"
  },
  "importMap": "./import_map.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "fmt": {
    "exclude": [
      "supabase"
    ]
  }
}
```

Install danet CLI

Create a new danet project by doing `danet new back`

Take content from back/import_map and add it to root import_map

Modify back/deno.json to point to the root import map

add new tasks to your deno.json to encapsulate back task

```
"back:launch-server": "cd back && deno task launch-server",
"back:test": "cd back && deno task test",
```

I started with item, creating a basic crud controller, service and in memory
setup.

Then I rewrote front/utils/db.ts relevant function to call the api

```
export async function getAllItems() {
  return (await fetch(`${Deno.env.get("API_URL")}/item`)).json();
}
```

The db.ts file will probably be renamed api.ts later on when all feature have
been migrated to the back.
