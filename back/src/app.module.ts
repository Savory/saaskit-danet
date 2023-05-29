import { Module } from "danet/mod.ts";
import { ItemModule } from "./item/module.ts";
import { AppController } from "./app.controller.ts";
import { AuthModule } from "./auth/module.ts";

@Module({
  controllers: [AppController],
  imports: [AuthModule, ItemModule],
})
export class AppModule {}
