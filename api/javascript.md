# JavaScript Runtime

Package: [`@xpr-lang/xpr`](https://www.npmjs.com/package/@xpr-lang/xpr) · [GitHub](https://github.com/xpr-lang/xpr-js)

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
