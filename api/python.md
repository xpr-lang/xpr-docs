# Python Runtime

Package: [`xpr-lang`](https://pypi.org/project/xpr-lang/) · [GitHub](https://github.com/xpr-lang/xpr-python)

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
