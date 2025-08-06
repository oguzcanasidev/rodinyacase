import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from './expense.schema';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(userId: string, amount: number, category: string, description: string, date: Date): Promise<Expense> {
    const createdExpense = new this.expenseModel({
      userId: new Types.ObjectId(userId),
      amount,
      category,
      description,
      date,
    });
    return createdExpense.save();
  }

  async findAllByUser(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId: userId }).exec();
  }

  async findById(id: string): Promise<Expense | null> {
    return this.expenseModel.findById(id).exec();
  }
  
  async update(id: string, updateData: Partial<Expense>): Promise<Expense | null> {
    return this.expenseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  
  async delete(id: string): Promise<Expense | null> {
    return this.expenseModel.findByIdAndDelete(id).exec();
  }
}
