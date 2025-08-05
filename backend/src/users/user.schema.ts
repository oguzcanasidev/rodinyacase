import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

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

  @Prop({ type: Number, required: false, default: 0 })
  tokenVersion: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
