import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email ve şifre alanları zorunludur.');
    }

    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObject = user.toObject();
      const { password, ...result } = userObject;
      return result;
    }
    return null;
  }

  async getTokens(userId: string, email: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtSecret, expiresIn: '2h' }, // Access token 2 saat
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: jwtRefreshSecret, expiresIn: '7d' }, // Refresh token 7 gün
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: any) {
    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    return tokens;
  }

  async register(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email ve şifre alanları zorunludur.');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email adresi zaten kullanılıyor.');
    }

    const user = await this.usersService.create(email, password);
    return this.login(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10); // 10 = saltRounds
    await this.usersService.findByIdAndUpdate(userId, {
      refreshToken: hashedToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya refresh token yok.');
    }
  
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token eşleşmiyor.');
    }
  
    const userObj = user.toObject();

    // Token geçerliyse yeni tokenlar üret
    const tokens = await this.getTokens(userObj._id.toString(), userObj.email);
  
    // Yeni refresh token'ı hash'leyip güncelle
    await this.updateRefreshToken(userObj._id.toString(), tokens.refresh_token);
  
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Başarıyla çıkış yapıldı.' };
  }
}
