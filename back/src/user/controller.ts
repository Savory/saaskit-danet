import { Controller, Get, Param, Query } from 'danet/mod.ts';
import { ReturnedType, Tag } from 'danet_swagger/decorators.ts';
import { UserService } from './service.ts';
import { PublicUserInformation } from './class.ts';

@Controller('user')
export class UserController {
  constructor(public userService: UserService) {
  }

  @Tag('user')
  @ReturnedType(PublicUserInformation)
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.getUserPublicInformation(userId);
  }

  @Tag('user')
  @ReturnedType(PublicUserInformation, true)
  @Get()
  async getUsers(@Query('id', { value: 'array' }) ids: string[]) {
    return this.userService.getMultipleUserPublicInformation(ids);
  }
}
