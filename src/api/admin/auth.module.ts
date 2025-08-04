import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/core/entity/prisma.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtService, MailService, PrismaService]
})
export class AuthModule { }
