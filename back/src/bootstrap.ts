import "std/dotenv/load.ts";
import { AppModule } from "./app.module.ts";
import { DanetApplication } from "danet/mod.ts";
import { loggerMiddleware } from "./logger.middleware.ts";
import { SpecBuilder, SwaggerModule } from "danet_swagger/mod.ts";
import { Session } from "session/mod.ts";

const app = new DanetApplication();
app.addGlobalMiddlewares(
  Session.initMiddleware(),
);
export const bootstrap = async () => {
  const application = new DanetApplication();
  await application.init(AppModule);
  const spec = new SpecBuilder()
    .setTitle("SAASKit")
    .setDescription("Danet SAASKit API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = await SwaggerModule.createDocument(application, spec);
  await SwaggerModule.setup("api", application, document);
  app.addGlobalMiddlewares(
    Session.initMiddleware(),
    loggerMiddleware,
  );
  return application;
};
