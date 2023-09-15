import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'node:fs';

process.env.MODE = process.env.MODE ?? 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  await app.listen(3000);
}
bootstrap().catch(() => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
