import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../db/schema/user.schema';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from 'src/db/schema/profile.schema';
import { Like } from 'src/db/schema/like.schema';
import { ChatRoom } from 'src/db/schema/chatroom.schema';


@Injectable()
export class UsersService {

  constructor(
  @InjectModel(ChatRoom.name) private chatroomModel: Model<ChatRoom>,
  @InjectModel(Like.name) private likeModel: Model<Like>,
  @InjectModel(User.name) private userModel: Model<User>,
  @InjectModel(Profile.name) private profileModel: Model<Profile>,
) {}
  

async create(createUserDto: CreateUserDto): Promise<User> {
  const { username, email, password} = createUserDto;
  const isUsernameExist = await this.userModel.findOne({username})
  const isEmailExist = await this.userModel.findOne({email})
  if(isUsernameExist ){
    throw new ConflictException('this email has been registered')
  }else if(isEmailExist){
    throw new ConflictException('this email has been registered')
  }
  const createdUser = new this.userModel({ username, email, password });
  const savedUser = await createdUser.save();
  return savedUser;
}

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('profile').exec();
  }
  async likeUser(userId1: string, userId2: string) {
    // Validasi UUID menggunakan regex (versi sederhana)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId1) || !uuidRegex.test(userId2)) {
      throw new BadRequestException('Invalid user IDs');
    }

    // Simpan suka
    const newLike = new this.likeModel({ user1: userId1, user2: userId2, operation: 'like' });
    await newLike.save();

    // Periksa apakah pengguna lain juga menyukai pengguna ini
    const mutualLike = await this.likeModel.findOne({ user1: userId2, user2: userId1, operation: 'like' });
    if (mutualLike) {
      // Jika saling suka, buat chatroom
      const userIds = [userId1, userId2];
      const newChatRoom = new this.chatroomModel({ userIds });
      await newChatRoom.save();
      return newChatRoom;
    }

    return null;
  }



  async findOne(username : string): Promise<User>{
    return await this.userModel.findOne({ username }).exec();
  }

  async findById(id : string): Promise<User>{
    return await this.userModel.findOne({ id }).exec();
  }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ id }).exec();
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, updateUserDto);
    return existingUser.save();
  
  }

  async remove(id: string) {
    return await this.userModel.findOneAndDelete({ id })
  }
}
