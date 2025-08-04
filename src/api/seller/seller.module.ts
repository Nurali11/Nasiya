import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/common/mail/mail.module';
import { PrismaModule } from 'src/core/entity/prisma.module';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/core/entity/prisma.service';

@Module({
  controllers: [SellerController],
  providers: [SellerService, MailService, PrismaService, JwtService],
})
export class SellerModule { }
