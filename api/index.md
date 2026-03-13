# API Reference

XPR is available for JavaScript, Python, and Go. All runtimes share the same expression language and pass the same conformance test suite.

## Runtimes

| Runtime | Package | Status |
|---|---|---|
| [JavaScript / TypeScript](/api/javascript) | [`@xpr-lang/xpr`](https://www.npmjs.com/package/@xpr-lang/xpr) | ✅ Available |
| [Python](/api/python) | [`xpr-lang`](https://pypi.org/project/xpr-lang/) | ✅ Available |
| [Go](/api/go) | [`github.com/xpr-lang/xpr-go`](https://pkg.go.dev/github.com/xpr-lang/xpr-go) | ✅ Available |

## Common API Shape

All runtimes expose the same conceptual API:

```
engine = new Engine()
result = engine.evaluate(expression, context)
engine.addFunction(name, fn)
```

The method names follow each language's conventions (`evaluate` / `Evaluate`, `addFunction` / `add_function` / `AddFunction`).

## Conformance

All runtimes pass the same [conformance test suite](https://github.com/xpr-lang/xpr/tree/main/conformance) — covering literals, arithmetic, comparison, logic, collections, strings, functions, access patterns, pipe operator, let bindings, spread operator, and all v0.2 methods.
