import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user', // must match "package" in proto file
      protoPath: join(__dirname, '../proto/user.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT ?? 50051}`,
    },
  });

  await app.listen();
  console.log(`🚀 gRPC service running at 0.0.0.0:${process.env.GRPC_PORT ?? 50051}`);
}
bootstrap();
