import { KeyboardCode } from '@dnd-kit/core';
import type {
  KeyboardCoordinateGetter,
  KeyboardSensorOptions,
  MouseSensorOptions,
  TouchSensorOptions,
} from '@dnd-kit/core';

import { LONG_PRESS_MS, MOUSE_DISTANCE_PX, TOUCH_TOLERANCE_PX } from '../constants';

export interface DragSensorOptions {
  mouse: MouseSensorOptions;
  touch: TouchSensorOptions;
  keyboard: KeyboardSensorOptions;
}

export function buildSensorOptions(
  coordinateGetter: KeyboardCoordinateGetter,
  reducedMotion: boolean,
): DragSensorOptions {
  return {
    mouse: { activationConstraint: { distance: MOUSE_DISTANCE_PX } },
    touch: { activationConstraint: { delay: LONG_PRESS_MS, tolerance: TOUCH_TOLERANCE_PX } },
    keyboard: {
      coordinateGetter,
      scrollBehavior: reducedMotion ? 'auto' : 'smooth',
      keyboardCodes: {
        start: [KeyboardCode.Space, KeyboardCode.Enter],
        cancel: [KeyboardCode.Esc, KeyboardCode.Tab],
        end: [KeyboardCode.Space, KeyboardCode.Enter],
      },
    },
  };
}
