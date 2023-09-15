import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
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
  ],
})
export class AppModule {}
