import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { ChatRoom } from './chatroom.schema';
import { User } from './user.schema';
export type UserDocument = HydratedDocument<Message>;

@Schema()
export class Message  {
  @Prop({ type: String, default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true,type: String, ref: 'User',})
  senderId: string;

  @Prop({required: true, type: String, ref: 'ChatRoom',})
  chatRoom: ChatRoom;

  @Prop({ required: true})
  message: string;

  // @Prop({ required: true,type: String, ref: 'User', })
  // receiverId: string;
  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({})
  messages : any[]
}

export const MessageSchema = SchemaFactory.createForClass(Message);
