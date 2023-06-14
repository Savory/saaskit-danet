import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuard,
} from "danet/mod.ts";
import { CreateItemDTO, Item } from "./class.ts";
import { Comment, CreateCommentDTO } from "./comment/class.ts";
import { ItemService } from "./service.ts";
import { ReturnedType, Tag } from "danet_swagger/decorators.ts";
import { UserConnected, UserMayBeConnected } from "../auth/guard.ts";

@Controller("item")
export class ItemController {
  constructor(public itemService: ItemService) {
  }

  @Tag("item")
  @ReturnedType(Item, true)
  @UseGuard(UserMayBeConnected)
  @Get()
  async getAllItem() {
    console.log("get all items");
    return this.itemService.getAll();
  }

  @Tag("item")
  @ReturnedType(Item)
  @UseGuard(UserMayBeConnected)
  @Get(":id")
  async getItemById(@Param("id") itemId: string) {
    return this.itemService.getById(itemId);
  }

  @Tag("item")
  @UseGuard(UserConnected)
  @Post()
  async createItem(@Body() item: CreateItemDTO) {
    return this.itemService.create(item);
  }

  @Tag("item")
  @Put(":id")
  async updateItem(@Param("id") itemId: string, @Body() item: Item) {
    return this.itemService.update(itemId, item);
  }

  @Tag("item")
  @Delete(":id")
  async deleteItemById(@Param("id") itemId: string) {
    return this.itemService.deleteOneById(itemId);
  }

  @Tag("comment")
  @UseGuard(UserConnected)
  @Post(":id/comment")
  async addComment(
    @Param("id") itemId: string,
    @Body() comment: CreateCommentDTO,
  ) {
    return this.itemService.addComment(itemId, comment);
  }

  @Tag("comment")
  @ReturnedType(Comment, true)
  @Get(":id/comment")
  async getComments(@Param("id") itemId: string) {
    return this.itemService.getComments(itemId);
  }

  @Tag("upvote")
  @UseGuard(UserConnected)
  @Post(":id/upvote")
  async upvote(@Param("id") itemId: string) {
    return this.itemService.upvote(itemId);
  }

  @Tag("upvote")
  @UseGuard(UserConnected)
  @Delete(":id/upvote")
  async removeUpvote(@Param("id") itemId: string) {
    return this.itemService.removeUpvote(itemId);
  }
}
