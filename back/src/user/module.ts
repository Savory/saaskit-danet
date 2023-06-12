import { Module, TokenInjector } from 'danet/mod.ts';
import { InMemoryUserRepository } from './repository.memory.ts';
import { USER_REPOSITORY } from './repository.ts';
import { UserService } from './service.ts';
import { UserController } from './controller.ts';

@Module({
  controllers: [UserController],
  injectables: [
    new TokenInjector(InMemoryUserRepository, USER_REPOSITORY),
    UserService,
  ],
})
export class UserModule {}
