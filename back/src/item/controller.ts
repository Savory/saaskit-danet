import { Body, Controller, Delete, Get, Param, Post, Put } from "danet/mod.ts";
import { Item } from "./class.ts";
import { Comment, CreateCommentDTO } from "./comment/class.ts";
import { ItemService } from "./service.ts";
import { ReturnedType } from "danet_swagger/decorators.ts";

@Controller("item")
export class ItemController {
  constructor(public itemService: ItemService) {
  }

  @ReturnedType(Item, true)
  @Get()
  async getAllItem() {
    return this.itemService.getAll();
  }

  @ReturnedType(Item)
  @Get(":id")
  async getItemById(@Param("id") itemId: string) {
    return this.itemService.getById(itemId);
  }

  @Post()
  async createItem(@Body() item: Item) {
    item.userId = "toto";
    return this.itemService.create(item);
  }

  @Put(":id")
  async updateItem(@Param("id") itemId: string, @Body() item: Item) {
    return this.itemService.update(itemId, item);
  }

  @Delete(":id")
  async deleteItemById(@Param("id") itemId: string) {
    return this.itemService.deleteOneById(itemId);
  }

  @Post(":id/add-comment")
  async addComment(
    @Param("id") itemId: string,
    @Body() comment: CreateCommentDTO,
  ) {
    comment.userId = "toto";
    return this.itemService.addComment(itemId, comment);
  }

  @Get(":id/comments")
  async getComments(@Param("id") itemId: string) {
    return this.itemService.getComments(itemId);
  }
}
