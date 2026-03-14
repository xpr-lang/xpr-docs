# Language Specification

> This page covers XPR v0.3

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

## Date/Time Functions (v0.3)

Dates are **epoch milliseconds** (number type). All operations are UTC. No separate `date` type.

| Function | Signature | Returns |
|----------|-----------|---------|
| `now()` | `() → number` | Current UTC timestamp (epoch ms) |
| `parseDate(str, format?)` | `(string, string?) → number` | Epoch ms. Default: ISO 8601. Custom: ICU tokens. |
| `formatDate(date, format)` | `(number, string) → string` | Formatted date string |
| `year(date)` | `(number) → number` | Year (e.g., 2024) |
| `month(date)` | `(number) → number` | Month 1–12 |
| `day(date)` | `(number) → number` | Day 1–31 |
| `hour(date)` | `(number) → number` | Hour 0–23 |
| `minute(date)` | `(number) → number` | Minute 0–59 |
| `second(date)` | `(number) → number` | Second 0–59 |
| `millisecond(date)` | `(number) → number` | Millisecond 0–999 |
| `dateAdd(date, amount, unit)` | `(number, number, string) → number` | Add/subtract time |
| `dateDiff(date1, date2, unit)` | `(number, number, string) → number` | Signed difference |

**Format tokens**: `yyyy`, `MM`, `dd`, `HH`, `mm`, `ss`, `SSS`

**Units**: `"years"`, `"months"`, `"days"`, `"hours"`, `"minutes"`, `"seconds"`, `"milliseconds"`

```javascript
parseDate("2024-01-15T12:00:00Z")                    // 1705320000000
formatDate(0, "yyyy-MM-dd")                           // "1970-01-01"
year(parseDate("2024-06-15T10:30:00Z"))               // 2024
dateAdd(parseDate("2024-01-15T00:00:00Z"), 7, "days") // epoch ms for 2024-01-22
dateDiff(parseDate("2024-01-01T00:00:00Z"), parseDate("2024-01-08T00:00:00Z"), "days")  // 7
```

## Regex Functions (v0.3)

Function-based regex using **RE2 flavor**. No literal syntax. Inline flags via `(?i)` etc.

| Function | Signature | Returns |
|----------|-----------|---------|
| `matches(str, pattern)` | `(string, string) → boolean` | True if pattern found in string |
| `match(str, pattern)` | `(string, string) → string \| null` | First match or null |
| `matchAll(str, pattern)` | `(string, string) → array` | All matches as strings |
| `replacePattern(str, pattern, replacement)` | `(string, string, string) → string` | Replace all matches |

```javascript
matches("hello 42", "\\d+")                                              // true
matches("Hello", "(?i)hello")                                            // true
match("order-123", "\\d+")                                               // "123"
matchAll("a1b2c3", "\\d+")                                               // ["1", "2", "3"]
replacePattern("2024-01-15", "(\\d{4})-(\\d{2})-(\\d{2})", "$3/$2/$1")  // "15/01/2024"
```

## Negative Array Indexing (v0.3)

Arrays support negative indexing: `items[-1]` returns the last element.

```javascript
[1, 2, 3][-1]   // 3 (last element)
[1, 2, 3][-2]   // 2 (second-to-last)
[][- 1]          // null (out of bounds)
```

## Spread in Function Calls (v0.3)

The spread operator works in function call arguments:

```javascript
max(...[1, 5, 3, 2, 4])     // 5
fn(a, ...rest)               // mix regular and spread args
```

## What's Not Supported

- `while` loops, `class`, I/O, imports
- Variable reassignment (`const`, `var`) — use immutable `let` bindings instead
- Destructuring
- Pattern matching
- Async expressions

## Conformance Tests

The test suite is the authoritative spec. All runtimes must pass all conformance tests.

[View conformance tests on GitHub](https://github.com/xpr-lang/xpr/tree/main/conformance)
