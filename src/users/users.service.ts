import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../db/schema/user.schema';
import { Model } from 'mongoose';
import { getZodiacSign } from 'src/utils/zodiac.utils';
import { Profile, ProfileDocument } from 'src/db/schema/profile.schema';


@Injectable()
export class UsersService {

  constructor(
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

  // const newProfile = new this.profileModel({
  //   user_id: savedUser.id,
  //   birthday : '',
  //   gender :'',
  //   zodiac :'',
  //   weight :'',
  //   height :'',
  // });

  // const savedProfile = await newProfile.save();

  // savedUser.profile = savedProfile;
  // await savedUser.save();

  return savedUser;
}

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('profile').exec();
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
