import type { Active, Announcements, Over } from '@dnd-kit/core';

import type { DragLabels } from '../types';
import { buildAccessibility } from './buildAccessibility';

const labels: DragLabels = {
  instructions: 'instructions-text',
  roleDescription: 'role-text',
  onPickUp: (item, list) => `picked ${item} from ${list}`,
  onOver: (item, list) => `over ${item} ${String(list)}`,
  onDrop: (item, list) => `dropped ${item} on ${String(list)}`,
  onCancel: (item) => `cancelled ${item}`,
};

const active = { id: 'card', data: { current: { listId: 'a' } } } as unknown as Active;

function overList(id: string): Over {
  return { id } as unknown as Over;
}

function pickedUp(): Announcements {
  const { announcements } = buildAccessibility(labels);
  announcements.onDragStart({ active });
  return announcements;
}

describe('buildAccessibility', () => {
  it('with the item still over its source list, stays silent so the pick-up is heard', () => {
    const announcements = pickedUp();

    const spoken = announcements.onDragOver({ active, over: overList('a') });

    expect(spoken).toBeUndefined();
  });

  it('with the item over another list, announces it', () => {
    const announcements = pickedUp();

    const spoken = announcements.onDragOver({ active, over: overList('b') });

    expect(spoken).toBe('over card b');
  });

  it('with the item returning to its source list, announces it', () => {
    const announcements = pickedUp();
    announcements.onDragOver({ active, over: overList('b') });

    const spoken = announcements.onDragOver({ active, over: overList('a') });

    expect(spoken).toBe('over card a');
  });

  it('with the item leaving every list, announces no list', () => {
    const announcements = pickedUp();

    const spoken = announcements.onDragOver({ active, over: null });

    expect(spoken).toBe('over card null');
  });
});
