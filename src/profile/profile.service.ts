import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/db/schema/profile.schema';
import { User } from 'src/db/schema/user.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { getZodiacSign } from 'src/utils/zodiac.utils';

@Injectable()
export class ProfileService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private usersService: UsersService,
  ) {}


  async create(user_id:string,createProfileDto: CreateProfileDto): Promise<Profile> {
    const {birthday, gender, weight, height ,about } = createProfileDto;
    const user = await this.profileModel.findOne({user_id});
    if(user){
      throw new ConflictException('this user already has a profile')
    }
    const zodiac = birthday ? getZodiacSign(new Date(birthday)) : '';
    const newProfile = new this.profileModel({
      user_id: user_id || '',
      birthday: birthday || null, 
      zodiac,
      gender: gender || '',
      weight: weight || '',
      height: height || '',
      about: about || '',
    });

    const savedProfile = await newProfile.save();

    await this.userModel.findOneAndUpdate({ id: user_id }, { profile: savedProfile._id });

    return savedProfile;
  }


  async findOne(user_id: string) {
    const profile = await this.profileModel.findOne({user_id})
    if(!profile){
      throw new NotFoundException(`this user don't have a profile , please setup first`)
    }
    return profile;
  }

  async update(user_id: string, updateProfileDto: UpdateProfileDto) {
    const existingUser = await this.profileModel.findOne({user_id});
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, updateProfileDto);
    return existingUser.save();
  }

  async remove(user_id: string) {
    const existingUser = await this.profileModel.findOne({user_id});
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
  return this.profileModel.deleteOne({user_id})
  }
}
