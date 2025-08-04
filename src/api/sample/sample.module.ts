import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { PrismaService } from 'src/core/entity/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SampleController],
  providers: [SampleService, PrismaService, JwtService],
})
export class SampleModule {}
