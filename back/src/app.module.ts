import { Module } from 'danet/mod.ts';
import { ItemModule } from './item/module.ts';
import { AppController } from './app.controller.ts';
import { AuthModule } from './auth/module.ts';
import { UserModule } from './user/module.ts';

@Module({
  controllers: [AppController],
  imports: [UserModule, AuthModule, ItemModule],
})
export class AppModule {}
