import { IsString } from "danet/validation.ts";

export class UpdateAccountDTO {
  @IsString()
  username?: string;
}
