# Getting Started

XPR is a safe, sandboxed expression language for evaluating user-defined expressions against structured data. It runs identically in JavaScript, Python, and Go.

## What is XPR?

XPR lets you evaluate expressions like:

```
items.filter(x => x.price > threshold).map(x => x.name)
```

against a context object you provide — safely, with no access to the host environment.

**Use cases:**
- Dynamic business rules in data pipelines
- User-configurable filters and transforms
- Safe formula evaluation in multi-tenant apps

## Install

::: code-group

```bash [JavaScript (npm)]
npm install @xpr-lang/xpr
```

```bash [JavaScript (bun)]
bun add @xpr-lang/xpr
```

```bash [Python]
pip install xpr-lang
```

```bash [Go]
go get github.com/xpr-lang/xpr-go
```

:::

## Quick Start

::: code-group

```typescript [JavaScript]
import { Xpr } from '@xpr-lang/xpr';

const engine = new Xpr();

const result = engine.evaluate(
  'items.filter(x => x.price > threshold).map(x => x.name)',
  {
    items: [
      { name: 'Widget', price: 99 },
      { name: 'Gadget', price: 25 },
    ],
    threshold: 50,
  }
);
// → ['Widget']
```

```python [Python]
from xpr import Xpr

engine = Xpr()

result = engine.evaluate(
    'items.filter(x => x.price > threshold).map(x => x.name)',
    {
        'items': [
            {'name': 'Widget', 'price': 99},
            {'name': 'Gadget', 'price': 25},
        ],
        'threshold': 50,
    }
)
# → ['Widget']
```

```go [Go]
import xpr "github.com/xpr-lang/xpr-go"

engine := xpr.New()

result, err := engine.Evaluate(
    `items.filter(x => x.price > threshold).map(x => x.name)`,
    map[string]any{
        "items": []any{
            map[string]any{"name": "Widget", "price": 99},
            map[string]any{"name": "Gadget", "price": 25},
        },
        "threshold": 50,
    },
)
// → ["Widget"]
```

:::

## Custom Functions

Register domain-specific functions that expressions can call:

::: code-group

```typescript [JavaScript]
engine.addFunction('slugify', (s) => s.toLowerCase().replace(/ /g, '-'));
// Now usable: slugify(product.name)
```

```python [Python]
engine.add_function('slugify', lambda s: s.lower().replace(' ', '-'))
# Now usable: slugify(product.name)
```

```go [Go]
engine.AddFunction("slugify", func(args ...any) (any, error) {
    s := args[0].(string)
    return strings.ReplaceAll(strings.ToLower(s), " ", "-"), nil
})
// Now usable: slugify(product.name)
```

:::

## Security

XPR is designed to be safe by default:

- **No side effects** — expressions cannot mutate the context
- **No host access** — no filesystem, network, or environment variables
- **Prototype blocking** — `__proto__`, `constructor`, etc. are blocked
- **Depth limit** — max AST depth of 50 prevents stack overflow
- **Timeout** — expressions are killed after 100ms by default

## Next Steps

- [Language Specification](/spec/) — full syntax reference
- [JavaScript API](/api/javascript)
- [Python API](/api/python)
- [Go API](/api/go)
