import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { getConnection } from "typeorm";
import { Comment } from "./../entities/Comment";
import { User } from "./../entities/User";
import { isAuth } from "./../middleware/isAuth";

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];
  @Field()
  hasMore: Boolean;
}

@InputType()
class CommentInput {
  @Field()
  text: string;

  @Field()
  postId: number;
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  user(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    console.log("FieldResolver for comment");
    return userLoader.load(comment.userId);
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("input") input: CommentInput,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    return Comment.create({
      ...input,
      userId: req.session.userId,
    }).save();
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("id", () => Int) id: number,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Comment | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ text })
      .where('id = :id and "userId" = :userId', {
        id,
        userId: req.session.userId,
      })
      .returning("*")
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Comment.delete({ id, userId: req.session.userId });
    return true;
  }

  @Query(() => PaginatedComments)
  async getCommentByPostId(
    @Arg("postId", () => Int) postId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedComments> {
    const realLimit = Math.min(20, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const comments = await getConnection().query(
      `
    select c.*
    from comment c
    ${cursor ? `where c."createdAt" < $2 ` : ""}
    where c."postId" = ${postId}
    order by c."createdAt" DESC
    limit $1
    `,
      replacements
    );
    return {
      comments: comments,
      hasMore: comments.length === realLimitPlusOne,
    };
  }
}
