import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule as MongooseFeatureModule } from '@nestjs/mongoose';
import { ExpensesController } from './expenses/expenses.controller';
import { ExpensesService } from './expenses/expenses.service';
import { Expense, ExpenseSchema } from './expenses/schemas/expense.schema';
import { GeminiService } from './gemini/gemini.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/smartspend'),
    MongooseFeatureModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    AuthModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService, GeminiService],
})
export class AppModule {}