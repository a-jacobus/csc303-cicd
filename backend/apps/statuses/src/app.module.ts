import { Module } from '@nestjs/common';
import { StatusesModule } from './statuses/statuses.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.MODE}`,
        `.env.${process.env.MODE}`,
        '.env.local',
        '.env',
      ],
    }),
    DatabaseModule,
    StatusesModule,
    ReactionsModule,
  ],
})
export class AppModule {}
