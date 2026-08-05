# PLAN — Weather CLI

## Objetivo

Crear una aplicación de consola en **Bun + TypeScript** que permita consultar el clima actual de ciudades, guardar una lista de ciudades favoritas, establecer una ciudad por defecto, alternar unidades °C/°F, y obtener un **pronóstico de 7 días**. La UI se muestra con **colores ANSI** (cyan, amarillo bold, verde, rojo, dim) y respeta `NO_COLOR` / detección de TTY. El resultado final es un **binario ejecutable** compilado con `bun build --compile`, y el build está **protegido por tests**: no se compila si los tests fallan.

## Stack

- Runtime: **Bun** (no Node)
- Lenguaje: TypeScript (strict)
- Test runner: `bun:test` (nativo, sin dependencias externas)
- APIs: OpenMeteo (Geocoding + Forecast, sin API key)
- Persistencia: JSON en `$XDG_CONFIG_HOME/weather-cli/data.json` (default `~/.config/weather-cli/`), con migración desde la ruta legacy `~/.weather-cli/data.json`
- Sin dependencias externas (solo `fetch` nativo de Bun y APIs de Node vía Bun)

## Menú (numeración exacta del README)

```
═════════════════════════════════════════
         WEATHER CLI
═════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (N)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días
  7. Not Found - Implementar en el futuro  (placeholder dim)
  8. Ajustes (°C)
  9. Salir
═════════════════════════════════════════
  Selecciona una opción:
```

## Estructura de archivos

```
opencode.json                       → config de opencode (raíz)
package.json                        → scripts: dev, typecheck, test, build (con gate)
tsconfig.json                       → strict, noEmit, verbatimModuleSyntax, noUncheckedIndexedAccess
src/
├── index.ts                        → Entry point, invoca runMenu()
├── actions/                        → Orquestadores de opciones del menú
│   ├── getWeather.ts               → getDefaultCityWeather, getAllCitiesWeather, buildWeatherInfo, buildWeeklyForecast
│   ├── addCity.ts                  → addCityAction
│   ├── removeCity.ts               → removeCityAction
│   ├── setDefaultCity.ts           → setDefaultCityAction
│   ├── listCities.ts               → listCities, promptCitySelection, requireSavedCities, getDefaultCity
│   ├── getWeeklyForecast.ts        → getWeeklyForecastAction
│   └── toggleSettings.ts           → toggleSettingsAction
├── presentation/                   → Interacción de consola/CLI
│   ├── menu.ts                     → runMenu (bucle, dispatch por opción, guard TTY)
│   ├── output.ts                   → Funciones de impresión con colores (printWeather, printWeeklyForecast, etc.)
│   └── input.ts                    → askQuestion, pause, closeInput, parseSelection
├── storage/                        → Capa de datos
│   ├── citiesStorage.ts            → cityIdFromName, findCityById, addCity, removeCity
│   └── settingsStorage.ts          → parseAppData, migrateLegacyData, getDefaultData, loadData, saveData, setDefault, toggleUnit, unitLabel
├── types/                          → Tipos TypeScript
│   ├── City.ts                     → interface City
│   ├── Settings.ts                 → type Unit, interface AppData
│   ├── Geocoding.ts                → GeocodingResult, GeocodingResponse
│   ├── Weather.ts                  → ForecastCurrent/Response, ForecastDaily/DailyForecastResponse, WeatherInfo, DayForecast, WeeklyForecast
│   └── MenuOption.ts               → interface MenuOption
├── api/                            → Integración con APIs externas
│   ├── geocoding.ts                → searchCities
│   └── weather.ts                  → getForecast, getDailyForecast
└── utils/                          → Utilidades y helpers
    ├── constants.ts                → MENU_WIDTH, GEOCODING_URL, FORECAST_URL
    ├── colors.ts                   → colorsEnabled, wrap, cyan, yellow, green, red, bold, dim
    └── format.ts                   → dayNameFromDate, compactDate, formatLocation, unitSymbol, weatherCodeDescription

tests/                              → Tests automáticos (bun:test, sin dependencias)
├── utils/
│   ├── format.test.ts
│   └── colors.test.ts
├── storage/
│   ├── citiesStorage.test.ts
│   └── settingsStorage.test.ts
├── api/
│   ├── geocoding.test.ts
│   └── weather.test.ts
├── actions/
│   └── getWeather.test.ts
└── presentation/
    └── input.test.ts
```

