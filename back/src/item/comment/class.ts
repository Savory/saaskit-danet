import { ApiProperty } from 'danet_swagger/decorators.ts';
import { IsString } from 'validatte/mod.ts';

export class Comment {
  @ApiProperty({ example: '75442486-0878-440c-9db1-a7006c25a39f' })
  readonly _id: string = crypto.randomUUID();
  @ApiProperty()
  createdAt: Date;
  @ApiProperty({ example: '75442486-0878-440c-9db1-a7006c25a39f' })
  userId: string;
  @ApiProperty({ example: '75442486-0878-440c-9db1-a7006c25a39f' })
  itemId: string;
  @ApiProperty({ example: 'Danet is awesome omg xoxo /s' })
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

export class CreateCommentDTO implements Omit<Comment, '_id' | 'createdAt'> {
  @ApiProperty({ example: 'Yeah sure...' })
  @IsString()
  text!: string;
  userId!: string;
  itemId!: string;
}
