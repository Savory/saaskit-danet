import { IsString, IsUrl } from "danet/validation.ts";

export class Item {
  readonly _id = crypto.randomUUID();
  @IsString()
  public title: string;

  @IsString()
  @IsUrl()
  url: string;

  userId: string;
  createdAt: Date;
  score: number;

  constructor(title: string, url: string, userId: string) {
    this.title = title;
    this.url = url;
    this.userId = userId;
    this.createdAt = new Date();
    this.score = 0;
  }
}
