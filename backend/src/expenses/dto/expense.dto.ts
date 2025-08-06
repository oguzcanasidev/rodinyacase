import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 100, description: 'Harcama miktarı' })
  amount: number;

  @ApiProperty({ example: 'Yiyecek', description: 'Harcama kategorisi' })
  category: string;

  @ApiProperty({ example: 'Öğle yemeği', description: 'Harcama açıklaması', required: false })
  description?: string;

  @ApiProperty({ example: '2024-03-14T12:00:00Z', description: 'Harcama tarihi' })
  date: string;
}

export class UpdateExpenseDto {
  @ApiProperty({ example: 100, description: 'Harcama miktarı', required: false })
  amount?: number;

  @ApiProperty({ example: 'Yiyecek', description: 'Harcama kategorisi', required: false })
  category?: string;

  @ApiProperty({ example: 'Öğle yemeği', description: 'Harcama açıklaması', required: false })
  description?: string;

  @ApiProperty({ example: '2024-03-14T12:00:00Z', description: 'Harcama tarihi', required: false })
  date?: string;
}