import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  TYPEDORM_MODULE_OPTIONS,
  TypeDormModuleOptions,
  TypeDormConnectionFactory,
  TypeDormModuleAsyncOptions,
  TypeDormOptionsFactory,
} from './typedorm.types';
import { getConnectionToken, getEntityManagerToken } from './typedorm.utils';
import {
  Connection,
  ConnectionOptions,
  createConnection,
} from '@typedorm/core';

@Module({})
export class TypeDormCoreModule {
  static forRoot(options: TypeDormModuleOptions = {}): DynamicModule {
    const typeDormModuleOptions = {
      provide: TYPEDORM_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider: Provider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async () => await this.createConnectionFactory(options),
    };

    const entityManagerProvider = this.createEntityManagerProvider(
      options as ConnectionOptions,
    );

    const providers = [
      connectionProvider,
      entityManagerProvider,
      typeDormModuleOptions,
    ];

    const exports = [connectionProvider, entityManagerProvider];

    return {
      global: true,
      module: TypeDormCoreModule,
      providers,
      exports,
    };
  }

  static forRootAsync(options: TypeDormModuleAsyncOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(options as ConnectionOptions),
      useFactory: async (typeDormOptions: TypeDormModuleOptions) => {
        if (options.name) {
          return await this.createConnectionFactory(
            {
              ...typeDormOptions,
              name: options.name,
            },
            options.connectionFactory,
          );
        }
        return await this.createConnectionFactory(
          typeDormOptions,
          options.connectionFactory,
        );
      },
      inject: [TYPEDORM_MODULE_OPTIONS],
    };
    const entityManagerProvider = {
      provide: getEntityManagerToken(options as ConnectionOptions) as string,
      useFactory: (connection: Connection) => connection.entityManager,
      inject: [getConnectionToken(options as ConnectionOptions)],
    };

    const asyncProviders = this.createAsyncProviders(options);
    const providers = [
      ...asyncProviders,
      connectionProvider,
      entityManagerProvider,
    ];
    const exports = [connectionProvider, entityManagerProvider];

    return {
      global: true,
      module: TypeDormCoreModule,
      imports: options.imports,
      providers,
      exports,
    };
  }

  private static createAsyncProviders(
    options: TypeDormModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TypeDormOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TypeDormModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEDORM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<TypeDormOptionsFactory>,
    ];
    return {
      provide: TYPEDORM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TypeDormOptionsFactory) =>
        await optionsFactory.createTypeDormOptions(options.name),
      inject,
    };
  }

  private static createEntityManagerProvider(
    options: ConnectionOptions,
  ): Provider {
    return {
      provide: getEntityManagerToken(options) as string,
      useFactory: (connection: Connection) => connection.entityManager,
      inject: [getConnectionToken(options)],
    };
  }

  private static async createConnectionFactory(
    options: TypeDormModuleOptions,
    connectionFactory?: TypeDormConnectionFactory,
  ): Promise<Connection> {
    const createTypeDormConnection =
      connectionFactory ??
      ((options: ConnectionOptions) => {
        return createConnection(options);
      });
    const dataSource = await createTypeDormConnection(
      options as ConnectionOptions,
    );
    return dataSource;
  }
}
