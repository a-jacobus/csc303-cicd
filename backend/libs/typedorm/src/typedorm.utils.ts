import { Connection, ConnectionOptions, EntityManager } from '@typedorm/core';
import { DEFAULT_CONNECTION_NAME } from './typedorm.types';
import { Type } from '@nestjs/common';
import { EntityTarget } from '@typedorm/common';
import { CircularDependencyException } from './exceptions/circular-dependency.exception';

/**
 * This function generates an injection token for an Entity
 * @param {EntityClassOrSchema} entity parameter can either be an Entity
 * @param {string} [connection='default'] DataSource name
 * @returns {string} The Repository injection token
 */
export function getRepositoryToken(
  entity: EntityTarget<any>,
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (entity === null || entity === undefined) {
    throw new CircularDependencyException('@InjectRepository()');
  }
  const connectionPrefix = getConnectionPrefix(connection);
  return `${connectionPrefix}${entity.name}Repository`;
}

/**
 * This function returns a Connection prefix based on the connection name
 * @param {Connection | ConnectionOptions | string} [connection='default'] This optional parameter is either
 * a Connection, or a ConnectionOptions or a string.
 * @returns {string | Function} The Connection injection token.
 */
export function getConnectionPrefix(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (connection === DEFAULT_CONNECTION_NAME) {
    return '';
  }
  if (typeof connection === 'string') {
    return connection + '_';
  }
  if (connection.name === DEFAULT_CONNECTION_NAME || !connection.name) {
    return '';
  }
  return connection.name + '_';
}

/**
 * This function returns a Connection injection token for the given Connection, ConnectionOptions or connection name.
 * @param {Connection | ConnectionOptions | string} [connection='default'] This optional parameter is either
 * a Connection, or a ConnectionOptions or a string.
 * @returns {string | Function} The Connection injection token.
 */
export function getConnectionToken(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME,
): string | Type<Connection> {
  return DEFAULT_CONNECTION_NAME === connection
    ? Connection
    : 'string' === typeof connection
    ? `${connection}Connection`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? Connection
    : `${connection.name}DataSource`;
}

/**
 * This function returns an EntityManager injection token for the given Connection, ConnectionOptions or connection name.
 * @param {Connection | ConnectionOptions | string} [connection='default'] This optional parameter is either
 * a Connection, or a ConnectionOptions or a string.
 * @returns {string | Function} The EntityManager injection token.
 */
export function getEntityManagerToken(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME,
): string | Type<EntityManager> {
  return DEFAULT_CONNECTION_NAME === connection
    ? EntityManager
    : 'string' === typeof connection
    ? `${connection}EntityManager`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? EntityManager
    : `${connection.name}EntityManager`;
}
