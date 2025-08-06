import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth('jwt')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı oluştur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla kaydedildi.' })
  @ApiResponse({ status: 400, description: 'Geçersiz kayıt bilgileri.' })
  @ApiResponse({ status: 409, description: 'Bu email adresi zaten kullanımda.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Kullanıcı girişi yap' })
  @ApiResponse({ status: 200, description: 'Giriş başarılı.', schema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string', description: 'JWT access token' },
      refreshToken: { type: 'string', description: 'JWT refresh token' }
    }
  }})
  @ApiResponse({ status: 401, description: 'Hatalı kullanıcı adı veya şifre.' })
  async login(@Body() loginDto: LoginDto) {
    // auth service gönderip validateUser ile kontrol ediyoruz
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Hatalı kullanıcı adı veya şifre.');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  @ApiOperation({ summary: 'Kullanıcı profilini getir' })
  @ApiResponse({ status: 200, description: 'Profil bilgileri başarıyla getirildi.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim.' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Access token yenile' })
  @ApiResponse({ status: 200, description: 'Token başarıyla yenilendi.', schema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string', description: 'Yeni JWT access token' },
      refreshToken: { type: 'string', description: 'Yeni JWT refresh token' }
    }
  }})
  @ApiResponse({ status: 401, description: 'Geçersiz refresh token.' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.userId, refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ summary: 'Kullanıcı çıkışı yap' })
  @ApiResponse({ status: 200, description: 'Başarıyla çıkış yapıldı.' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim.' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}
