# Guía: lanzar un binario CLI desde el Escritorio (Ubuntu/Linux)

Referencia rápida para compilar un ejecutable y abrirlo con **doble clic** desde el Escritorio en Ubuntu (y entornos similares con Nautilus/Nemo).

---

## Cuándo usar esto

- Tienes una **app de consola** (CLI interactiva) compilada como binario.
- Quieres abrirla con **un doble clic**, sin escribir comandos cada vez.
- El binario **necesita terminal** (`stdin` interactivo, menús, `readline`, etc.).

> **Importante:** un `.desktop` dentro de carpetas del proyecto (`out/`, `dist/`, etc.) suele **abrirse como texto** al hacer doble clic. En Ubuntu, colócalo en el **Escritorio** o en `~/.local/share/applications/`.

---

## Paso 1 — Compilar el binario

Con **Bun** (este proyecto):

```bash
bun run build
# equivale a:
# bun build --compile ./index.ts --outfile out/weather
```

Comprueba permisos de ejecución:

```bash
chmod +x out/weather
ls -la out/weather
# debe mostrar -rwxr-xr-x (o similar)
```

Adapta rutas y nombre del binario según tu proyecto.

---

## Paso 2 — Crear el archivo `.desktop`

Crea un archivo, por ejemplo `mi-app.desktop`:

```ini
[Desktop Entry]
Type=Application
Name=Mi App CLI
Comment=Descripción breve de la app
Exec=/RUTA/ABSOLUTA/al/proyecto/out/mi-binario
Path=/RUTA/ABSOLUTA/al/proyecto/out
Terminal=true
Categories=Utility;
```

### Campos clave

| Campo | Descripción |
|-------|-------------|
| `Name` | Nombre que verás en el Escritorio y el menú de aplicaciones |
| `Exec` | **Ruta absoluta** al binario (no uses `~` ni rutas relativas) |
| `Path` | Carpeta de trabajo al ejecutar (útil si el binario lee archivos locales) |
| `Terminal=true` | **Obligatorio** para apps de consola interactivas |

### Ejemplo real (proyecto Weather)

```ini
[Desktop Entry]
Type=Application
Name=Weather CLI
Comment=Consulta el clima
Exec=/home/antonydev/antonydev-desarrollos/02-devtalles-desarrollos/devtalles.antonydev.tech/opencode/02-weather/out/weather
Path=/home/antonydev/antonydev-desarrollos/02-devtalles-desarrollos/devtalles.antonydev.tech/opencode/02-weather/out
Terminal=true
Categories=Utility;
```

---

## Paso 3 — Copiar al Escritorio y dar permisos

```bash
cp /RUTA/AL/PROYECTO/mi-app.desktop ~/Escritorio/
chmod +x ~/Escritorio/mi-app.desktop
gio set ~/Escritorio/mi-app.desktop metadata::trusted true
```

La primera vez, al hacer doble clic, Ubuntu puede pedir **“Permitir lanzar”** / **“Confiar y ejecutar”**. Acéptalo.

---

## Paso 4 — Probar

1. Ve al **Escritorio**.
2. Doble clic en el icono (p. ej. **Mi App CLI**).
3. Debe abrirse una terminal con tu aplicación.

### Probar desde terminal (sin doble clic)

```bash
gio launch ~/Escritorio/mi-app.desktop
```

Si esto funciona pero el doble clic no, el `.desktop` está bien; revisa permisos y la opción “Permitir lanzar”.

---

## Alternativa: menú de aplicaciones

Para buscar la app con **Super** (tecla Windows) y escribir su nombre:

```bash
cp mi-app.desktop ~/.local/share/applications/
chmod +x ~/.local/share/applications/mi-app.desktop
```

No hace falta `gio set ... trusted` en esa carpeta, pero la primera ejecución puede pedir confirmación igualmente.

---

## Alternativa: script `.sh` dentro del proyecto

Si quieres lanzar desde la carpeta del proyecto (p. ej. `out/`) sin usar el Escritorio:

```bash
#!/usr/bin/env bash
cd "$(dirname "$0")"
exec ./mi-binario
```

Guárdalo como `ejecutar-mi-app.sh`, luego:

```bash
chmod +x ejecutar-mi-app.sh
```

Al hacer doble clic, el explorador suele mostrar un diálogo → elige **“Ejecutar en terminal”**.

---

## Errores frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Doble clic abre el `.desktop` como texto | Archivo dentro de `out/` u otra carpeta | Copiar a `~/Escritorio/` |
| La ventana se abre y se cierra al instante | Falta terminal (`Terminal=false` o “Ejecutar” sin terminal) | Usar `Terminal=true` en el `.desktop` |
| `chmod: No existe el archivo` | Mayúsculas/minúsculas en Linux | Verifica el nombre exacto (`weather.desktop` ≠ `Weather.desktop`) |
| “Requiere una terminal interactiva” | App CLI ejecutada sin TTY | `Terminal=true` o “Ejecutar en terminal” |
| Tras mover el proyecto deja de funcionar | Rutas absolutas en `Exec` y `Path` | Actualiza el `.desktop` con las nuevas rutas |

---

## Checklist rápido

- [ ] Binario compilado y con `chmod +x`
- [ ] `.desktop` con rutas **absolutas**
- [ ] `Terminal=true` si es app de consola
- [ ] Copiado a `~/Escritorio/` (o `~/.local/share/applications/`)
- [ ] `chmod +x` en el `.desktop`
- [ ] `gio set ... metadata::trusted true` (Escritorio)
- [ ] “Permitir lanzar” la primera vez
- [ ] Doble clic → terminal + app funcionando

---

## Notas para otros runtimes

| Runtime | Comando de compilación típico |
|---------|-------------------------------|
| **Bun** | `bun build --compile ./index.ts --outfile out/app` |
| **Go** | `go build -o out/app ./cmd/app` |
| **Rust** | `cargo build --release` → `target/release/app` |
| **C/C++** | `gcc main.c -o out/app` |

El `.desktop` es igual: apunta `Exec` al binario final y `Terminal=true` si la app es interactiva por consola.
