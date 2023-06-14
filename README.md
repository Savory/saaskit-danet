<p align="center">
   <img src="https://user-images.githubusercontent.com/38007824/205580360-fa032554-5e9e-4266-8ec9-c78ca9a233bc.svg" width="250" alt="Danet Logo" />
</p>

## Description

A [Deno SaaSKit](https://deno.com/saaskit) fork using
[Danet](https://github.com/savory/danet) framework for the API.

## Features

- Fresh's frontend with
  [No build step](https://deno.com/blog/you-dont-need-a-build-step#non-building-with-deno-and-fresh)
- Deno's built-in [formatter](https://deno.land/manual/tools/formatter),
  [linter](https://deno.land/manual/tools/linter) and
  [test runner](https://deno.land/manual/basics/testing) and TypeScript support.
- Auto-generated OpenAPI documentation from code
- Frontend and Business Logic uncoupling
- Registration/Login with Oauth2 (google, discord), easily add your own provider
- Registration/Login with email/password
- Multiple DB providers, choose between KV, MongoDB or InMemory DB _simply by
  modifying an environment variable_
- Business Logic fully unit tested
- API and all DB Adapters tested via e2e tests
- [Fresh](https://fresh.deno.dev/) as the web framework and
  [Tailwind CSS](https://tailwindcss.com/) as the CSS framework.

## To come

- Subscription/Payment feature
- CI/CD to deploy back+front on Deno Deploy (when deno_emit bug will be fixed,
  [see issue](https://github.com/denoland/deno_emit/issues/122), or when deno
  deploy handle emitDecoratorMetadata compiler options)

## How to use

### API

Being built with Danet, we recommend that you use
[our CLI](https://docs.danet.land/cli.html) to run it with filewatch using
`danet develop` If you don't want to use your CLI, then simply run
`deno task back:start` from root directory or `deno task start` from `back`
directory.

#### Pick your favorite DB

This SAASKit handle InMemory, MongoDB and KV as database providers. Simply set
`DB_PROVIDER=MEMORY` or `DB_PROVIDER=MONGO` or `DB_PROVIDER=KV` in your `.env`
or environment. No code change required !

MongoDB is the only provider that require a special setup, i.e, having a MongoDB
database running either locally
[(documentation here)](https://www.mongodb.com/docs/manual/installation/) or on
a remote server/cloud provider, such as
[MongoDB Atlas](https://www.mongodb.com/atlas/database?tck=docs_server) which
has an awesome free tier.

#### Learn how to use Danet framework

We provide an extensive documentation that teaches everything needed to use
Danet here : [https://docs.danet.land/](https://docs.danet.land/). It is
available in English and French, with few pages translated to Portuguese.

### FRONT / SSR

Simply run `deno task front:start` from root directory or `deno task start` from
`front` directory.
