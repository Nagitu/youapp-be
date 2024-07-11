import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: String, default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true,type: String, ref: 'User'})
  user1: string[]

  @Prop({ required: true,type: String, ref: 'User'})
  user2: string[]

  @Prop({ type: String, enum: ['like', 'not like'], required: true })
  operation: string;

  @Prop({ required: true,default: Date.now })
  createdAt : Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
