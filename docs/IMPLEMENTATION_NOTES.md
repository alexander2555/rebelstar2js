# Implementation notes

## Cursor versus movement

The original control model distinguishes cursor/navigation from selecting a unit and then acting with that unit. Do not make QWE/AD/ZXC always move the selected unit. Implement the correct mode-specific semantics once verified.

## Data provenance

Use fields such as:

```json
{
  "value": 4,
  "source": "manual/page-or-reference",
  "confidence": "VERIFIED"
}
```

for values that matter to compatibility.

## Replay

Store:
- seed
- initial state hash
- command sequence
- resulting state hashes

This permits regression testing without screenshots.

## Rendering

Renderer receives state and draws it. Renderer must not decide whether a shot hits, whether movement is legal, or whether a mission is won.
