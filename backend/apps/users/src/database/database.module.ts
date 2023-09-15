import { TypeDormModule } from '@app/typedorm';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { Table, INDEX_TYPE } from '@typedorm/common';
import { DocumentClientV3 } from '@typedorm/document-client';
import databaseConfig from './database.config';

@Module({
  imports: [
    TypeDormModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory(dbConfig: ConfigType<typeof databaseConfig>) {
        const table = new Table({
          name: dbConfig.table,
          partitionKey: 'PK',
          sortKey: 'SK',
          indexes: {
            GSI1: {
              type: INDEX_TYPE.GSI,
              partitionKey: 'GSI1PK',
              sortKey: 'GSI1SK',
            },
          },
        });

        const documentClient = new DocumentClientV3(
          new DynamoDBClient({
            region: dbConfig.region,
          }),
        );
        return {
          table,
          entities: [],
          documentClient,
        };
      },
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
