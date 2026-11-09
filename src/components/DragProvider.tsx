import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useReducedMotion } from '@dloizides/rn-web-hooks';
import { useCallback, useMemo, useState } from 'react';
import type { ReactElement } from 'react';

import { RoleDescriptionContext } from '../dragContexts';
import { useDragSensors } from '../hooks/useDragSensors';
import type { DragProviderProps } from '../types';
import { buildAccessibility } from '../utils/buildAccessibility';
import { createListCollision } from '../utils/listCollision';
import { createListCoordinateGetter } from '../utils/listCoordinates';
import { createListGuard } from '../utils/listGuard';
import { listIdOf } from '../utils/listIdOf';
import { resolveMove } from '../utils/resolveMove';

/** Owns one drag session: sensors, announcements, the lifted overlay and the move callback. */
export function DragProvider({ onMove, labels, renderOverlay, canDrop, children }: DragProviderProps): ReactElement {
  const reducedMotion = useReducedMotion();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const guard = useMemo(() => createListGuard(canDrop), [canDrop]);
  const coordinateGetter = useMemo(() => createListCoordinateGetter(guard), [guard]);
  const collisionDetection = useMemo(() => createListCollision(guard), [guard]);
  const accessibility = useMemo(() => buildAccessibility(labels), [labels]);
  const sensors = useDragSensors(coordinateGetter, reducedMotion);

  const handleDragStart = useCallback((event: DragStartEvent) => setActiveItemId(String(event.active.id)), []);
  const handleDragCancel = useCallback(() => setActiveItemId(null), []);
  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveItemId(null);
      const move = resolveMove(String(active.id), listIdOf(active), over === null ? undefined : String(over.id));
      if (move !== null) onMove(move.itemId, move.fromListId, move.toListId);
    },
    [onMove],
  );

  return (
    <RoleDescriptionContext.Provider value={labels.roleDescription}>
      <DndContext
        accessibility={accessibility}
        collisionDetection={collisionDetection}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        {children}
        <DragOverlay dropAnimation={reducedMotion ? null : undefined}>
          {activeItemId === null ? null : renderOverlay(activeItemId)}
        </DragOverlay>
      </DndContext>
    </RoleDescriptionContext.Provider>
  );
}
