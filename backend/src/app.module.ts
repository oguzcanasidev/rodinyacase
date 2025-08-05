import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb+srv://xxx:xxx@xxx.xxx.mongodb.net/xxx'
    ),
    UsersModule,
    AuthModule, // MongoDB bağlantı URI
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
