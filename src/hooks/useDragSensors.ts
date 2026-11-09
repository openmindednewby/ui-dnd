import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { KeyboardCoordinateGetter, SensorDescriptor, SensorOptions } from '@dnd-kit/core';
import { useMemo } from 'react';

import { buildSensorOptions } from '../utils/sensorOptions';

export function useDragSensors(
  coordinateGetter: KeyboardCoordinateGetter,
  reducedMotion: boolean,
): SensorDescriptor<SensorOptions>[] {
  const options = useMemo(() => buildSensorOptions(coordinateGetter, reducedMotion), [coordinateGetter, reducedMotion]);
  return useSensors(
    useSensor(MouseSensor, options.mouse),
    useSensor(TouchSensor, options.touch),
    useSensor(KeyboardSensor, options.keyboard),
  );
}