## Funcionalidades por opción

| Opción | Acción |
|--------|--------|
| 1 | Mostrar clima de la ciudad default. Si no hay, indicar que se use la opción 5. |
| 2 | Mostrar clima de todas las ciudades guardadas. El título incluye el contador `(N)`. |
| 3 | Pedir nombre de ciudad → geocoding → mostrar resultados → usuario selecciona → agregar a la lista. |
| 4 | Listar ciudades numeradas → usuario selecciona → eliminar. Si era la default, limpiar default. |
| 5 | Listar ciudades numeradas → usuario selecciona → marcar como default. |
| 6 | Listar ciudades numeradas → usuario selecciona → mostrar tabla de pronóstico 7 días (fecha, día, clima, máx/mín, % lluvia, viento). |
| 7 | Placeholder. |
| 8 | Alternar unidad °C ↔ °F. El menú muestra la unidad actual entre paréntesis. |
| 9 | Salir de la aplicación. |

## Persistencia

**Ubicación:** `$XDG_CONFIG_HOME/weather-cli/data.json` (default `~/.config/weather-cli/data.json`).

**Migración legacy:** si no existe el archivo XDG pero sí `~/.weather-cli/data.json`, se copia el legacy al nuevo en el primer `loadData()`. Falla silenciosa: si la migración falla, se usan valores por defecto.

**Estructura:**
```json
{
  "defaultCityId": "ottawa-45.41117--75.69812",
  "cities": [
    {
      "id": "ottawa-45.41117--75.69812",
      "name": "Ottawa",
      "country": "Canadá",
      "admin1": "Ontario",
      "latitude": 45.41117,
      "longitude": -75.69812
    }
  ],
  "unit": "celsius"
}
```

**Comportamiento:**
- Si el archivo no existe, se usan valores por defecto y se crea al primer guardado.
- Si está corrupto, `parseAppData` tolera el fallo con `?? null` / `Array.isArray` y se reinicia con valores por defecto, avisando al usuario.
- Se guarda después de cada operación que modifique datos (addCity, removeCity, setDefault, toggleUnit).

## APIs

### 1. Geocoding (búsqueda de ciudades)
```
GET https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=5&language=es&format=json
```
Respuesta (recortada):
```json
{ "results": [{ "name": "Ottawa", "latitude": 45.41117, "longitude": -75.69812, "country": "Canadá", "admin1": "Ontario" }] }
```
En error: `{ "error": true, "reason": "..." }`.

### 2. Forecast (clima actual)
```
GET https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=<celsius|fahrenheit>
```
Respuesta:
```json
{ "current": { "temperature_2m": 21.3, "relative_humidity_2m": 55, "apparent_temperature": 22.1, "weather_code": 1, "wind_speed_10m": 12.5 } }
```

### 3. Forecast (pronóstico 7 días)
```
GET https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&forecast_days=7&temperature_unit=<unit>&timezone=auto
```
Respuesta: `daily.{time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max, wind_speed_10m_max}` como arrays paralelos.

## Datos mostrados por ciudad

**Clima actual:**
- Nombre, región (admin1), país
- Temperatura actual con unidad (amarillo bold)
- Sensación térmica
- Humedad relativa (%)
- Velocidad del viento (km/h)
- Descripción legible del código de clima (cyan)

**Pronóstico 7 días:** tabla alineada con Fecha | Día | Clima | Máx | Mín | Lluvia | Viento.

## Manejo de errores

- Red fallida o HTTP no OK → mensaje claro y vuelta al menú.
- Respuesta de error de la API → mostrar `reason`.
- Ciudad no encontrada → mensaje y vuelta al menú.
- No hay ciudades guardadas → mensaje guía hacia la opción 3.
- No hay ciudad default → mensaje guía hacia la opción 5.
- Archivo de datos corrupto → reset a valores por defecto con aviso.
- `process.stdin.isTTY === false` (doble-clic sin terminal) → mensaje y exit 1.

## Colores

`src/utils/colors.ts` envuelve strings con códigos ANSI:

