import { ApiProperty } from 'danet_swagger/decorators.ts';

export class User {
  @ApiProperty({ example: '75442486-0878-440c-9db1-a7006c25a39f' })
  readonly _id: string = crypto.randomUUID();

  @ApiProperty({ example: 'my email' })
  email: string;

  @ApiProperty({ example: 'sorikairox' })
  username: string;
  @ApiProperty({ example: 'http://placekitten.com/200/300' })
  avatarUrl?: string;
  @ApiProperty()
  isSubscribed?: boolean;

  password?: string;

  constructor(email: string, username: string, password?: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}

export class PublicUserInformation
  implements Pick<User, 'username' | 'avatarUrl' | '_id'> {
  @ApiProperty({ example: '75442486-0878-440c-9db1-a7006c25a39f' })
  _id!: string;
  @ApiProperty({ example: 'sorikairox' })
  username!: string;
  @ApiProperty({ example: 'http://placekitten.com/200/300' })
  avatarUrl?: string;
}
