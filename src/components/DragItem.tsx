import { useDraggable } from '@dnd-kit/core';
import { useCallback, useContext, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';

import { ListIdContext, RoleDescriptionContext } from '../dragContexts';
import type { DragItemProps } from '../types';
import { renderSlot } from '../utils/renderSlot';

const styles = StyleSheet.create({
  draggable: { cursor: 'grab', userSelect: 'none', WebkitTouchCallout: 'none' } as unknown as ViewStyle,
});

const ITEM_ROLE = 'group';

/** One item that can be lifted; a nested control keeps its own keys and clicks. */
export function DragItem({
  id,
  accessibilityLabel,
  accessibilityHint,
  canDrag = true,
  children,
  style,
  testID,
}: DragItemProps): ReactElement {
  const listId = useContext(ListIdContext);
  if (listId === null) throw new Error('DragItem must be rendered inside a DropList');
  const roleDescription = useContext(RoleDescriptionContext);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id,
    data: { listId },
    disabled: !canDrag,
    attributes: { role: ITEM_ROLE, roleDescription },
  });
  const labelledElement = useRef<HTMLElement | null>(null);
  const attachNode = useCallback(
    (node: View | null) => {
      const element = node as unknown as HTMLElement | null;
      labelledElement.current = element;
      setNodeRef(element);
      setActivatorNodeRef(element);
    },
    [setNodeRef, setActivatorNodeRef],
  );
  useEffect(() => {
    labelledElement.current?.setAttribute('aria-description', accessibilityHint);
  }, [accessibilityHint]);
  const dragProps = (canDrag ? { ...attributes, ...listeners } : { role: ITEM_ROLE }) as ViewProps;

  return (
    <View
      {...dragProps}
      aria-label={accessibilityLabel}
      ref={attachNode}
      style={[canDrag ? styles.draggable : undefined, style]}
      testID={testID}
    >
      {renderSlot(children, { isDragging })}
    </View>
  );
}
