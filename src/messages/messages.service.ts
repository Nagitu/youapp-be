import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/db/schema/message.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { RabbitMQService } from 'src/utils/rabbitmq.service';

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(Message.name) private MessageModel: Model<Message>,
    private usersService: UsersService,
    private rabbitMQService: RabbitMQService 
  ) {}
  
  
  async create(id:string,createMessageDto: CreateMessageDto) {
    const {message,receiverId} = createMessageDto

    const newMessage = new this.MessageModel({
      senderId: id || '',
      message: message || null, 
      receiverId:receiverId|| '',
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
    const messages = await this.MessageModel.find({
      $or: [
        { senderId: id },
        { receiverId: id }
      ]
    }).exec();

    if (messages.length === 0) {
      throw new NotFoundException('Messages not found');
    }

    return messages;
  }
  
}
