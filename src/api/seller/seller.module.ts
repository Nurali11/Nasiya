import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller'
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/core/entity/prisma.service';
import { SharedJwtModule } from '../shared/jwt.module';

@Module({
  imports: [SharedJwtModule],
  controllers: [SellerController],
  providers: [SellerService, MailService, PrismaService, MailService],
})
export class SellerModule { }
