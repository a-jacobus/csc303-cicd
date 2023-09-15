import { DynamicModule, Module } from '@nestjs/common';
import {
  DEFAULT_CONNECTION_NAME,
  TypeDormModuleAsyncOptions,
  TypeDormModuleOptions,
} from './typedorm.types';
import { TypeDormCoreModule } from './typedorm-core.module';
import { EntityTarget } from '@typedorm/common';
import { Connection, ConnectionOptions } from '@typedorm/core';
import { createTypeDormProviders } from './typedorm.providers';

@Module({})
export class TypeDormModule {
  static forRoot(options: TypeDormModuleOptions): DynamicModule {
    return {
      module: TypeDormModule,
      imports: [TypeDormCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: EntityTarget<any>[],
    connection:
      | Connection
      | ConnectionOptions
      | string = DEFAULT_CONNECTION_NAME,
  ): DynamicModule {
    const providers = createTypeDormProviders(entities, connection);
    return {
      module: TypeDormModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(options: TypeDormModuleAsyncOptions): DynamicModule {
    return {
      module: TypeDormModule,
      imports: [TypeDormCoreModule.forRootAsync(options)],
    };
  }
}
