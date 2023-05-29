import { Body, Controller, Delete, Get, Param, Post, Put } from "danet/mod.ts";
import { CreateItemDTO, Item, UpvoteCount } from "./class.ts";
import { Comment, CreateCommentDTO } from "./comment/class.ts";
import { ItemService } from "./service.ts";
import { ReturnedType, Tag, TAGS_KEY } from "danet_swagger/decorators.ts";
import { ParameterDeclarationBase } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";

@Controller("item")
export class ItemController {
  constructor(public itemService: ItemService) {
  }

  @Tag("item")
  @ReturnedType(Item, true)
  @Get()
  async getAllItem() {
    return this.itemService.getAll();
  }

  @Tag("item")
  @ReturnedType(Item)
  @Get(":id")
  async getItemById(@Param("id") itemId: string) {
    return this.itemService.getById(itemId);
  }

  @Tag("item")
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
  @Post(":id/comment")
  async addComment(
    @Param("id") itemId: string,
    @Body() comment: CreateCommentDTO,
  ) {
    comment.userId = "toto";
    return this.itemService.addComment(itemId, comment);
  }

  @Tag("comment")
  @ReturnedType(Comment, true)
  @Get(":id/comment")
  async getComments(@Param("id") itemId: string) {
    return this.itemService.getComments(itemId);
  }

  @Tag("upvote")
  @ReturnedType(UpvoteCount, false)
  @Get(":id/upvote")
  async getUpvotes(@Param("id") itemId: string): Promise<UpvoteCount> {
    return this.itemService.getUpvoteCount(itemId);
  }

  @Tag("upvote")
  @Post(":id/upvote")
  async upvote(@Param("id") itemId: string) {
    return this.itemService.upvote(itemId);
  }

  @Tag("upvote")
  @Delete(":id/upvote")
  async removeUpvote(@Param("id") itemId: string) {
    return this.itemService.removeUpvote(itemId);
  }
}
