# Getting Started

> 🚧 **Coming Soon** — Documentation is being written.

XPR is a safe, sandboxed expression language for evaluating user-defined expressions against structured data.

## Quick Install

```bash
bun add @xpr-lang/xpr
# or
npm install @xpr-lang/xpr
```

## Quick Start

```typescript
import { Xpr } from '@xpr-lang/xpr';

const engine = new Xpr();
const result = engine.evaluate(
  'items.filter(x => x.price > 50).map(x => x.name)',
  { items: [{ name: 'Widget', price: 99 }, { name: 'Gadget', price: 25 }] }
);
// → ['Widget']
```

Full documentation coming soon. See the [specification](/spec/) for language details.
