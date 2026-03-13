# Language Specification

> This page covers XPR v0.2

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

Arrow functions are first-class values in XPR — they can be stored in `let` bindings and passed to higher-order methods.

```javascript
x => x * 2
(x, y) => x + y
() => 42
```

## Let Bindings

`let` creates an immutable binding scoped to the rest of the expression. Multiple bindings are chained with semicolons; the final expression (after the last `;`) is the result.

```javascript
let x = 1; x + 1                          // → 2
let x = 1; let y = x + 1; y               // → 2
let name = "world"; `hello ${name}`        // → "hello world"
let f = (x) => x * 2; f(5)                // → 10
let a = 10; let f = (x) => x + a; f(5)    // → 15
let items = [1,2,3,4,5]; items.filter(x => x > 2).map(x => x * 10)  // → [30,40,50]
```

**Scoping rules:**
- Bindings are immutable — no reassignment
- Shadowing is allowed: `let x = 1; let x = 2; x` → `2`
- Forward references work: each binding sees all previous bindings
- Arrow functions close over `let` bindings

**Errors:**
- `let x = 1;` (no body after semicolon) → error: "Expected expression after ';'"
- `let = 1; 2` (missing name) → error

## Spread Operator

### Array Spread

```javascript
[...[1,2], 3, 4]          // → [1,2,3,4]
[...[1,2], ...[3,4]]      // → [1,2,3,4]
[0, ...[1,2]]             // → [0,1,2]
[...[]]                   // → []
```

**Errors:**
- `[...42]` → "Cannot spread non-array into array"
- `[...null]` → "Cannot spread null"
- `[..."hello"]` → "Cannot spread string into array"

### Object Spread

```javascript
{...{"a": 1, "b": 2}}              // → {"a": 1, "b": 2}
{...{"a": 1}, "a": 2}              // → {"a": 2}  (override)
{...{"a": 1}, ...{"b": 2}}         // → {"a": 1, "b": 2}
{...user, "role": "admin"}         // merge user object, add role
```

**Errors:**
- `{...42}` → "Cannot spread non-object"
- `{...null}` → "Cannot spread null"
- `{...[1,2]}` → "Cannot spread array into object"

**Note:** Spread in function call arguments (`fn(...args)`) is not supported.

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

// v0.2 additions
items.includes(value)          // → boolean (strict equality)
items.indexOf(value)           // → number (-1 if not found)
items.slice(1, 3)              // → array (same semantics as string slice)
items.join(", ")               // → string
items.concat(other)            // → new array
items.flat()                   // → array (one level deep)
items.unique()                 // → array (preserves first occurrence)
a.zip(b)                       // → array of [a[i], b[i]] pairs (truncates to shortest)
items.chunk(2)                 // → array of arrays (last chunk may be smaller)
items.groupBy(x => x.type)    // → object (keys alphabetical, values are arrays)
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

// v0.2 additions
name.indexOf("el")             // → number (-1 if not found)
name.repeat(3)                 // → string (n must be non-negative integer)
name.trimStart()               // → string (removes leading whitespace)
name.trimEnd()                 // → string (removes trailing whitespace)
name.charAt(0)                 // → string (single char; "" if out of bounds)
name.padStart(5, "0")          // → string (pads start to length n; default pad char " ")
name.padEnd(5, ".")            // → string (pads end to length n; default pad char " ")
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

// v0.2 addition
range(5)           // → [0,1,2,3,4]
range(1, 5)        // → [1,2,3,4]
range(0, 10, 2)    // → [0,2,4,6,8]
range(5, 0, -1)    // → [5,4,3,2,1]
// Float step → error. Empty range if start ≥ end with positive step.
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

// v0.2 additions
{"a": 1, "b": 2}.entries()  // → [["a",1],["b",2]] (alphabetical key order)
{"a": 1, "b": 2}.has("a")   // → true
{"a": 1, "b": 2}.has("c")   // → false
```

## Pipe Operator

Sugar for chaining transforms — the left side becomes the first argument:

```javascript
data |> filter(x => x.active) |> map(x => x.name) |> sort()

// Works with let bindings too
let data = [1,2,3]; data |> map(x => x * 2)   // → [2,4,6]
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

## What's Not Supported

- `while` loops, `class`, I/O, imports
- Variable reassignment (`const`, `var`) — use immutable `let` bindings instead
- Destructuring
- Pattern matching
- Async expressions
- Spread in function call arguments (`fn(...args)`)

## Conformance Tests

The test suite is the authoritative spec. All runtimes must pass all conformance tests.

[View conformance tests on GitHub](https://github.com/xpr-lang/xpr/tree/main/conformance)
