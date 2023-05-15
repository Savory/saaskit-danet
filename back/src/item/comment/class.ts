import { IsString } from "https://deno.land/x/validatte@0.7.1/mod.ts";

export class Comment {
  readonly _id = crypto.randomUUID();
  createdAt: Date;
  userId: string;
  itemId: string;
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
