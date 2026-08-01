# PLAN — Weather CLI

## Objetivo

Crear una aplicación de consola en **Bun + TypeScript** que permita consultar el clima actual de ciudades, guardar una lista de ciudades favoritas, establecer una ciudad por defecto y alternar unidades °C/°F. El resultado final debe ser un **binario ejecutable** compilado con `bun build --compile`.

## Stack

- Runtime: **Bun** (no Node)
- Lenguaje: TypeScript (strict)
- APIs: OpenMeteo (Geocoding + Forecast), sin API key
- Persistencia: archivo JSON en `~/.weather-cli/data.json`
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
  8. Ajustes (°C)
  9. Salir
═════════════════════════════════════════
  Selecciona una opción:
```

## Estructura de archivos

```
index.ts              → Entry point, invoca runMenu()
src/
  ├── types.ts          → Tipos compartidos
  ├── input.ts          → Helper de entrada por consola (readline)
  ├── weather.ts        → Orquestación: buscar y mostrar clima
  ├── api/
  │   ├── geocoding.ts  → Cliente OpenMeteo Geocoding API
  │   └── forecast.ts   → Cliente OpenMeteo Forecast API + descripciones de weather_code
  ├── storage/
  │   └── store.ts      → Persistencia JSON en ~/.weather-cli/data.json
  └── menu.ts           → Renderizado del menú y manejo de opciones
```

## Funcionalidades por opción

| Opción | Acción |
|--------|--------|
| 1 | Mostrar clima de la ciudad default. Si no hay, indicar que se use la opción 5. |
| 2 | Mostrar clima de todas las ciudades guardadas. El título incluye el contador `(N)`. |
| 3 | Pedir nombre de ciudad → geocoding → mostrar resultados → usuario selecciona → agregar a la lista. |
| 4 | Listar ciudades numeradas → usuario selecciona → eliminar. Si era la default, limpiar default. |
| 5 | Listar ciudades numeradas → usuario selecciona → marcar como default. |
| 8 | Alternar unidad °C ↔ °F. El menú muestra la unidad actual entre paréntesis. |
| 9 | Salir de la aplicación. |

## Persistencia

**Ubicación:** `~/.weather-cli/data.json`

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
- Si está corrupto, se reinicia con valores por defecto y se avisa al usuario.
- Se guarda después de cada operación que modifique datos.

## APIs

### 1. Geocoding (búsqueda de ciudades)
```
GET https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=5&language=es&format=json
```
Respuesta esperada (recortada):
```json
{
  "results": [
    {
      "name": "Ottawa",
      "latitude": 45.41117,
      "longitude": -75.69812,
      "country": "Canadá",
      "admin1": "Ontario"
    }
  ]
}
```
En caso de error la API responde `{ "error": true, "reason": "..." }`.

### 2. Forecast (clima actual)
```
GET https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=<celsius|fahrenheit>
```
Respuesta esperada (recortada):
```json
{
  "current": {
    "temperature_2m": 21.3,
    "relative_humidity_2m": 55,
    "apparent_temperature": 22.1,
    "weather_code": 1,
    "wind_speed_10m": 12.5
  }
}
```

## Datos mostrados por ciudad

- Nombre, región (admin1), país
- Temperatura actual con unidad
- Sensación térmica
- Humedad relativa (%)
- Velocidad del viento (km/h)
- Descripción legible del código de clima (en español)

## Manejo de errores

- Red fallida o HTTP no OK → mensaje claro y vuelta al menú.
- Respuesta de error de la API → mostrar `reason`.
- Ciudad no encontrada → mensaje y vuelta al menú.
- No hay ciudades guardadas → mensaje guía hacia la opción 3.
- No hay ciudad default → mensaje guía hacia la opción 5.
- Archivo de datos corrupto → reset a valores por defecto con aviso.

## Build y verificación

```bash
bunx tsc --noEmit
bun build --compile ./index.ts --outfile out/weather
```

Verificación funcional:
1. Ejecutar `./out/weather`
2. Confirmar que muestra el menú
3. Probar flujo básico: buscar cdad → agregar → consultar clima → salir

## Convenciones

- TypeScript strict: `import type` para imports de solo tipos, sin `any`, respetar `noUncheckedIndexedAccess`.
- Importaciones locales con extensión `.ts` (permitida por tsconfig).
- Mensajes de usuario en español.
- Código modular y mantenible, sin dependencias externas.