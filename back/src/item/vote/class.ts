import { ApiProperty } from "danet_swagger/decorators.ts";

export class Vote {
  @ApiProperty()
  readonly _id: string = crypto.randomUUID();
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  userId: string;

  @ApiProperty()
  itemId: string;

  constructor(
    itemId: string,
    userId: string,
    createdAt: Date = new Date(),
  ) {
    this.itemId = itemId;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}
