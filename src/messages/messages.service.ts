import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/db/schema/message.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { RabbitMQService } from 'src/utils/rabbitmq.service';
import { ChatRoom } from 'src/db/schema/chatroom.schema';

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private MessageModel: Model<Message>,
    private usersService: UsersService,
    private rabbitMQService: RabbitMQService 
  ) {}
  
  
  async create(id:string,createMessageDto: CreateMessageDto) {
    const {message,chatRoomId} = createMessageDto

    const newMessage = new this.MessageModel({
      senderId: id || '',
      message: message || null,
      chatRoom: chatRoomId, 
      // receiverId:receiverId|| '',
    });
    const sendMessage = await newMessage.save();
    const notification = {
      event: 'message_created',
      data: sendMessage,
    };
    await this.rabbitMQService.sendMessage(JSON.stringify(notification));

    return sendMessage;
   }

 async findOwnMesage(id: string) {

  const room = await this.chatRoomModel.find({userIds : id})
  if(!room){
    throw new NotFoundException('room not found')
  }
  const chatRoomIds = room.map(chatRoom => chatRoom.id);
    const messages = await this.MessageModel.find({chatRoom : chatRoomIds});

    if (messages.length === 0) {
      throw new NotFoundException('Messages not found');
    }

    return {room,messages};
  }
  
}
