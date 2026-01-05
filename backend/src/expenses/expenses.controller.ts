import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Body, 
  Param,
  UseGuards, 
  Req 
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // 1. AI Advice ලබාගන්නා Route එක (මේක අනිවාර්යයෙන්ම අනිත් Get වලට උඩින් තියෙන්න ඕනේ)
  @Get('advice')
  async getAdvice(@Req() req: any) {
    const userId = req.user.userId;
    // 1. මේ User ගේ දත්ත ටික ගන්නවා
    const expenses = await this.expensesService.findAll(userId);
    // 2. ඒ දත්ත ටික Service එකට යවලා AI Advice එක ගන්නවා
    return this.expensesService.getFinancialAdvice(expenses);
  }

  @Post()
  async create(@Body() dto: CreateExpenseDto, @Req() req: any) {
    const userId = req.user.userId; 
    return this.expensesService.create(dto, userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.expensesService.findAll(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.expensesService.remove(id, userId);
  }
}