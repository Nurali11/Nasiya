import { Module } from '@nestjs/common';
import { MulterService } from './multer.service';
import { MulterController } from './multer.controller';

@Module({
  providers: [MulterService],
  controllers: [MulterController],
})
export class MulterModule {}
