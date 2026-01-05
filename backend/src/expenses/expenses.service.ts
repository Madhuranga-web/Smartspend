import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private geminiService: GeminiService,
  ) {}

  // 1. වියදමක් ඇතුළත් කිරීම (AI Category එකත් එක්ක)
  async create(dto: CreateExpenseDto, userId: string) {
    const category = await this.geminiService.getCategory(dto.description);
    const newExpense = new this.expenseModel({ 
      ...dto, 
      category, 
      user: userId 
    });
    return newExpense.save();
  }

  
  async findAll(userId: string) {
    return this.expenseModel.find({ user: userId }).sort({ date: -1 }).exec();
  }


  async getFinancialAdvice(expenses: any[]) {
    if (!expenses || expenses.length === 0) {
      return "No expenses have been added yet. Add at least one expense to get advice.";
    }

    // වියදම් ටික string එකක් විදිහට සකසමු
    const summary = expenses
      .slice(0, 10) // අන්තිම වියදම් 10 විතරක් ගමු prompt එක ගොඩක් දිග නොවෙන්න
      .map(e => `${e.description}: Rs.${e.amount} (${e.category})`)
      .join(', ');

    const prompt = `The following are some of my recent expenses: ${summary}. 
    Please analyze these expense patterns and provide a short financial advice in Sinhala. 
    The response should be less than 30 words.`;

    // Gemini Service එක හරහා උපදෙස උත්පාදනය කරනවා
    return this.geminiService.generateAdvice(prompt);
  }

  // 4. වියදමක් මකා දැමීම (Security එකත් එක්ක)
  async remove(id: string, userId: string) {
    const result = await this.expenseModel.findOneAndDelete({ 
      _id: id, 
      user: userId 
    }).exec();

    if (!result) {
      throw new NotFoundException('Expense not found or you dont have permission to delete it');
    }

    return { message: 'Expense deleted successfully', deletedId: id };
  }
}