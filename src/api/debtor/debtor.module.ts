import { Module } from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { DebtorController } from './debtor.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/entity/prisma.service';

@Module({
  controllers: [DebtorController],
  providers: [DebtorService, PrismaService, JwtService],
})
export class DebtorModule { }
