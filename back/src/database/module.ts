import { Module } from "danet/mod.ts";
// import { MongodbService } from "./mongodb.service.ts";

export const DATABASE = "DATABASE";

@Module({
  imports: [],
  // injectables: [MongodbService],
})
export class DatabaseModule {}
