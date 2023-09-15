import { Provider } from '@nestjs/common';
import { EntityTarget } from '@typedorm/common';
import { Connection, ConnectionOptions } from '@typedorm/core';
import { getConnectionToken, getRepositoryToken } from './typedorm.utils';
import { Repository } from './repository';

export function createTypeDormProviders(
  entities: EntityTarget<any>[] = [],
  connection?: Connection | ConnectionOptions | string,
): Provider[] {
  return entities.map((entity) => ({
    provide: getRepositoryToken(entity, connection),
    useFactory: (connection: Connection) => {
      return new Repository(connection.entityManager, entity);
    },
    inject: [getConnectionToken(connection)],
  }));
}
