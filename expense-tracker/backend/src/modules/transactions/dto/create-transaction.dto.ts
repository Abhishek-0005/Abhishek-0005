import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsDateString()
  date!: string; // ISO date string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @IsInt()
  @IsPositive()
  categoryId!: number;
}
