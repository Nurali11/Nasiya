import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export default class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
      .setTitle('Nasiya')
      .setDescription('Nasiya Shop')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.listen(process.env.PORT ?? 3000);
  }
}
