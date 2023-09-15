export class ItemDoesNotExist extends Error {
  constructor() {
    super('A unique item was not found.');
  }
}
