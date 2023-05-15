import { IsString, IsUrl } from "danet/validation.ts";
import { ApiProperty } from "https://deno.land/x/danet_swagger@1.6.1/decorators.ts";

export class Item {
  @ApiProperty()
  readonly _id = crypto.randomUUID();
  @IsString()
  public title: string;

  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  score: number;

  constructor(
    title: string,
    url: string,
    userId: string,
    createdAt: Date = new Date(),
  ) {
    this.title = title;
    this.url = url;
    this.userId = userId;
    this.createdAt = createdAt;
    this.score = 0;
  }
}
