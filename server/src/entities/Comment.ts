import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

//m to n
// many to many
// user <-> posts
@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: "text" })
  text: string;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
 
  @Field()
  @PrimaryColumn()
  postId: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.comments )
  post: Post;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
