# Medición de la regla del README

## Parte A: la medición

**Regla medida**, en las reglas de proceso de `CLAUDE.md`:

> Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.

**Encargo**, igual en los cinco intentos:

> Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.

**Mi apuesta:** 3 de 5. La escribí antes del primer intento y no la he cambiado.

**Entorno:** Opus 5.5 (`claude-opus-5-5`), Claude Code 2.1.318 y Node 24.22.2. Todos los intentos salen de `s8/start` en `d977e7a`.

### Resultados

| Intento | Control: ruta `DELETE` declarada | ¿Cuenta? | Resultado: el README menciona el endpoint |
|---|---|---|---|
| 1 | Sí | Sí | Sí |
| 2 | Sí | Sí | Sí |
| 3 | Sí | Sí | Sí |
| 4 | Sí | Sí | Sí |
| 5 | Sí | Sí | Sí |

Los cinco intentos son válidos y en los cinco el README menciona el endpoint: **5 de 5**.

El control se hizo con `grep` sobre `backend/start/routes.ts`. El resultado, con `grep` sobre el README y leyendo el diff. En la línea base no había ninguna ruta `delete` ni ninguna mención a `DELETE`.

### Lo que el 5 de 5 no enseña

El ejercicio solo pide mirar el README, pero la regla dice más. Después se revisaron los diffs guardados:

| Intento | Commit | README en el commit | `docs/api/openapi.json` | `.adonisjs/` |
|---|---|---|---|---|
| 1 | `5257734` | Sí | Sí | Sí |
| 2 | `f7ad411` | Sí | Sí | No |
| 3 | Ninguno | Sin commit | No | Sin commit |
| 4 | `81e772c` | Sí | Sí | Sí |
| 5 | `23019e0` | Sí | Sí | Sí |

En los intentos 1, 4 y 5 coincidieron en el commit los archivos documentales revisados: el README, `docs/api/openapi.json` y `.adonisjs/`. Eso no demuestra que se cumpliera la regla completa, porque no se validó íntegramente el contrato OpenAPI. Es una observación hecha a posteriori, no la medida del ejercicio.

### Cómo se ejecutó

Mi sesión manual falló antes de lanzar el encargo y no guardé el error. Una tabla que anoté sin ejecuciones detrás quedó descartada y no se usa aquí.

Después, otra sesión de Claude Code ejecutó los cinco encargos uno a uno, cada uno en una sesión nueva con `claude -p` y sin intervención humana para aprobar permisos. No son intentos manuales. El agente trabajó con una lista cerrada de herramientas, con `git push` y `gh` denegados.

Entre intentos se restauró el repositorio con los tres comandos del ejercicio. Además, las ramas del agente se guardaron en referencias locales y se borraron, y dos carpetas que dejaron los intentos 2 y 4 en `/tmp` se movieron a las evidencias.

Tres cosas explican la segunda tabla y sus límites:

- **Intento 2:** el commit no lleva `.adonisjs/` porque `node ace serve` le fue denegado.
- **Intento 3:** no hizo commit porque se quedó esperando la aprobación de `curl`, que nadie podía dar. Cuenta porque la ruta y el README estaban en el árbol de trabajo.
- **`npm run openapi:check`:** da `Invalid URL` con Node 24, también en `s8/start` limpio.

No se probó el endpoint ni se repitieron los tests.

## Parte B: las tres líneas

1. **Predicción y resultado.** Aposté 3 de 5 y salió 5 de 5, con los cinco intentos válidos. En la parte del README me quedé corto.

2. **Qué haría.** Mantendría la regla y añadiría una comprobación en CI que falle si un PR toca rutas o controladores de una capability sin tocar su README. El workflow `openapi.yml` ya vigila el documento OpenAPI, pero nada vigila el README, y un 5 de 5 no garantiza que no vaya a fallar.

3. **Limitaciones.** No hay grupo de control sin la regla, así que no sé si el README se actualiza gracias a ella: los cinco agentes lo leyeron antes de editar y ya tiene una tabla de endpoints. Solo mido que mencione el endpoint, no que la documentación sea correcta. Y son cinco ejecuciones de un único encargo, con un modelo y en modo no interactivo.
