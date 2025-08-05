import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/core/entity/prisma.service';
import { SharedJwtModule } from 'src/api/shared/jwt.module';

@Module({
  imports: [SharedJwtModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, PrismaService]
})
export class AuthModule { }
