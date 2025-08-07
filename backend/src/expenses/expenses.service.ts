import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from './expense.schema';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(userId: string, amount: number, category: string, description: string, date: Date): Promise<Expense> {
    console.log('Creating expense with userId:', userId);
    const userObjectId = new Types.ObjectId(userId);
    console.log('Converted userId to ObjectId:', userObjectId);
    
    const createdExpense = new this.expenseModel({
      userId: userObjectId,
      amount,
      category,
      description,
      date,
    });
    
    const savedExpense = await createdExpense.save();
    console.log('Saved expense:', savedExpense);
    return savedExpense;
  }

  async findAllByUser(userId: string): Promise<Expense[]> {
    const userObjectId = new Types.ObjectId(userId);
    
    const expenses = await this.expenseModel.find({ userId: userObjectId })
      .sort({ date: -1 }) // En yeni harcamalar önce gelsin
      .lean() // JSON'a dönüştürme performansı için
      .exec();

    return expenses;
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
