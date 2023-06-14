<p align="center">
   <img src="https://user-images.githubusercontent.com/38007824/205580360-fa032554-5e9e-4266-8ec9-c78ca9a233bc.svg" width="250" alt="Danet Logo" />
</p>

## Description

A [Deno SaaSKit](https://deno.com/saaskit) fork using
[Danet](https://github.com/savory/danet) framework for the API.

## Features

- Freh's frontend with
  [No build step](https://deno.com/blog/you-dont-need-a-build-step#non-building-with-deno-and-fresh)
- Deno's built-in [formatter](https://deno.land/manual/tools/formatter),
  [linter](https://deno.land/manual/tools/linter) and
  [test runner](https://deno.land/manual/basics/testing) and TypeScript support.
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

- CI/CD to deploy back+front on Deno Deploy
- Subscription feature
