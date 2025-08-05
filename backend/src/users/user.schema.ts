import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // createdAt ve updatedAt otomatik eklenir
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, required: false, default: null })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
