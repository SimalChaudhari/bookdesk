import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

/**
 * Book entity - represents a book in the database
 * GraphQL ObjectType for queries and mutations
 */
@ObjectType()
@Entity()
export class Book {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;
}

/**
 * Input type for creating a new book
 */
@InputType()
export class CreateBookInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

/**
 * Input type for updating an existing book
 */
@InputType()
export class UpdateBookInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
