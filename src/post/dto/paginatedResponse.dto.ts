import { Post } from "src/entity/post.entity";

export class PaginatedResponse {
  public data!: Post[];
  public page!: number;
  public limit!: number;
  public total!: number;
  public totalPages!: number;
}