| Color | Uso |
|---|---|
| Cyan | líneas `═`, título, opciones, cabecera de bloques, "Clima de:", descripción del clima, "¡Hasta pronto!" |
| Amarillo bold | temperatura, sensación térmica (el dato clave) |
| Verde | "agregada", "eliminada", "es ahora la ciudad default", "Unidad cambiada" |
| Rojo | "Opción no válida", "Selección inválida", "No se encontró", "No se pudo obtener", `✗` de las APIs, `⚠ Error al guardar` |
| Amarillo | guías ("Usa la opción 5…") y `⚠ Aviso` (datos reseteados) |
| Dim | placeholder opción 7, humedad, viento, "Operación cancelada" |

**Comportamiento:** `colorsEnabled = (isTTY || FORCE_COLOR) && !NO_COLOR`. Si está deshabilitado, las funciones devuelven el string sin escapes. Cumple `NO_COLOR` (desactiva siempre) y soporta `FORCE_COLOR` (fuerza para tests).

## Testing automático (Bun)

Tests en `tests/` con el runner nativo `bun:test` (sin dependencias externas, sin Vitest ni Jest). Se ejecutan con `bun test`.

### Cobertura

| Archivo | Cubre | Mocks |
|---|---|---|
| `tests/utils/format.test.ts` | `dayNameFromDate`, `compactDate`, `formatLocation`, `unitSymbol`, `weatherCodeDescription` | — |
| `tests/utils/colors.test.ts` | `cyan`, `yellow`, `green`, `red`, `bold`, `dim` (devuelven el texto; escapen en TTY/FORCE_COLOR) | — |
| `tests/storage/citiesStorage.test.ts` | `cityIdFromName`, `findCityById`, `addCity` (dedup), `removeCity` (limpia default) | — |
| `tests/storage/settingsStorage.test.ts` | `getDefaultData`, `loadData`, `saveData`, `setDefault`, `toggleUnit`, `unitLabel` | filesystem aislado via `XDG_CONFIG_HOME` + `mkdtempSync` + `await import()` dinámico |
| `tests/api/geocoding.test.ts` | `searchCities`: OK, HTTP error, error API, excepción de red | `globalThis.fetch = mock(...)` |
| `tests/api/weather.test.ts` | `getForecast`, `getDailyForecast`: OK, HTTP error, excepción | `globalThis.fetch = mock(...)` |
| `tests/actions/getWeather.test.ts` | `buildWeatherInfo`, `buildWeeklyForecast` (mapean respuesta API a view-model) | `mock.module` sobre `../src/api/weather.ts` |
| `tests/presentation/input.test.ts` | `parseSelection`: válido, inválido, fuera de rango | — |

### Estrategia de mocks

- **APIs externas**: `globalThis.fetch` se reasigna con `mock()` por test y se restaura en `afterEach`.
- **Módulos**: `mock.module(specifier, factory)` para interceptar imports de `src/api/weather.ts` en tests de actions.
- **Filesystem**: `XDG_CONFIG_HOME` apunta a `mkdtempSync()`; los paths de storage se computan en module-load, así que se usa `await import()` dinámico **después** de setear la env var. `rmSync` en `afterAll`.
- **Funciones puras** (format, colors, citiesStorage, parseSelection): sin mocks.

### Gate de build

`bun build` ejecuta primero `bun test`. Si los tests fallan (exit ≠ 0), el `&&` impide la compilación del binario. **No se construye si los tests fallan.**

```json
"scripts": {
  "dev": "bun run src/index.ts --watch",
  "typecheck": "bunx tsc --noEmit",
  "test": "bun test",
  "build": "bun test && bun build --compile ./src/index.ts --outfile out/weather"
}
```

## Build y verificación

```bash
bun run typecheck    # bunx tsc --noEmit
bun run test         # bun test (debe pasar)
bun run build        # tests + bun build --compile
```

Verificación funcional post-build:
1. `./out/weather` arranca el menú
2. Flujo: buscar Ottawa → agregar → set default → ver clima → pronóstico 7 días → salir

## Convenciones

- TypeScript strict: `import type` para imports de solo tipos, sin `any`, respetar `noUncheckedIndexedAccess`.
- Importaciones locales con extensión `.ts` (permitida por tsconfig).
- **Skills globales aplicadas** (`~/.config/opencode/skills/`): banner `/* ... */` al inicio de cada `.ts` y bloques de comentario de función con el formato de 5 guiones.
- Arrow functions (`const name = (...) => ...`).
- Mensajes de usuario en español.
- Código modular y mantenible, sin dependencias externas.
