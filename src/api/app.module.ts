import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../common/mail/mail.module';
import { AuthModule } from './admin/auth.module';
import { SellerModule } from './seller/seller.module';
import { DebtModule } from './debt/debt.module';
import { join } from 'path';
import { config } from 'src/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SampleModule } from './sample/sample.module';
import { PaymentsModule } from './payments/payments.module';
import { DebtorModule } from './debtor/debtor.module';
import { MessageModule } from './messages/message.module';
import { MulterModule } from './multer/multer.module';

@Module({
  imports: [
    MulterModule,
    AuthModule,
    SellerModule,
    DebtorModule,
    DebtModule,
    SampleModule,
    MessageModule,
    PaymentsModule,
    MailModule,
    JwtModule.register({
          secret: config.JWT_ACCESS_KEY, 
          signOptions: { expiresIn: '7d' },
    }),
    ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', '..', 'uploads'),
    serveRoot: '/uploads',
    }),
  ]
})
export class AppModule {}
