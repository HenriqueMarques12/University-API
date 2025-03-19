import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UniversityDocument = University & Document;

@Schema({ timestamps: true })
export class University {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  alpha_two_code: string;

  @Prop({ type: [String], required: true })
  domains: string[];

  @Prop({ type: [String], required: true })
  web_pages: string[];

  @Prop()
  state_province?: string;

  @Prop({ default: 0 })
  lastQuoteValue: number;

  @Prop({ default: Date.now })
  lastQuoteUpdate: Date;
}

export const UniversitySchema = SchemaFactory.createForClass(University);

UniversitySchema.index({ name: 'text' });
UniversitySchema.index({ country: 1 });
