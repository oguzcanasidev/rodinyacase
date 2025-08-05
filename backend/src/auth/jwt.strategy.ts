import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService, // UsersService'i ekliyoruz
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // DB'den kullanıcıyı çek
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // Token versiyonunu kontrol et
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token geçersiz veya yenilenmiş');
    }

    return { userId: payload.sub, email: payload.email, tokenVersion: payload.tokenVersion };
  }
}
