# Go Runtime

Module: [`github.com/xpr-lang/xpr-go`](https://pkg.go.dev/github.com/xpr-lang/xpr-go) · [GitHub](https://github.com/xpr-lang/xpr-go)

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
