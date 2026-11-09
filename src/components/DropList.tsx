import { useDroppable } from '@dnd-kit/core';
import { useCallback } from 'react';
import type { ReactElement } from 'react';
import { View } from 'react-native';

import { ListIdContext } from '../dragContexts';
import type { DropListProps } from '../types';
import { renderSlot } from '../utils/renderSlot';

/** One list items can be dropped on; on web the View ref is the DOM node dnd-kit measures. */
export function DropList({ id, children, style, testID }: DropListProps): ReactElement {
  const { setNodeRef, isOver } = useDroppable({ id });
  const attachNode = useCallback((node: View | null) => setNodeRef(node as unknown as HTMLElement | null), [setNodeRef]);

  return (
    <ListIdContext.Provider value={id}>
      <View ref={attachNode} style={style} testID={testID}>
        {renderSlot(children, { isOver })}
      </View>
    </ListIdContext.Provider>
  );
}
