import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ListGuard = (itemId: string, fromListId: string, toListId: string) => boolean;

export type Slot<State> = ReactNode | ((state: State) => ReactNode);

export interface DragLabels {
  instructions: string;
  roleDescription: string;
  onPickUp: (itemId: string, listId: string) => string;
  onOver: (itemId: string, listId: string | null) => string;
  onDrop: (itemId: string, listId: string | null) => string;
  onCancel: (itemId: string) => string;
}

export interface DragProviderProps {
  onMove: (itemId: string, fromListId: string, toListId: string) => void;
  labels: DragLabels;
  renderOverlay: (itemId: string) => ReactNode;
  canDrop?: ListGuard;
  children: ReactNode;
}

export interface DropListState {
  isOver: boolean;
}

export interface DropListProps {
  id: string;
  children: Slot<DropListState>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface DragItemState {
  isDragging: boolean;
}

export interface DragItemProps {
  id: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  canDrag?: boolean;
  children: Slot<DragItemState>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
