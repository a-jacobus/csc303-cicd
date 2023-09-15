import { Attribute, Entity, INDEX_TYPE } from '@typedorm/common';
import { DateAttribute } from '../../date-attribute/date-attribute.decorator';
import { ulid } from 'ulid';

@Entity({
  name: 'reaction',
  primaryKey: {
    partitionKey: 'SR#{{statusId}}',
    sortKey: 'RU#{{createdBy}}',
  },
  indexes: {
    GSI1: {
      type: INDEX_TYPE.GSI,
      partitionKey: 'RU#{{createdBy}}',
      sortKey: 'SR#{{statusId}}',
    },
    LSI1: {
      type: INDEX_TYPE.LSI,
      sortKey: 'REACTION#{{id}}',
    },
  },
})
export class Reaction {
  @Attribute()
  id: string;
  @Attribute()
  content: string;
  @DateAttribute()
  createdAt: Date;
  @Attribute()
  createdBy: string;
  @Attribute()
  statusId: string;

  static create(
    content: string,
    createdBy: string,
    statusId: string,
  ): Reaction {
    const reaction = new Reaction();
    reaction.id = ulid();
    reaction.content = content;
    reaction.createdAt = new Date();
    reaction.createdBy = createdBy;
    reaction.statusId = statusId;
    return reaction;
  }
}
