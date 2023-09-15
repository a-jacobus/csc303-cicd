import { ModuleMetadata, Type } from '@nestjs/common';
import { Connection, ConnectionOptions } from '@typedorm/core';

export const TYPEDORM_MODULE_ID = 'TypeDormModuleId';
export const TYPEDORM_MODULE_OPTIONS = 'TypeDormModuleOptions';
export const DEFAULT_CONNECTION_NAME = 'default';

export type TypeDormModuleOptions = Partial<ConnectionOptions>;
export type TypeDormConnectionFactory = (
  options?: ConnectionOptions,
) => Promise<Connection>;
export interface TypeDormOptionsFactory {
  createTypeDormOptions(
    connectionName?: string,
  ): Promise<TypeDormModuleOptions> | TypeDormModuleOptions;
}
export type TypeDormModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  name?: string;
  useExisting?: Type<TypeDormOptionsFactory>;
  useClass?: Type<TypeDormOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<TypeDormModuleOptions> | TypeDormModuleOptions;
  connectionFactory?: TypeDormConnectionFactory;
  inject?: any[];
};
