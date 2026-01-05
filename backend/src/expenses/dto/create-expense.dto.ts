import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional() // Category එක අපි AI එකෙන් හදන නිසා මේක Optional දාන්න පුළුවන්
  category?: string;
}