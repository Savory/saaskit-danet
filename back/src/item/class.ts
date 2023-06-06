import { IsString, IsUrl } from "danet/validation.ts";
import { ApiProperty } from "danet_swagger/decorators.ts";

export class Item {
  @ApiProperty({ example: "75442486-0878-440c-9db1-a7006c25a39f" })
  readonly _id = crypto.randomUUID();

  @ApiProperty({ example: "Danet is out !" })
  public title: string;

  @ApiProperty({ example: "https://docs.danet.land" })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty({ example: 99 })
  score: number;
  @ApiProperty({ example: true })
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
