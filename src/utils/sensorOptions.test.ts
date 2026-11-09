import { buildSensorOptions } from './sensorOptions';

const getter = jest.fn();

describe('buildSensorOptions', () => {
  it('with touch input, needs a long-press and tolerates a small drift', () => {
    const options = buildSensorOptions(getter, false);

    expect(options.touch.activationConstraint).toEqual({ delay: 250, tolerance: 8 });
  });

  it('with a mouse, starts after a short move so a click stays a click', () => {
    const options = buildSensorOptions(getter, false);

    expect(options.mouse.activationConstraint).toEqual({ distance: 5 });
  });

  it('with Tab during a drag, cancels instead of dropping', () => {
    const options = buildSensorOptions(getter, false);

    expect(options.keyboard.keyboardCodes?.cancel).toContain('Tab');
  });

  it('with reduced motion, scrolls without animation', () => {
    const options = buildSensorOptions(getter, true);

    expect(options.keyboard.scrollBehavior).toBe('auto');
  });

  it('with normal motion, scrolls smoothly', () => {
    const options = buildSensorOptions(getter, false);

    expect(options.keyboard.scrollBehavior).toBe('smooth');
  });
});
