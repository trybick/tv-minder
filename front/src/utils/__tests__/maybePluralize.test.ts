import { maybePluralize } from '../formatting';

describe('maybePluralize', () => {
  it('pluralizes a string', () => {
    const pluralized = maybePluralize(2, 'test');
    expect(pluralized).toBe('tests');
  });

  it('does not pluralize a string', () => {
    const pluralized = maybePluralize(1, 'test');
    expect(pluralized).toBe('test');
  });
});
