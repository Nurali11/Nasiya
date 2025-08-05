import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT_ACCESS_KEY,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [JwtModule],
})
export class SharedJwtModule {}
