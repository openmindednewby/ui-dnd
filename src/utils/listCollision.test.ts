import type { CollisionDetection, DroppableContainer } from '@dnd-kit/core';

import { createListCollision } from './listCollision';

type CollisionArgs = Parameters<CollisionDetection>[0];
type Point = NonNullable<CollisionArgs['pointerCoordinates']>;

function makeRect(left: number, width: number): DOMRect {
  const top = 0;
  const height = 400;
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => '' };
}

const REFUSED_RECT = makeRect(0, 200);
const ALLOWED_RECT = makeRect(150, 200);
const POINT_ONLY_OVER_REFUSED: Point = { x: 50, y: 100 };
const POINT_OVER_ALLOWED: Point = { x: 300, y: 100 };
const DRAGGED_RECT = { left: 100, top: 10, width: 100, height: 60, right: 200, bottom: 70 };

function makeArgs(pointerCoordinates: Point | null): CollisionArgs {
  const rects: [string, DOMRect][] = [
    ['refused', REFUSED_RECT],
    ['allowed', ALLOWED_RECT],
  ];
  return {
    active: { id: 'card', data: { current: { listId: 'source' } }, rect: { current: { initial: null, translated: null } } },
    collisionRect: DRAGGED_RECT,
    droppableRects: new Map(rects),
    droppableContainers: rects.map(([id, rect]) => ({ id, rect: { current: rect } }) as unknown as DroppableContainer),
    pointerCoordinates,
  };
}

const refuseOneList = (_itemId: string, _fromListId: string, toListId: string): boolean => toListId !== 'refused';

describe('createListCollision', () => {
  it('with the pointer only over a refused list, returns no target', () => {
    const detect = createListCollision(refuseOneList);

    const collisions = detect(makeArgs(POINT_ONLY_OVER_REFUSED));

    expect(collisions).toEqual([]);
  });

  it('with the pointer over an allowed list, returns that list', () => {
    const detect = createListCollision(refuseOneList);

    const collisions = detect(makeArgs(POINT_OVER_ALLOWED));

    expect(collisions.map((collision) => collision.id)).toEqual(['allowed']);
  });

  it('with no pointer, as in a keyboard drag, falls back to the allowed list the card overlaps', () => {
    const detect = createListCollision(refuseOneList);

    const collisions = detect(makeArgs(null));

    expect(collisions.map((collision) => collision.id)).toEqual(['allowed']);
  });
});
