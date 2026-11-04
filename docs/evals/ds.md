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

El control lo hice con `grep` sobre `backend/start/routes.ts`. El resultado, con `grep` sobre el README y leyendo el diff. En la línea base no había ninguna ruta `delete` ni ninguna mención a `DELETE`.

### Lo que el 5 de 5 no enseña

El ejercicio solo pide mirar el README, pero la regla dice más. Después revisé los diffs guardados:

| Intento | Commit | README en el commit | `docs/api/openapi.json` | `.adonisjs/` |
|---|---|---|---|---|
| 1 | `5257734` | Sí | Sí | Sí |
| 2 | `f7ad411` | Sí | Sí | No |
| 3 | Ninguno | Sin commit | No | Sin commit |
| 4 | `81e772c` | Sí | Sí | Sí |
| 5 | `23019e0` | Sí | Sí | Sí |

Si exijo la regla entera, con README y `.adonisjs/` en el mismo commit, se cumple en 3 de 5: los intentos 1, 4 y 5. Lo calculé a posteriori, así que lo tomo como una observación, no como la medida del ejercicio.

### Cómo se hizo y qué salió mal

- **Mi sesión manual falló.** No llegué a lanzar el encargo y no guardé el error. Antes de darme cuenta anoté una tabla de resultados que no tenía ejecuciones detrás. Al contrastarla con las evidencias no se sostenía y la descarté. Nada de este documento sale de ella.
- **Los intentos no los lancé a mano.** Pedí a una sesión de Claude Code que los lanzara por mí, uno a uno, cada uno en una sesión nueva con `claude -p`. Esto se aparta del ejercicio: nadie aprobaba permisos y el agente trabajó con una lista cerrada de herramientas, con `git push` y `gh` denegados. Esa lista le rechazó entre 6 y 9 comandos por intento, y ninguno llegó a intentar un `push` ni un PR.
- **El intento 3 se quedó a medias.** Pidió aprobar `curl` para regenerar el OpenAPI y no hizo commit, citando la regla. Nadie podía contestarle en ese modo. La ruta y el README estaban en el árbol de trabajo, y por eso cuenta.
- **El intento 2 se dejó `.adonisjs/`.** Necesitaba `node ace serve`, que le fue denegado. Lo avisó en su resumen.
- **`npm run openapi:check` falla en local.** Da `Invalid URL` con Node 24, y lo reproduje en `s8/start` limpio, así que no lo causó ningún intento. Por eso al menos tres intentos generaron `openapi.json` con un spec temporal. No he comprobado si esos documentos pasarían el CI.
- **Añadí un paso a la restauración.** El intento 1 dejó la rama `feat/delete-task` y el siguiente podía encontrarse el trabajo hecho. Tras los tres comandos guardé cada rama en una referencia local y la borré. También saqué de `/tmp` dos carpetas que dejaron los intentos 2 y 4. Tras cada restauración, `git status -sb` mostró solo la línea de `s8/start`.

No probé el endpoint ni repetí los tests. Los resúmenes de los agentes dicen que pasaban, pero eso no lo he verificado.

## Parte B: las tres líneas

1. **Apuesta y resultado.** Aposté 3 de 5 y salió 5 de 5, con los cinco intentos válidos. Me quedé corto en la parte del README, aunque la regla completa se cumplió en 3 de 5.

2. **Qué haría con ese número.** No borraría la regla, porque en este encargo el README se actualizó siempre. Añadiría una comprobación en CI que falle si un PR toca rutas o controladores de una capability sin tocar su README, porque el workflow `openapi.yml` ya vigila el documento OpenAPI pero nada vigila el README. Con 5 de 5 no es urgente, pero tampoco demuestra que nunca falle, y la comprobación es barata. También reescribiría la regla: dice que no hay fichero OpenAPI que generar, mientras `docs/api/openapi.json` está versionado, y en local el comando que lo genera no funciona. Los intentos 2 y 3 tropezaron precisamente al regenerar lo que pide la regla.

3. **Lo que no estoy midiendo.** No sé si es la regla la que hace que se actualice el README, porque no hay grupo de control sin ella. Los cinco agentes leyeron el README antes de editar, y ese archivo ya tiene una tabla de endpoints, así que quizá lo actualizarían igual. Tampoco mido si la documentación es correcta, solo que menciona el endpoint. Y son cinco ejecuciones de un único encargo, con un modelo, en modo no interactivo y sin nadie aprobando permisos, que no es como se trabaja normalmente.
