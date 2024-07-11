import { ApiProperty } from "@nestjs/swagger"

export class CreateMessageDto {

    @ApiProperty({ example: '676945cb-f137-4317-bb18-279f0bc4a4a6' })
    senderId: string
    @ApiProperty({ example: '32adcdaf-2db8-4a72-b047-2e7c6004dd2c' })
    chatRoomId: string
    @ApiProperty({ example: 'ini pesan pertama' })
    message : string
}
