import { resolveMove } from './resolveMove';

describe('resolveMove', () => {
  it('with a drop on another list, returns the move', () => {
    const result = resolveMove('card', 'a', 'b');

    expect(result).toEqual({ itemId: 'card', fromListId: 'a', toListId: 'b' });
  });

  it('with a drop on the same list, returns null', () => {
    const result = resolveMove('card', 'a', 'a');

    expect(result).toBeNull();
  });

  it('with a drop outside every list, returns null', () => {
    const result = resolveMove('card', 'a', undefined);

    expect(result).toBeNull();
  });

  it('with no source list on the item, returns null', () => {
    const result = resolveMove('card', undefined, 'b');

    expect(result).toBeNull();
  });
});
