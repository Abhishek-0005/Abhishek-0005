import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  it('is defined', () => {
    expect(new CategoriesService({} as any)).toBeTruthy();
  });
});
