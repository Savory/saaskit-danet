import { ApiProperty } from "https://deno.land/x/danet_swagger@1.6.1/decorators.ts";
import { IsString } from "https://deno.land/x/validatte@0.7.1/mod.ts";

export class Comment {
  @ApiProperty()
  readonly _id: string = crypto.randomUUID();
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  itemId: string;
  @ApiProperty()
  text: string;

  constructor(
    text: string,
    itemId: string,
    userId: string,
    createdAt: Date = new Date(),
  ) {
    this.text = text;
    this.itemId = itemId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}

export class CreateCommentDTO implements Omit<Comment, "_id" | "createdAt"> {
  @IsString()
  text!: string;
  userId!: string;
  itemId!: string;
}
