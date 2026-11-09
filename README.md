# @dloizides/ui-dnd

Move items between lists by mouse, touch long-press or keyboard. Built on `@dnd-kit/core` for React Native Web. On native the components render their children with no drag.

```tsx
<DragProvider labels={labels} onMove={(itemId, from, to) => move(itemId, to)} canDrop={canDrop} renderOverlay={(id) => <Card id={id} />}>
  <DropList id="open">
    {({ isOver }) => (
      <DragItem id="42" accessibilityLabel={name} accessibilityHint={hint} canDrag={isOpen}>
        {({ isDragging }) => <Card id="42" dimmed={isDragging} />}
      </DragItem>
    )}
  </DropList>
</DragProvider>
```

| Part | Job |
|---|---|
| `DragProvider` | One drag session. `onMove` fires once, only for a drop on a different list. `canDrop` refuses a list. |
| `DropList` | A list items can land on. |
| `DragItem` | An item. `canDrag={false}` makes it inert. |

`labels` carries every screen-reader string, so the app owns translation; the package ships no text.

Keyboard: Space or Enter picks up, arrows change list, Space or Enter drops, Escape or Tab cancels. Touch: 250 ms long-press, a swipe still scrolls. Reduced motion turns the drop animation off.
