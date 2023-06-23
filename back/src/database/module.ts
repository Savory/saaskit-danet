import { Module, Constructor } from 'danet/mod.ts';
import { MongodbModule } from "danet-database/mongodb/module.ts";
import { KvModule } from "danet-database/kv/module.ts";

@Module({
  imports: ((): Array<Constructor> => {
    const provider = Deno.env.get('DB_PROVIDER');
    if (provider === 'MONGO') {
      return [MongodbModule];
    } else if (provider === 'KV') {
      return [KvModule];
    }
    return [];
  })(),
  injectables: [],
})
export class DatabaseModule {}
