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

  async getTokens(userId: string, email: string, tokenVersion: number) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
  
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, tokenVersion },
        { secret: jwtSecret, expiresIn: '2h' }, // Access token 2 saat
      ),
      this.jwtService.signAsync(
        { sub: userId, email, tokenVersion },
        { secret: jwtRefreshSecret, expiresIn: '7d' }, // Refresh token 7 gün
      ),
    ]);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: any) {
    // ✅ tokenVersion'u artır
    const updatedUser = await this.usersService.findByIdAndUpdate(user._id.toString(), {
      tokenVersion: (user.tokenVersion || 0) + 1,
    });
  
    if (!updatedUser) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
  
    // ✅ Yeni tokenları üret
    const tokens = await this.getTokens(
      updatedUser._id.toString(),
      updatedUser.email,
      updatedUser.tokenVersion,
    );
  
    // ✅ Refresh token hashlenip kaydedilir
    await this.updateRefreshToken(updatedUser._id.toString(), tokens.refresh_token);
  
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
    return { message: 'Kullanıcı başarıyla oluşturuldu.' };
    //return this.login(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.findByIdAndUpdate(userId, {
      refreshToken: refreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya refresh token yok.');
    }
  

    const isMatch = refreshToken === user.refreshToken;
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token eşleşmiyor.');
    }
    console.log("Is match");
    console.log(isMatch);
  
    // ✅ tokenVersion'u artır
    const updatedUser = await this.usersService.findByIdAndUpdate(user._id.toString(), {
      tokenVersion: (user.tokenVersion || 0) + 1,
    });
  
    if (!updatedUser) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
  
    // ✅ Yeni tokenlar üret
    const tokens = await this.getTokens(
      updatedUser._id.toString(),
      updatedUser.email,
      updatedUser.tokenVersion,
    );
  
    // ✅ Refresh token'ı hashleyip güncelle
    await this.updateRefreshToken(updatedUser._id.toString(), tokens.refresh_token);
  
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Başarıyla çıkış yapıldı.' };
  }
}
