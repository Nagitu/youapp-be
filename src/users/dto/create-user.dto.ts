import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {

    @ApiProperty({ example: 'suika' })
    username:string

    @ApiProperty({ example: 'suika@test.com' })
    email:string

    @ApiProperty({ example: 'password' })
    password:string
}
