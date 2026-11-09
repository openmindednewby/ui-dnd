import type { ReactNode } from 'react';

import type { Slot } from '../types';

export function renderSlot<State>(slot: Slot<State>, state: State): ReactNode {
  return typeof slot === 'function' ? slot(state) : slot;
}
