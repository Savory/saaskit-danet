import { InjectableConstructor, Module, TokenInjector } from "danet/mod.ts";
import { MongodbService } from "./mongodb.service.ts";
import { KvService } from "./kv.service.ts";

export const DATABASE = "DATABASE";

@Module({
  imports: [],
  injectables: ((): Array<InjectableConstructor | TokenInjector> => {
    const provider = Deno.env.get("DB_PROVIDER");
    if (provider === "MONGO") {
      return [MongodbService];
    } else if (provider === "KV") {
      return [KvService];
    }
    return [];
  })(),
})
export class DatabaseModule {}
