import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Post('sendMessage')
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    const id= req.user.id
    return this.messagesService.create(id,createMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get('viewMessage')
  findAll(@Request() req) {
    const id = req.user.id
    return this.messagesService.findOwnMesage(id);
  }

}
