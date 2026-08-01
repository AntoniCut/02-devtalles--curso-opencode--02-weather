# AGENTS.md

Weather CLI app (Spanish-language UI). Console app that asks for a city and reports current weather. Final deliverable is a compiled executable binary.

## Runtime & toolchain

- Runtime is **Bun**, not Node. Use `bun` for everything: `bun install`, `bun run src/index.ts`, `bunx tsc --noEmit`.
- `package.json` scripts: `start`, `dev`, `typecheck`, `build`.
- `bun-instructions.md` is an empty placeholder; don't expect guidance there.

## TypeScript constraints (tsconfig.json)

- `noEmit: true` — `tsc` is typecheck-only. Don't try to build with `tsc`; use `bun build`.
- `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- `allowImportingTsExtensions: true` — imports may include the `.ts` extension.
- `noUncheckedIndexedAccess: true` — indexing a record/array yields `T | undefined`.
- `strict: true` plus `noFallthroughCasesInSwitch` and `noImplicitOverride`.

## Build

- Produce the executable with `bun build --compile ./src/index.ts --outfile out/weather` (or `bun run build`). `out/` and `dist/` are gitignored.
- Entry point is `src/index.ts` (`package.json` `module` field).

## Project structure

```
src/
├── actions/          # User-facing operations (getWeather, addCity, etc.)
├── presentation/     # CLI menu, input, output
├── storage/          # citiesStorage, settingsStorage
├── types/            # City, Weather, Settings, Geocoding, MenuOption
├── api/              # geocoding, weather (OpenMeteo)
├── utils/            # colors, format, constants
└── index.ts          # Entry point
```

## Testing

- No test runner / fixtures are configured yet. `bun test` will pick up `*.test.ts` files once added.

## App data flow

No API key or `.env` required. Two OpenMeteo HTTP calls, in order:
1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=5&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m,...`

Data persisted at `~/.config/weather-cli/data.json` (migrated from legacy `~/.weather-cli/data.json`).

## Conventions

- Default branch is `master` (not `main`).
- README is in Spanish; the CLI menu strings are Spanish — keep new user-facing strings in Spanish to match.
