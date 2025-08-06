import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@ApiTags('expenses')
@ApiBearerAuth('jwt')
@Controller('expenses')
@UseGuards(AuthGuard('jwt')) // Kullanıcı doğrulaması için
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni harcama oluştur' })
  @ApiResponse({ status: 201, description: 'Harcama başarıyla oluşturuldu.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async create(@Request() req, @Body() body: CreateExpenseDto) {
    const userId = req.user.userId;
    return this.expensesService.create(userId, body.amount, body.category, body.description ?? '', new Date(body.date));
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının tüm harcamalarını getir' })
  @ApiResponse({ status: 200, description: 'Harcamalar başarıyla getirildi.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async findAll(@Request() req) {
    console.log('Request user object:', req.user);
    const userId = req.user.userId;
    console.log('Controller - userId:', userId);
    return this.expensesService.findAllByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Harcama güncelle' })
  @ApiResponse({ status: 200, description: 'Harcama başarıyla güncellendi.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Harcama bulunamadı' })
  async update(@Param('id') id: string, @Body() updateData: UpdateExpenseDto) {
    const parsedData = {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined
    };
    return this.expensesService.update(id, parsedData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Harcama sil' })
  @ApiResponse({ status: 200, description: 'Harcama başarıyla silindi.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Harcama bulunamadı' })
  async delete(@Param('id') id: string) {
    return this.expensesService.delete(id);
  }
}
