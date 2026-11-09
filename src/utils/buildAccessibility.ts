import type { Announcements, ScreenReaderInstructions } from '@dnd-kit/core';

import type { DragLabels } from '../types';
import { listIdOf } from './listIdOf';

export interface DragAccessibility {
  announcements: Announcements;
  screenReaderInstructions: ScreenReaderInstructions;
}

export function buildAccessibility(labels: DragLabels): DragAccessibility {
  let spokenListId: string | null | undefined;
  return {
    screenReaderInstructions: { draggable: labels.instructions },
    announcements: {
      onDragStart: ({ active }) => {
        spokenListId = listIdOf(active);
        return labels.onPickUp(String(active.id), String(spokenListId));
      },
      onDragOver: ({ active, over }) => {
        const listId = over === null ? null : String(over.id);
        if (listId === spokenListId) return undefined;
        spokenListId = listId;
        return labels.onOver(String(active.id), listId);
      },
      onDragEnd: ({ active, over }) => labels.onDrop(String(active.id), over === null ? null : String(over.id)),
      onDragCancel: ({ active }) => labels.onCancel(String(active.id)),
    },
  };
}
