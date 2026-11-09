import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import type { DragLabels } from '../types';
import { DragItem } from './DragItem';
import { DragProvider } from './DragProvider';
import { DropList } from './DropList';

jest.mock('@dloizides/rn-web-hooks', () => ({ useReducedMotion: jest.fn(() => false) }));

const labels: DragLabels = {
  instructions: 'instructions-text',
  roleDescription: 'role-text',
  onPickUp: (item, list) => `picked ${item} from ${list}`,
  onOver: (item, list) => `over ${item} ${String(list)}`,
  onDrop: (item, list) => `dropped ${item} on ${String(list)}`,
  onCancel: (item) => `cancelled ${item}`,
};

describe('DragItem', () => {
  it('with an accessibilityHint, exposes it on the element carrying the label', () => {
    const hint = 'Press space to lift this card';

    render(
      <DragProvider labels={labels} onMove={jest.fn()} renderOverlay={() => <Text>lifted</Text>}>
        <DropList id="a">
          <DragItem id="card" accessibilityLabel="card-name" accessibilityHint={hint} testID="card">
            <Text>card body</Text>
          </DragItem>
        </DropList>
      </DragProvider>,
    );

    const item = screen.getByTestId('card');
    expect(item.getAttribute('aria-label')).toBe('card-name');
    expect(item.getAttribute('aria-description')).toBe(hint);
  });
});
