import { ApiProperty } from "danet_swagger/decorators.ts";

export class User {
  @ApiProperty()
  readonly _id = crypto.randomUUID();

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
  @ApiProperty()
  avatarUrl?: string;
  @ApiProperty()
  isSubscribed?: boolean;

  constructor(email: string, username: string) {
    this.email = email;
    this.username = username;
  }
}
