export class User {
  readonly _id = crypto.randomUUID();
  email: string;

  username: string;
  avatarUrl?: string;
  isSubscribed?: boolean;

  constructor(email: string, username: string) {
    this.email = email;
    this.username = username;
  }
}
