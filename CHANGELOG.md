# Changelog

## 0.1.2

- DragItem renders with role `group`, draggable or not, so it is never a native button around the card's own buttons.
- Over a refused list the pointer no longer selects the allowed neighbour; the overlap fallback is keyboard-only.

## 0.1.1

- DragItem takes `accessibilityHint`, exposed as `aria-description` on the element carrying the label.

## 0.1.0

- First release: DragProvider, DropList, DragItem.
