export class MultipleItemsReturned extends Error {
  constructor() {
    super(
      'Multiple items were returned from a query where one item was expected',
    );
  }
}
