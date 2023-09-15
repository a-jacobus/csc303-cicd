import { EntityTarget, EntityAttributes } from '@typedorm/common';
import {
  EntityManager,
  EntityManagerCreateOptions,
  EntityManagerFindOneOptions,
  EntityManagerExistsOptions,
  EntityManagerUpdateOptions,
  EntityManagerDeleteOptions,
  EntityManagerFindOptions,
  EntityManagerCountOptions,
} from '@typedorm/core';
import { UpdateBody } from '@typedorm/core/cjs/src/classes/expression/update-body-type';
import { MetadataOptions } from '@typedorm/core/cjs/src/classes/transformer/base-transformer';
import { DocumentClientTypes } from '@typedorm/document-client';
import { ItemDoesNotExist } from './exceptions/item-does-not-exist.exception';
import { MultipleItemsReturned } from './exceptions/multiple-items.exception';

export class Repository<Entity extends Record<string, any>> {
  constructor(
    protected entityManager: EntityManager,
    protected entityClass: EntityTarget<Entity>,
  ) {}

  /**
   * Creates new record in table with given entity
   * @param entity Entity to add to table as a new record
   */
  create(
    entity: Entity,
    options?: EntityManagerCreateOptions<Entity>,
    metadataOptions?: MetadataOptions,
  ): Promise<Entity> {
    return this.entityManager.create(entity, options, metadataOptions);
  }

  /**
   * Gets a record by given primary key, when table uses composite primary key,
   * props must include both partition and sort key attributes
   * @param primaryKeyAttributes attributes of entity
   */
  get<PrimaryKey = Partial<Entity>>(
    primaryKeyAttributes: PrimaryKey,
    options?: EntityManagerFindOneOptions<Entity>,
    metadataOptions?: MetadataOptions,
  ): Promise<Entity | undefined> {
    return this.entityManager.findOne(
      this.entityClass,
      primaryKeyAttributes,
      options,
      metadataOptions,
    );
  }

  /**
   * Find a single object that matches the given query.
   * @param partitionKey Partition key attributes, If querying an index, this is the partition key attributes of that index
   * @param queryOptions Query Options
   * @throws {@link MultipleItemsReturned} Thrown if the query finds more than 1 item.
   * @throws {@link ItemDoesNotExist} Thrown if the query returns no items.
   */
  async findOne<PartitionKey = Partial<EntityAttributes<Entity>> | string>(
    partitionKey: PartitionKey,
    queryOptions?: EntityManagerFindOptions<Entity, PartitionKey>,
    metadataOptions?: MetadataOptions,
  ): Promise<Entity> {
    const { items } = await this.entityManager.find(
      this.entityClass,
      partitionKey,
      queryOptions,
      metadataOptions,
    );
    if (items.length === 0) throw new ItemDoesNotExist();
    if (items.length > 1) throw new MultipleItemsReturned();
    return items[0];
  }

  /**
   * Checks if item with given attribute/primary key exists in the table
   * @param attributes attributes to find items by, must be primary key attributes or attribute marked as unique
   */
  exists<KeyAttributes = Partial<Entity>>(
    attributes: KeyAttributes,
    options?: EntityManagerExistsOptions,
    metadataOptions?: MetadataOptions,
  ): Promise<boolean> {
    return this.entityManager.exists(
      this.entityClass,
      attributes,
      options,
      metadataOptions,
    );
  }

  /**
   * Update an existing item in the table by primary key
   * @param primaryKeyAttributes Primary key
   * @param body Attributes to update
   * @param options update options
   */
  update<PrimaryKey = Partial<Entity>, AdditionalProperties = Entity>(
    primaryKeyAttributes: PrimaryKey,
    body: UpdateBody<Entity, AdditionalProperties>,
    options?: EntityManagerUpdateOptions<Entity>,
    metadataOptions?: MetadataOptions,
  ): Promise<Entity | undefined> {
    return this.entityManager.update(
      this.entityClass,
      primaryKeyAttributes,
      body,
      options,
      metadataOptions,
    );
  }

  /**
   * Deletes an entity by primary key
   * @param primaryKeyAttributes Entity Primary key
   */
  delete<PrimaryKeyAttributes = Partial<Entity>>(
    primaryKeyAttributes: PrimaryKeyAttributes,
    options?: EntityManagerDeleteOptions<Entity>,
    metadataOptions?: MetadataOptions,
  ): Promise<{
    success: boolean;
  }> {
    return this.entityManager.delete(
      this.entityClass,
      primaryKeyAttributes,
      options,
      metadataOptions,
    );
  }

  /**
   * Find items using declarative query options
   * @param partitionKey Partition key attributes, If querying an index, this is the partition key attributes of that index
   * @param queryOptions Query Options
   */
  find<PartitionKey = Partial<EntityAttributes<Entity>> | string>(
    partitionKey: PartitionKey,
    queryOptions?: EntityManagerFindOptions<Entity, PartitionKey>,
    metadataOptions?: MetadataOptions,
  ): Promise<{
    items: Entity[];
    cursor?: DocumentClientTypes.Key | undefined;
  }> {
    return this.entityManager.find(
      this.entityClass,
      partitionKey,
      queryOptions,
      metadataOptions,
    );
  }

  /**
   * Returns a count of total items matching ther query
   * @param partitionKey Partition key attributes, If querying an index, this is the partition key attributes of that index
   * @param queryOptions Count Query Options
   */
  count<PartitionKey = Partial<EntityAttributes<Entity>> | string>(
    partitionKey: PartitionKey,
    queryOptions?: EntityManagerCountOptions<Entity, PartitionKey>,
    metadataOptions?: MetadataOptions,
  ): Promise<number> {
    return this.entityManager.count(
      this.entityClass,
      partitionKey,
      queryOptions,
      metadataOptions,
    );
  }
}
