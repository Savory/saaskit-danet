import { Module } from "danet/mod.ts";
import { ItemModule } from "./item/module.ts";
import { AppController } from "./app.controller.ts";

@Module({
  controllers: [AppController],
  imports: [ItemModule],
})
export class AppModule {}
