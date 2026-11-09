import { createListGuard } from './listGuard';

describe('createListGuard', () => {
  it('with no canDrop rule, allows every list', () => {
    const guard = createListGuard(undefined);

    const allowed = guard('card', 'a', 'b');

    expect(allowed).toBe(true);
  });

  it('with canDrop returning false, refuses that list', () => {
    const guard = createListGuard((_item, _from, to) => to !== 'b');

    const allowed = guard('card', 'a', 'b');

    expect(allowed).toBe(false);
  });

  it('with canDrop refusing everything, still allows the source list', () => {
    const guard = createListGuard(() => false);

    const allowed = guard('card', 'a', 'a');

    expect(allowed).toBe(true);
  });
});
