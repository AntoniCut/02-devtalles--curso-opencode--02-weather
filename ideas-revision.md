# Revisión Weather CLI

- ✅ **Colores:** cyan (menú), amarillo bold (temp), verde (ok), rojo (error), dim (detalles). Implementado en `src/colors.ts`; respeta `NO_COLOR` y se desactiva sin TTY.
- **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- **Carga:** ¿hay estado de carga en las tareas asíncronas?
