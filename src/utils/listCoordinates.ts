import type { DroppableContainer, KeyboardCoordinateGetter, UniqueIdentifier } from '@dnd-kit/core';

import { LIST_INSET_PX } from '../constants';
import type { ListGuard } from '../types';
import { listIdOf } from './listIdOf';

type RectLookup = Map<UniqueIdentifier, { top: number; left: number }>;

const STEP_BY_CODE: Record<string, number | undefined> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

function compareReadingOrder(rects: RectLookup): (a: DroppableContainer, b: DroppableContainer) => number {
  return (a, b) => {
    const first = rects.get(a.id);
    const second = rects.get(b.id);
    if (first === undefined || second === undefined) return 0;
    return first.top - second.top || first.left - second.left;
  };
}

export function createListCoordinateGetter(guard: ListGuard): KeyboardCoordinateGetter {
  return (event, { context }) => {
    const step = STEP_BY_CODE[event.code];
    if (step === undefined) return undefined;
    event.preventDefault();
    const { active, collisionRect, droppableContainers, droppableRects, over } = context;
    if (active === null || collisionRect === null) return undefined;
    const fromListId = listIdOf(active);
    if (fromListId === undefined) return undefined;
    const lists = droppableContainers
      .getEnabled()
      .filter((list) => droppableRects.has(list.id) && guard(String(active.id), fromListId, String(list.id)))
      .sort(compareReadingOrder(droppableRects));
    const currentId = over === null ? fromListId : over.id;
    const target = lists[lists.findIndex((list) => list.id === currentId) + step];
    const rect = target === undefined ? undefined : droppableRects.get(target.id);
    if (rect === undefined) return undefined;
    return { x: rect.left + (rect.width - collisionRect.width) / 2, y: rect.top + LIST_INSET_PX };
  };
}
