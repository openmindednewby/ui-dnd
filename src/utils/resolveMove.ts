export interface ResolvedMove {
  itemId: string;
  fromListId: string;
  toListId: string;
}

export function resolveMove(
  itemId: string,
  fromListId: string | undefined,
  overListId: string | undefined,
): ResolvedMove | null {
  if (fromListId === undefined || overListId === undefined || fromListId === overListId) return null;
  return { itemId, fromListId, toListId: overListId };
}
