import { Injectable } from "danet/mod.ts";
import { MongodbRepository } from "../../database/repository.mongodb.ts";
import { Comment } from "./class.ts";
import { CommentRepository } from "./repository.ts";
import { MongodbService } from "../../database/mongodb.service.ts";

@Injectable()
export class MongodbCommentRepository extends MongodbRepository<Comment>
  implements CommentRepository {
  constructor(protected service: MongodbService) {
    super(service, "comments");
  }
  async getByItemId(itemId: string): Promise<Comment[]> {
    return this.getAll({ itemId });
  }
}
