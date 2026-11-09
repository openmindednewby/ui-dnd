import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Text } from 'react-native';

import { useReducedMotion } from '@dloizides/rn-web-hooks';

import type { DragLabels, DragProviderProps } from '../types';
import { DragItem } from './DragItem';
import { DragProvider } from './DragProvider';
import { DropList } from './DropList';

const mockOverlayProps = jest.fn();

jest.mock('@dloizides/rn-web-hooks', () => ({ useReducedMotion: jest.fn(() => false) }));
jest.mock('@dnd-kit/core', () => {
  const actual = jest.requireActual('@dnd-kit/core');
  const Overlay = actual.DragOverlay;
  const { createElement } = jest.requireActual('react');
  return {
    ...actual,
    DragOverlay: (props: Record<string, unknown>) => {
      mockOverlayProps(props);
      return createElement(Overlay, props);
    },
  };
});

const labels: DragLabels = {
  instructions: 'instructions-text',
  roleDescription: 'role-text',
  onPickUp: (item, list) => `picked ${item} from ${list}`,
  onOver: (item, list) => `over ${item} ${String(list)}`,
  onDrop: (item, list) => `dropped ${item} on ${String(list)}`,
  onCancel: (item) => `cancelled ${item}`,
};

function makeRect(left: number, top: number, width: number, height: number): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => '' };
}

const RECTS: Record<string, DOMRect> = {
  'list-a': makeRect(0, 0, 200, 400),
  'list-b': makeRect(220, 0, 200, 400),
  'list-c': makeRect(440, 0, 200, 400),
};
const ITEM_RECT = makeRect(10, 10, 180, 60);

function flush(): Promise<void> {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

function Board(props: Partial<DragProviderProps> & { canDragCard?: boolean }): ReactElement {
  const { canDragCard, ...provider } = props;
  return (
    <DragProvider
      labels={labels}
      onMove={jest.fn()}
      renderOverlay={(id) => <Text>{`lifted ${id}`}</Text>}
      {...provider}
    >
      <DropList id="a" testID="list-a">
        <DragItem id="card" accessibilityLabel="card-name" accessibilityHint="card-hint" canDrag={canDragCard} testID="card">
          <Text>card body</Text>
        </DragItem>
      </DropList>
      <DropList id="b" testID="list-b">
        <Text>empty</Text>
      </DropList>
      <DropList id="c" testID="list-c">
        <Text>empty</Text>
      </DropList>
    </DragProvider>
  );
}

async function pickUpByKeyboard(): Promise<void> {
  fireEvent.keyDown(screen.getByTestId('card'), { code: 'Space' });
  await flush();
}

async function pressAndSettle(code: string): Promise<void> {
  fireEvent.keyDown(document, { code });
  await flush();
}

beforeEach(() => {
  mockOverlayProps.mockClear();
  (useReducedMotion as jest.Mock).mockReturnValue(false);
  Element.prototype.scrollIntoView = jest.fn();
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function rect(this: HTMLElement) {
    return RECTS[this.getAttribute('data-testid') ?? ''] ?? ITEM_RECT;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('DragProvider keyboard flow', () => {
  it('with Space, ArrowRight, Space, calls onMove once with the two lists', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');

    await pressAndSettle('Space');

    expect(onMove.mock.calls).toEqual([['card', 'a', 'b']]);
  });

  it('with Space, ArrowRight twice, Space, lands on the third list', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');
    await pressAndSettle('ArrowRight');

    await pressAndSettle('Space');

    expect(onMove.mock.calls).toEqual([['card', 'a', 'c']]);
  });

  it('with a drop back on the source list, does not call onMove', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');
    await pressAndSettle('ArrowLeft');

    await pressAndSettle('Space');

    expect(onMove).not.toHaveBeenCalled();
  });

  it('with Escape, cancels without calling onMove', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');

    await pressAndSettle('Escape');

    expect(onMove).not.toHaveBeenCalled();
  });
});

describe('DragProvider mouse flow', () => {
  it('with a mouse drag onto another list, calls onMove once', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} />);
    fireEvent.mouseDown(screen.getByTestId('card'), { button: 0, clientX: 20, clientY: 20 });
    await flush();
    fireEvent.mouseMove(document, { clientX: 40, clientY: 20 });
    await flush();
    fireEvent.mouseMove(document, { clientX: 300, clientY: 50 });
    await flush();

    fireEvent.mouseUp(document, { clientX: 300, clientY: 50 });
    await flush();

    expect(onMove.mock.calls).toEqual([['card', 'a', 'b']]);
  });
});

describe('canDrag and canDrop', () => {
  it('with canDrag false, Space does not pick the item up', async () => {
    render(<Board canDragCard={false} />);

    await pickUpByKeyboard();

    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('with canDrag false, the item is not a tab stop', () => {
    render(<Board canDragCard={false} />);

    const card = screen.getByTestId('card');

    expect(card.getAttribute('tabindex')).toBeNull();
  });

  it('with canDrop refusing the next list, the arrow skips it', async () => {
    const onMove = jest.fn();
    const canDrop = (_item: string, _from: string, to: string): boolean => to !== 'b';
    render(<Board onMove={onMove} canDrop={canDrop} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');

    await pressAndSettle('Space');

    expect(onMove.mock.calls).toEqual([['card', 'a', 'c']]);
  });

  it('with canDrop refusing every other list, does not call onMove', async () => {
    const onMove = jest.fn();
    render(<Board onMove={onMove} canDrop={() => false} />);
    await pickUpByKeyboard();
    await pressAndSettle('ArrowRight');

    await pressAndSettle('Space');

    expect(onMove).not.toHaveBeenCalled();
  });
});

describe('screen-reader strings', () => {
  it('with a pick-up, announces the string the app passed in', async () => {
    render(<Board />);

    await pickUpByKeyboard();

    expect(screen.getByRole('status').textContent).toBe('picked card from a');
  });

  it('with a cancel, announces the cancel string', async () => {
    render(<Board />);
    await pickUpByKeyboard();

    await pressAndSettle('Escape');

    expect(screen.getByRole('status').textContent).toBe('cancelled card');
  });

  it('with an idle item, describes it with the app instructions and role text', () => {
    render(<Board />);

    const card = screen.getByTestId('card');
    const description = document.getElementById(card.getAttribute('aria-describedby') ?? '');

    expect([description?.textContent, card.getAttribute('aria-roledescription')]).toEqual([
      'instructions-text',
      'role-text',
    ]);
  });
});

describe('DragProvider reduced motion', () => {
  it('with reduced motion, turns the drop animation off', () => {
    (useReducedMotion as jest.Mock).mockReturnValue(true);

    render(<Board />);

    expect(mockOverlayProps.mock.calls.at(-1)?.[0].dropAnimation).toBeNull();
  });

  it('with normal motion, keeps the default drop animation', () => {
    render(<Board />);

    expect(mockOverlayProps.mock.calls.at(-1)?.[0].dropAnimation).toBeUndefined();
  });
});

describe('DragItem', () => {
  it('outside a DropList, throws', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const renderOrphan = (): unknown =>
      render(
        <DragProvider labels={labels} onMove={jest.fn()} renderOverlay={() => null}>
          <DragItem id="x" accessibilityLabel="x" accessibilityHint="x-hint">
            <Text>x</Text>
          </DragItem>
        </DragProvider>,
      );

    expect(renderOrphan).toThrow('DragItem must be rendered inside a DropList');
  });
});
