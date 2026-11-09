import type { ListGuard } from '../types';

export function createListGuard(canDrop: ListGuard | undefined): ListGuard {
  return (itemId, fromListId, toListId) => {
    if (fromListId === toListId || canDrop === undefined) return true;
    return canDrop(itemId, fromListId, toListId);
  };
}
