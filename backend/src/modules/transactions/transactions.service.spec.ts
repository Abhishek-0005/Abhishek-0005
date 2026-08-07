import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  it('is defined', () => {
    expect(new TransactionsService({} as any)).toBeTruthy();
  });
});
