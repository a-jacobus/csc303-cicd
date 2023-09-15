import { Attribute, Entity, INDEX_TYPE } from '@typedorm/common';
import { ulid } from 'ulid';
import { DateAttribute } from '../../date-attribute/date-attribute.decorator';

@Entity({
  name: 'status',
  primaryKey: {
    partitionKey: 'STATUS#{{id}}',
    sortKey: 'US#{{createdBy}}',
  },
  indexes: {
    GSI1: {
      partitionKey: 'US#{{createdBy}}',
      sortKey: 'STATUS#{{id}}',
      type: INDEX_TYPE.GSI,
    },
  },
})
export class Status {
  @Attribute()
  id: string;
  @Attribute()
  content: string;
  @DateAttribute()
  createdAt: Date;
  @Attribute()
  createdBy: string;

  static create(content: string, createdBy: string): Status {
    const status = new Status();
    status.id = ulid();
    status.createdAt = new Date();
    status.content = content;
    status.createdBy = createdBy;
    return status;
  }
}
