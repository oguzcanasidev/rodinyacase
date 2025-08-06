import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenses')
@UseGuards(AuthGuard('jwt')) // Kullanıcı doğrulaması için
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(@Request() req, @Body() body: { amount: number; category: string; description?: string; date: string }) {
    const userId = req.user.userId;
    return this.expensesService.create(userId, body.amount, body.category, body.description ?? '', new Date(body.date));
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userId;
    return this.expensesService.findAllByUser(userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<{ amount: number; category: string; description?: string; date: string | Date }>) {
    const parsedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined
    };
    return this.expensesService.update(id, parsedData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.expensesService.delete(id);
  }
}
