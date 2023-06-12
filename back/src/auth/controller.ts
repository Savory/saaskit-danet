import { Body, Controller, Get, Patch, Post, UseGuard } from 'danet/mod.ts';
import { ApiBearerAuth, ReturnedType, Tag } from 'danet_swagger/decorators.ts';
import { UserConnected } from './guard.ts';
import { ActualUserService } from './actual-user.service.ts';
import { User } from '../user/class.ts';
import { CreateUser, Credentials, UpdateAccountDTO } from './class.ts';
import { AuthService } from './service.ts';

@Tag('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private actualUserService: ActualUserService,
    private authService: AuthService,
  ) {
  }

  @ReturnedType(String)
  @Post('login')
  login(@Body() credentials: Credentials) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @ReturnedType(String)
  @Post('register')
  register(@Body() userData: CreateUser) {
    userData.provider = 'local';
    return this.authService.registerUser(userData);
  }

  @UseGuard(UserConnected)
  @ApiBearerAuth()
  @Get('me')
  @ReturnedType(User)
  getMyInfo() {
    return this.actualUserService.get();
  }

  @UseGuard(UserConnected)
  @ApiBearerAuth()
  @Patch('me')
  updateInfo(@Body() newAccountData: UpdateAccountDTO) {
    return this.actualUserService.updateInfo(newAccountData);
  }
}
