import { pointerWithin, rectIntersection } from '@dnd-kit/core';
import type { CollisionDetection } from '@dnd-kit/core';

import type { ListGuard } from '../types';
import { listIdOf } from './listIdOf';

export function createListCollision(guard: ListGuard): CollisionDetection {
  return (args) => {
    const fromListId = listIdOf(args.active);
    const itemId = String(args.active.id);
    const allowed = args.droppableContainers.filter(
      (list) => fromListId !== undefined && guard(itemId, fromListId, String(list.id)),
    );
    const scoped = { ...args, droppableContainers: allowed };
    return args.pointerCoordinates === null ? rectIntersection(scoped) : pointerWithin(scoped);
  };
}
