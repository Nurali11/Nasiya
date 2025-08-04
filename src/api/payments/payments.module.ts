import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/core/entity/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, JwtService],
})
export class PaymentsModule { }
