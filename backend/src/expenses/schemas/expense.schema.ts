import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'Uncategorized' })
  category: string;

  // අනිවාර්යයෙන්ම මේ පේළිය එකතු කරන්න:
  @Prop({ required: true })
  user: string; 
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);