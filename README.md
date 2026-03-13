# xpr-docs — XPR Language Documentation

[![CI](https://github.com/xpr-lang/xpr-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/xpr-lang/xpr-docs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Documentation site for the XPR expression language, built with VitePress.

## Running Locally

```bash
bun install
bun run docs:dev
```

Then open http://localhost:5173.

## Building

```bash
bun run docs:build
```

Output goes to `.vitepress/dist/`.

## Site Structure

- **spec/** — Language specification and syntax reference
- **api/** — Runtime API documentation for JavaScript, Python, and Go
- **guide/** — Getting started guide and tutorials

## Related Repos

- [xpr-lang/xpr](https://github.com/xpr-lang/xpr) — Language specification
- [xpr-lang/xpr-js](https://github.com/xpr-lang/xpr-js) — JavaScript runtime
- [xpr-lang/xpr-python](https://github.com/xpr-lang/xpr-python) — Python runtime
- [xpr-lang/xpr-go](https://github.com/xpr-lang/xpr-go) — Go runtime
- [xpr-lang/xpr-playground](https://github.com/xpr-lang/xpr-playground) — Interactive playground

## License

MIT — see [LICENSE](LICENSE)
