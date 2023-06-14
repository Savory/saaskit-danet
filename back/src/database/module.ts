import { InjectableConstructor, Module, TokenInjector } from "danet/mod.ts";
import { MongodbService } from "./mongodb.service.ts";

export const DATABASE = "DATABASE";

@Module({
  imports: [],
  injectables: ((): Array<InjectableConstructor | TokenInjector> => {
    const provider = Deno.env.get("DB_PROVIDER");
    if (provider === "MONGO") {
      return [MongodbService];
    }
    return [];
  })(),
})
export class DatabaseModule {}
