import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaService } from 'src/core/entity/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService, JwtService],
})
export class MessageModule {}
