# Python Runtime

Package: [`xpr-lang`](https://pypi.org/project/xpr-lang/) · [GitHub](https://github.com/xpr-lang/xpr-python) · **v0.3.0**

## Install

```bash
pip install xpr-lang
```

Requires Python 3.10+. Zero runtime dependencies.

## API

### `Xpr()`

Creates a new XPR engine instance.

```python
from xpr import Xpr
engine = Xpr()
```

### `engine.evaluate(expression, context=None)`

Evaluates an XPR expression string against an optional context dict. Returns the result value.

Raises `XprError` if the expression is invalid or a runtime error occurs.

```python
engine.evaluate('1 + 2')
# → 3

engine.evaluate('user["name"] ?? "anonymous"', {'user': {'name': None}})
# → "anonymous"

engine.evaluate('[1,2,3].map(x => x * 2)')
# → [2, 4, 6]

engine.evaluate(
    'items.filter(x => x.active).map(x => x.name)',
    {'items': [{'name': 'a', 'active': True}, {'name': 'b', 'active': False}]}
)
# → ['a']
```

### `engine.add_function(name, fn)`

Registers a custom function that can be called from expressions.

```python
engine.add_function('slugify', lambda s: str(s).lower().replace(' ', '-'))

engine.evaluate('slugify(product.name)', {'product': {'name': 'Hello World'}})
# → 'hello-world'
```

### `XprError`

Raised on parse errors and runtime errors. Has a `position` attribute (character offset).

```python
from xpr import Xpr, XprError

try:
    engine.evaluate('1 / 0')
except XprError as e:
    print(e)  # "Division by zero"
    print(e.position)  # character offset
```

## Type Notes

- Numbers are always `float` internally (e.g. `1 + 2` returns `3.0`)
- `null` in XPR maps to `None` in Python
- Arrays map to `list`, objects map to `dict`
- Arrow functions become Python callables

## v0.2 Features

### Let Bindings

```python
engine.evaluate('let x = 1; let y = x + 1; y')
# → 2.0

engine.evaluate('let f = (x) => x * 2; f(5)')
# → 10.0

engine.evaluate('let items = [1,2,3,4,5]; items.filter(x => x > 2).map(x => x * 10)')
# → [30.0, 40.0, 50.0]
```

### Spread Operator

```python
engine.evaluate('[...[1,2], ...[3,4]]')
# → [1.0, 2.0, 3.0, 4.0]

engine.evaluate('{...defaults, ...overrides}', {
    'defaults': {'color': 'blue', 'size': 10},
    'overrides': {'color': 'red'},
})
# → {'color': 'red', 'size': 10.0}
```

### New Array Methods

```python
engine.evaluate('[1,2,3].includes(2)')          # → True
engine.evaluate('[1,2,3].indexOf(2)')           # → 1.0
engine.evaluate('[1,2,3,4,5].slice(1, 3)')      # → [2.0, 3.0]
engine.evaluate('[1,2,3].join(", ")')           # → "1, 2, 3"
engine.evaluate('[1,2].concat([3,4])')          # → [1.0, 2.0, 3.0, 4.0]
engine.evaluate('[[1,2],[3,4]].flat()')         # → [1.0, 2.0, 3.0, 4.0]
engine.evaluate('[1,2,1,3].unique()')           # → [1.0, 2.0, 3.0]
engine.evaluate('[1,2,3].zip([4,5,6])')         # → [[1.0,4.0],[2.0,5.0],[3.0,6.0]]
engine.evaluate('[1,2,3,4,5].chunk(2)')         # → [[1.0,2.0],[3.0,4.0],[5.0]]
engine.evaluate('[1,2,3].groupBy(x => x > 1 ? "big" : "small")')
# → {'big': [2.0, 3.0], 'small': [1.0]}
```

### New String Methods

```python
engine.evaluate('"hello".indexOf("ll")')        # → 2.0
engine.evaluate('"ab".repeat(3)')               # → "ababab"
engine.evaluate('"  hi  ".trimStart()')         # → "hi  "
engine.evaluate('"  hi  ".trimEnd()')           # → "  hi"
engine.evaluate('"hello".charAt(1)')            # → "e"
engine.evaluate('"42".padStart(5, "0")')        # → "00042"
engine.evaluate('"hi".padEnd(5, ".")')          # → "hi..."
```

### New Object Methods

```python
engine.evaluate('{"b": 2, "a": 1}.entries()')  # → [["a", 1.0], ["b", 2.0]]
engine.evaluate('{"a": 1}.has("a")')            # → True
engine.evaluate('{"a": 1}.has("b")')            # → False
```

### range() Function

```python
engine.evaluate('range(5)')           # → [0.0, 1.0, 2.0, 3.0, 4.0]
engine.evaluate('range(1, 5)')        # → [1.0, 2.0, 3.0, 4.0]
engine.evaluate('range(0, 10, 2)')    # → [0.0, 2.0, 4.0, 6.0, 8.0]
engine.evaluate('range(5, 0, -1)')    # → [5.0, 4.0, 3.0, 2.0, 1.0]
```
