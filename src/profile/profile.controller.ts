import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto, @Request() req) {
    const id= req.user.id
    return this.profileService.create(id,createProfileDto);
  }

  @UseGuards(AuthGuard) 
  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Profile shows' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.profileService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Profile success updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() updateProfileDto: UpdateProfileDto , @Request() req) {

    const id= req.user.id
    
    return this.profileService.update(id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Profile deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
