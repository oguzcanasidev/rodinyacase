import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcının email adresi' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Kullanıcının şifresi' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kullanıcının email adresi' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Kullanıcının şifresi' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: '64a8f...', description: 'Kullanıcı ID\'si' })
  userId: string;

  @ApiProperty({ example: 'refreshTokenValue', description: 'Refresh Token değeri' })
  refreshToken: string;
}