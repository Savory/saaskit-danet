import { IsString, IsUrl } from "danet/validation.ts";
import { ApiProperty } from "https://deno.land/x/danet_swagger@1.6.1/decorators.ts";

export class Item {
  @ApiProperty()
  readonly _id = crypto.randomUUID();

  @ApiProperty()
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
  @ApiProperty()
  userHasVoted?: boolean;

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

export class CreateItemDTO implements Pick<Item, "title" | "url"> {
  @IsString()
  public title!: string;

  @IsUrl()
  url!: string;
}

export class UpvoteCount {
  @ApiProperty()
  count!: number;
  @ApiProperty()
  userHasVoted!: boolean;
}
