import { ApiProperty } from "@nestjs/swagger"

export class CreateProfileDto {

      @ApiProperty({ example: '676945cb-f137-4317-bb18-279f0bc4a4a6' })
      user_id: string
      @ApiProperty({ example: '2020-02-12' })
      birthday : Date
      @ApiProperty({ example: 'male' })
      gender :string
      @ApiProperty({ example: 'sagitarius' })
      zodiac :string
      @ApiProperty({ example: '60' })
      weight :string
      @ApiProperty({ example: 'this about a user' })
      about  : string
      @ApiProperty({ example: '180' })
      height :string
}
