import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/entity/prisma.module';
import { PrismaService } from 'src/core/entity/prisma.service';

@Module({
  controllers: [DebtController],
  providers: [DebtService, PrismaService,JwtService],
})
export class DebtModule { }
