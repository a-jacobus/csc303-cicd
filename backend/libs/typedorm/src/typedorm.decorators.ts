import { EntityTarget } from '@typedorm/common';
import { DEFAULT_CONNECTION_NAME } from './typedorm.types';
import { Inject } from '@nestjs/common';
import {
  getConnectionToken,
  getEntityManagerToken,
  getRepositoryToken,
} from './typedorm.utils';
import { Connection, ConnectionOptions } from '@typedorm/core';

export const InjectRepository = (
  entity: EntityTarget<any>,
  connection: string = DEFAULT_CONNECTION_NAME,
): ReturnType<typeof Inject> => Inject(getRepositoryToken(entity, connection));

export const InjectConnection: (
  connection?: Connection | ConnectionOptions | string,
) => ReturnType<typeof Inject> = (
  connection?: Connection | ConnectionOptions | string,
) => Inject(getConnectionToken(connection));

export const InjectEntityManager: (
  connection?: Connection | ConnectionOptions | string,
) => ReturnType<typeof Inject> = (
  connection?: Connection | ConnectionOptions | string,
) => Inject(getEntityManagerToken(connection));
