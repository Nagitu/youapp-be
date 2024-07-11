import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Message>;

@Schema()
export class Message  {
  @Prop({ type: String, default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true})
  senderId: string;

  @Prop({ required: true})
  message: string;

  @Prop({ required: true })
  receiverId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
