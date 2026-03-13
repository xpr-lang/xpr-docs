# Go Runtime

Module: [`github.com/xpr-lang/xpr-go`](https://pkg.go.dev/github.com/xpr-lang/xpr-go) · [GitHub](https://github.com/xpr-lang/xpr-go) · **v0.2.0**

## Install

```bash
go get github.com/xpr-lang/xpr-go
```

Requires Go 1.21+. Zero runtime dependencies.

## API

### `xpr.New()`

Creates a new XPR engine instance.

```go
import xpr "github.com/xpr-lang/xpr-go"

engine := xpr.New()
```

### `engine.Evaluate(expression string, context map[string]any) (any, error)`

Evaluates an XPR expression string against an optional context map. Returns the result value or an error.

```go
result, err := engine.Evaluate("1 + 2", nil)
// result → float64(3)

result, err = engine.Evaluate(
    `user["name"] ?? "anonymous"`,
    map[string]any{"user": map[string]any{"name": nil}},
)
// result → "anonymous"

result, err = engine.Evaluate("[1,2,3].map(x => x * 2)", nil)
// result → []any{float64(2), float64(4), float64(6)}

result, err = engine.Evaluate(
    "items.filter(x => x.active).map(x => x.name)",
    map[string]any{
        "items": []any{
            map[string]any{"name": "a", "active": true},
            map[string]any{"name": "b", "active": false},
        },
    },
)
// result → []any{"a"}
```

### `engine.AddFunction(name string, fn func(...any) (any, error))`

Registers a custom function that can be called from expressions.

```go
engine.AddFunction("slugify", func(args ...any) (any, error) {
    s := strings.ToLower(fmt.Sprintf("%v", args[0]))
    return strings.ReplaceAll(s, " ", "-"), nil
})

result, _ := engine.Evaluate(
    "slugify(product.name)",
    map[string]any{"product": map[string]any{"name": "Hello World"}},
)
// result → "hello-world"
```

## Type Mapping

| XPR type | Go type |
|---|---|
| number | `float64` |
| string | `string` |
| boolean | `bool` |
| null | `nil` |
| array | `[]interface{}` |
| object | `map[string]interface{}` |
| function | internal `xprFunc` |

## Error Handling

All errors are returned as the second return value. There is no panic.

```go
result, err := engine.Evaluate("1 / 0", nil)
if err != nil {
    fmt.Println(err) // "division by zero"
}
```

## v0.2 Features

### Let Bindings

```go
result, _ := engine.Evaluate("let x = 1; let y = x + 1; y", nil)
// result → float64(2)

result, _ = engine.Evaluate("let f = (x) => x * 2; f(5)", nil)
// result → float64(10)

result, _ = engine.Evaluate(
    "let items = [1,2,3,4,5]; items.filter(x => x > 2).map(x => x * 10)",
    nil,
)
// result → []any{float64(30), float64(40), float64(50)}
```

### Spread Operator

```go
result, _ := engine.Evaluate("[...[1,2], ...[3,4]]", nil)
// result → []any{float64(1), float64(2), float64(3), float64(4)}

result, _ = engine.Evaluate("{...defaults, ...overrides}", map[string]any{
    "defaults": map[string]any{"color": "blue", "size": float64(10)},
    "overrides": map[string]any{"color": "red"},
})
// result → map[string]any{"color": "red", "size": float64(10)}
```

### New Array Methods

```go
engine.Evaluate("[1,2,3].includes(2)", nil)          // → true
engine.Evaluate("[1,2,3].indexOf(2)", nil)           // → float64(1)
engine.Evaluate("[1,2,3,4,5].slice(1, 3)", nil)      // → []any{float64(2), float64(3)}
engine.Evaluate(`[1,2,3].join(", ")`, nil)           // → "1, 2, 3"
engine.Evaluate("[1,2].concat([3,4])", nil)          // → []any{1,2,3,4}
engine.Evaluate("[[1,2],[3,4]].flat()", nil)         // → []any{1,2,3,4}
engine.Evaluate("[1,2,1,3].unique()", nil)           // → []any{1,2,3}
engine.Evaluate("[1,2,3].zip([4,5,6])", nil)         // → []any{[]any{1,4}, []any{2,5}, []any{3,6}}
engine.Evaluate("[1,2,3,4,5].chunk(2)", nil)         // → []any{[]any{1,2}, []any{3,4}, []any{5}}
engine.Evaluate(`[1,2,3].groupBy(x => x > 1 ? "big" : "small")`, nil)
// → map[string]any{"big": []any{2,3}, "small": []any{1}}
```

### New String Methods

```go
engine.Evaluate(`"hello".indexOf("ll")`, nil)        // → float64(2)
engine.Evaluate(`"ab".repeat(3)`, nil)               // → "ababab"
engine.Evaluate(`"  hi  ".trimStart()`, nil)         // → "hi  "
engine.Evaluate(`"  hi  ".trimEnd()`, nil)           // → "  hi"
engine.Evaluate(`"hello".charAt(1)`, nil)            // → "e"
engine.Evaluate(`"42".padStart(5, "0")`, nil)        // → "00042"
engine.Evaluate(`"hi".padEnd(5, ".")`, nil)          // → "hi..."
```

### New Object Methods

```go
engine.Evaluate(`{"b": 2, "a": 1}.entries()`, nil)  // → []any{[]any{"a",1}, []any{"b",2}}
engine.Evaluate(`{"a": 1}.has("a")`, nil)            // → true
engine.Evaluate(`{"a": 1}.has("b")`, nil)            // → false
```

### range() Function

```go
engine.Evaluate("range(5)", nil)           // → []any{0,1,2,3,4}
engine.Evaluate("range(1, 5)", nil)        // → []any{1,2,3,4}
engine.Evaluate("range(0, 10, 2)", nil)    // → []any{0,2,4,6,8}
engine.Evaluate("range(5, 0, -1)", nil)    // → []any{5,4,3,2,1}
```
