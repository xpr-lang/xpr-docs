# JavaScript Runtime

Package: [`@xpr-lang/xpr`](https://www.npmjs.com/package/@xpr-lang/xpr) · [GitHub](https://github.com/xpr-lang/xpr-js) · **v0.3.0**

## Install

```bash
npm install @xpr-lang/xpr
# or
bun add @xpr-lang/xpr
```

## API

### `new Xpr()`

Creates a new XPR engine instance.

```typescript
import { Xpr } from '@xpr-lang/xpr';
const engine = new Xpr();
```

### `engine.evaluate(expression, context?)`

Evaluates an XPR expression string against an optional context object. Returns the result value.

Throws `XprError` if the expression is invalid or a runtime error occurs.

```typescript
engine.evaluate('1 + 2')
// → 3

engine.evaluate('user.name ?? "anonymous"', { user: { name: null } })
// → "anonymous"

engine.evaluate('[1,2,3].map(x => x * 2)')
// → [2, 4, 6]

engine.evaluate('items.filter(x => x.active).map(x => x.name)', {
  items: [
    { name: 'a', active: true },
    { name: 'b', active: false },
  ]
})
// → ['a']
```

### `engine.addFunction(name, fn)`

Registers a custom function that can be called from expressions.

```typescript
engine.addFunction('slugify', (s: unknown) =>
  String(s).toLowerCase().replace(/\s+/g, '-')
);

engine.evaluate('slugify(product.name)', { product: { name: 'Hello World' } })
// → 'hello-world'
```

### `XprError`

Thrown on parse errors and runtime errors. Has a `position` property (character offset).

```typescript
import { Xpr, XprError } from '@xpr-lang/xpr';

try {
  engine.evaluate('1 / 0');
} catch (e) {
  if (e instanceof XprError) {
    console.error(e.message); // "Division by zero"
  }
}
```

## TypeScript

The package ships with full TypeScript declarations.

```typescript
import { Xpr, XprError } from '@xpr-lang/xpr';

const engine = new Xpr();
const result: unknown = engine.evaluate('1 + 2');
```

## v0.2 Features

### Let Bindings

```typescript
engine.evaluate('let x = 1; let y = x + 1; y')
// → 2

engine.evaluate('let f = (x) => x * 2; f(5)')
// → 10

engine.evaluate('let items = [1,2,3,4,5]; items.filter(x => x > 2).map(x => x * 10)')
// → [30, 40, 50]
```

### Spread Operator

```typescript
engine.evaluate('[...[1,2], ...[3,4]]')
// → [1, 2, 3, 4]

engine.evaluate('{...defaults, ...overrides}', {
  defaults: { color: 'blue', size: 10 },
  overrides: { color: 'red' },
})
// → { color: 'red', size: 10 }
```

### New Array Methods

```typescript
engine.evaluate('[1,2,3].includes(2)')          // → true
engine.evaluate('[1,2,3].indexOf(2)')           // → 1
engine.evaluate('[1,2,3,4,5].slice(1, 3)')      // → [2, 3]
engine.evaluate('[1,2,3].join(", ")')           // → "1, 2, 3"
engine.evaluate('[1,2].concat([3,4])')          // → [1, 2, 3, 4]
engine.evaluate('[[1,2],[3,4]].flat()')         // → [1, 2, 3, 4]
engine.evaluate('[1,2,1,3].unique()')           // → [1, 2, 3]
engine.evaluate('[1,2,3].zip([4,5,6])')         // → [[1,4],[2,5],[3,6]]
engine.evaluate('[1,2,3,4,5].chunk(2)')         // → [[1,2],[3,4],[5]]
engine.evaluate('[1,2,3].groupBy(x => x > 1 ? "big" : "small")')
// → { big: [2, 3], small: [1] }
```

### New String Methods

```typescript
engine.evaluate('"hello".indexOf("ll")')        // → 2
engine.evaluate('"ab".repeat(3)')               // → "ababab"
engine.evaluate('"  hi  ".trimStart()')         // → "hi  "
engine.evaluate('"  hi  ".trimEnd()')           // → "  hi"
engine.evaluate('"hello".charAt(1)')            // → "e"
engine.evaluate('"42".padStart(5, "0")')        // → "00042"
engine.evaluate('"hi".padEnd(5, ".")')          // → "hi..."
```

### New Object Methods

```typescript
engine.evaluate('{"b": 2, "a": 1}.entries()')  // → [["a",1],["b",2]]
engine.evaluate('{"a": 1}.has("a")')            // → true
engine.evaluate('{"a": 1}.has("b")')            // → false
```

### range() Function

```typescript
engine.evaluate('range(5)')           // → [0, 1, 2, 3, 4]
engine.evaluate('range(1, 5)')        // → [1, 2, 3, 4]
engine.evaluate('range(0, 10, 2)')    // → [0, 2, 4, 6, 8]
engine.evaluate('range(5, 0, -1)')    // → [5, 4, 3, 2, 1]
```
