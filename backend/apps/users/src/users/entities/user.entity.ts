import { Attribute, Entity } from '@typedorm/common';

@Entity({
  name: 'user',
  primaryKey: {
    partitionKey: 'USER#{{id}}',
    sortKey: 'USER#{{id}}',
  },
})
export class User {
  @Attribute()
  id: string;
  @Attribute()
  username: string;
  @Attribute()
  createdAt: string;
  @Attribute({
    default: 0,
  })
  followerCount: number;
  @Attribute({
    default: 0,
  })
  followingCount: number;
}
