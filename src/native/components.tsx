import type { ReactElement } from 'react';
import { View } from 'react-native';

import type { DragItemProps, DragProviderProps, DropListProps } from '../types';
import { renderSlot } from '../utils/renderSlot';

export function DragProvider({ children }: DragProviderProps): ReactElement {
  return <>{children}</>;
}

export function DropList({ children, style, testID }: DropListProps): ReactElement {
  return (
    <View style={style} testID={testID}>
      {renderSlot(children, { isOver: false })}
    </View>
  );
}

export function DragItem({ children, style, testID }: DragItemProps): ReactElement {
  return (
    <View style={style} testID={testID}>
      {renderSlot(children, { isDragging: false })}
    </View>
  );
}
