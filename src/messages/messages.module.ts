import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/db/schema/profile.schema';
import { Message, MessageSchema } from 'src/db/schema/message.schema';
import { UsersModule } from 'src/users/users.module';
import { RabbitMQService } from 'src/utils/rabbitmq.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService,RabbitMQService],
  imports:[UsersModule,MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema}]),MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema}]),  ]
})
export class MessagesModule {}
