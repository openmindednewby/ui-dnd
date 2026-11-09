import type { Active, DroppableContainer, KeyboardCoordinateGetter } from '@dnd-kit/core';

import { createListCoordinateGetter } from './listCoordinates';

type GetterArgs = Parameters<KeyboardCoordinateGetter>[1];

const LIST_WIDTH = 200;
const ITEM_WIDTH = 100;

function rectAt(left: number, top: number, width = LIST_WIDTH): DOMRect {
  return { left, top, width, height: 300, right: left + width, bottom: top + 300, x: left, y: top, toJSON: () => '' };
}

function arrange(rects: Record<string, DOMRect>, overId: string | null = null): GetterArgs {
  const containers = Object.keys(rects).map((id) => ({ id }) as unknown as DroppableContainer);
  return {
    active: 'card',
    currentCoordinates: { x: 0, y: 0 },
    context: {
      active: { id: 'card', data: { current: { listId: 'a' } } } as unknown as Active,
      collisionRect: rectAt(0, 0, ITEM_WIDTH),
      droppableRects: new Map(Object.entries(rects)),
      droppableContainers: { getEnabled: () => containers },
      over: overId === null ? null : { id: overId },
    },
  } as unknown as GetterArgs;
}

function press(code: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { code, cancelable: true });
}

const threeColumns = { b: rectAt(220, 0), a: rectAt(0, 0), c: rectAt(440, 0) };
const allowAll = (): boolean => true;

describe('createListCoordinateGetter', () => {
  it('with ArrowRight from the first list, centres on the next list', () => {
    const getter = createListCoordinateGetter(allowAll);

    const result = getter(press('ArrowRight'), arrange(threeColumns));

    expect(result?.x).toBe(220 + (LIST_WIDTH - ITEM_WIDTH) / 2);
  });

  it('with ArrowLeft while over the last list, targets the middle list', () => {
    const getter = createListCoordinateGetter(allowAll);

    const result = getter(press('ArrowLeft'), arrange(threeColumns, 'c'));

    expect(result?.x).toBe(220 + (LIST_WIDTH - ITEM_WIDTH) / 2);
  });

  it('with ArrowDown on stacked lists, targets the list below', () => {
    const stacked = { a: rectAt(0, 0), b: rectAt(0, 320) };
    const getter = createListCoordinateGetter(allowAll);

    const result = getter(press('ArrowDown'), arrange(stacked));

    expect(result?.y).toBeGreaterThanOrEqual(320);
  });

  it('with ArrowLeft on the first list, stays put', () => {
    const getter = createListCoordinateGetter(allowAll);

    const result = getter(press('ArrowLeft'), arrange(threeColumns));

    expect(result).toBeUndefined();
  });

  it('with a refused middle list, skips to the next allowed list', () => {
    const getter = createListCoordinateGetter((_item, _from, to) => to !== 'b');

    const result = getter(press('ArrowRight'), arrange(threeColumns));

    expect(result?.x).toBe(440 + (LIST_WIDTH - ITEM_WIDTH) / 2);
  });

  it('with a non-arrow key, returns undefined', () => {
    const getter = createListCoordinateGetter(allowAll);

    const result = getter(press('KeyA'), arrange(threeColumns));

    expect(result).toBeUndefined();
  });
});
