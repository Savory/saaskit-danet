import { IsEmail, IsString } from 'danet/validation.ts';
export type Oauth2Provider = 'google' | 'discord' | 'local';

export class UpdateAccountDTO {
  @IsString()
  username?: string;
}

export class Credentials {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class CreateUser {
  @IsString()
  @IsEmail()
  email!: string;
  @IsString()
  username!: string;
  provider?: Oauth2Provider;

  @IsString()
  password?: string;
}
