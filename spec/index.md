# Language Specification

XPR is a sandboxed expression language with JS/Python-familiar syntax, designed for data pipeline transforms.

## Literals

```javascript
42          // integer
3.14        // float
"hello"     // string (double or single quotes)
true        // boolean
null        // null
[1, 2, 3]   // array
{"key": "value"}  // object
```

## Operators

```javascript
// Arithmetic
+  -  *  /  %  **

// Comparison
==  !=  <  >  <=  >=

// Logical
&&  ||  !

// Nullish coalescing
??

// Ternary
age >= 18 ? "adult" : "minor"
```

## Access

```javascript
user.name           // dot access
user["name"]        // bracket access
users[0]            // array index
user?.address?.city // optional chaining (returns null if any step is null)
```

## Arrow Functions

```javascript
x => x * 2
(x, y) => x + y
() => 42
```

## Collection Operations

```javascript
items.map(x => x.price * x.qty)
items.filter(x => x.active && x.price > 10)
items.reduce((sum, x) => sum + x, 0)
items.find(x => x.id == targetId)
items.some(x => x.price > 100)
items.every(x => x.active)
items.flatMap(x => x.tags)
items.sort((a, b) => a.price - b.price)
items.reverse()
items.length
```

## String Operations

```javascript
name.upper()
name.lower()
name.trim()
name.len()
name.startsWith("Dr.")
name.endsWith("!")
name.contains("admin")
name.split(",")
name.replace("old", "new")
name.slice(0, 5)
```

## Template Literals

```javascript
`Hello ${name}, you have ${count} items`
```

## Math Functions

```javascript
round(3.7)   // → 4
floor(3.7)   // → 3
ceil(3.2)    // → 4
abs(-5)      // → 5
min(a, b)
max(a, b)
```

## Type Functions

```javascript
type(value)    // "null" | "boolean" | "number" | "string" | "array" | "object"
int("42")      // → 42
float("3.14")  // → 3.14
string(42)     // → "42"
bool(1)        // → true
```

## Object Operations

```javascript
{"a": 1, "b": 2}.keys()    // → ["a", "b"]
{"a": 1, "b": 2}.values()  // → [1, 2]
```

## Pipe Operator

Sugar for chaining transforms — the left side becomes the first argument:

```javascript
data |> filter(x => x.active) |> map(x => x.name) |> sort()
```

## Truthiness

The following values are **falsy**: `false`, `null`, `0`, `""`

Everything else is truthy.

## Nullish Coalescing

`??` returns the right side only when the left side is `null` (not `false` or `0`):

```javascript
user.name ?? "anonymous"   // "anonymous" only if name is null
count ?? 0                 // 0 only if count is null
```

## Security

- No access to host filesystem, network, or environment variables
- Context is read-only — expressions cannot mutate input
- No `eval`, no dynamic code construction
- Blocked properties: `__proto__`, `constructor`, `prototype`
- Expression timeout: 100ms (configurable)
- Max AST depth: 50

## What's Not Supported (v1)

- `while` loops, `class`, I/O, imports
- `let` / `var` bindings
- Destructuring
- Pattern matching
- Async expressions

## Conformance Tests

The test suite is the authoritative spec. All runtimes must pass all 156 tests.

[View conformance tests on GitHub](https://github.com/xpr-lang/xpr/tree/main/conformance)
