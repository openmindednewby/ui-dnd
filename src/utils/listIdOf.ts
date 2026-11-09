import type { Active } from '@dnd-kit/core';

export function listIdOf(active: Pick<Active, 'data'>): string | undefined {
  const listId: unknown = active.data.current?.listId;
  return typeof listId === 'string' ? listId : undefined;
}
