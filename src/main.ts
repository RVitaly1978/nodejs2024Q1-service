import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT', 4000)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${PORT}`)
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('doc', app, document)

  await app.listen(PORT, () => {
    new Logger('SERVER').log(`Started on port ${PORT}`)
  })
}

bootstrap()
