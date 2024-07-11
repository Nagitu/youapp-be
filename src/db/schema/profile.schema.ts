import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  HydratedDocument } from "mongoose";

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
    @Prop({ type: String, ref: 'User', required: true })
    user_id: string;

    @Prop()
    birthday: Date;
  
    @Prop()
    zodiac: string;

    @Prop()
    gender: string;

    @Prop()
    height: number;

    @Prop()
    weight: number;

    @Prop()
    about:string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)