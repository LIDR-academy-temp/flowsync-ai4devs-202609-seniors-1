# Medición de la regla del README de la capability

## Parte A: la medición

**Regla medida** (reglas de proceso del `CLAUDE.md`): «Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.»

**Predicción**, anotada antes del primer intento y sin modificar después: **3 de los 5 intentos** actualizarían el README de la capability.

**Encargo**, idéntico en los cinco intentos, sin recordar la regla:

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Condiciones:** sesión nueva de Claude Code en cada intento, desde la raíz del proyecto; el mismo modelo y modo (Sonnet 5.5 High, aceptar ediciones); sin aceptar `git push` ni `gh pr create`. Entre intentos, `git checkout -f s8/start`, `git reset --hard upstream/s8/start` y `git clean -fd`, y comprobación de que `git status -sb` mostraba solo `## s8/start...upstream/s8/start`. A partir del intento 3 se borró además la rama `feat/*` del intento anterior (ver las notas del intento 2). La carpeta de memoria del agente se comprobó vacía tras cada intento.

**Comprobaciones por intento**, ejecutadas antes de reiniciar y contra `upstream/s8/start`:

- **Control** (si falla, el intento no cuenta): ¿quedó declarada la ruta `DELETE`?

```
git diff upstream/s8/start -- backend/start/routes.ts | grep -iE '^\+.*delete'
```

- **Resultado**: ¿alguna línea añadida al README de la capability menciona el endpoint nuevo?

```
git diff upstream/s8/start -- docs/capabilities/tasks/README.md | grep -E '^\+' | grep -iE 'delete'
```

La comprobación del resultado se ejecutó también sobre la línea base (proyecto limpio en `s8/start`) y no devolvió coincidencias, así que puede dar negativo.

**Resultados:**

| # | Control (ruta `DELETE`) | Resultado (README menciona el endpoint) | README tocado | Commit | Notas |
|---|---|---|---|---|---|
| 1 | Sí | Sí: fila de la tabla y la frase de la excepción del serializer | +6 −3 | `f699fc3` | Dejó el servidor de desarrollo vivo en el puerto 3333. Dijo que `npm run openapi:check` falla con `Invalid URL` y no lo investigó |
| 2 | Sí | Sí: fila de la tabla | +1 −0 | `a71cfa8` | El agente vio la rama `feat/delete-task` del intento 1 y lo mencionó. Actualizó `docs/api/openapi.json` y no hubo diff en `.adonisjs/` |
| 3 | Sí | Sí: fila de la tabla y un paso del recorrido con `curl -X DELETE` | +6 −1 | `b50e4bd` | Partió sin ramas previas |
| 4 | Sí | Sí: fila de la tabla y la frase de que el `204` de `DELETE` no pasa por el serializer | +6 −3 | `8d3d64f` | Partió sin ramas previas |
| 5 | Sí | Sí: fila de la tabla, borrado definitivo y referencias a `delete.spec.ts` | +11 −6 | `171b346` | Dejó el servidor de desarrollo vivo en el puerto 3333 |

**Resultado: 5 de 5 intentos contados, y en los 5 el README de la capability menciona el endpoint nuevo.**

## Parte B: las tres líneas

1. **Predicción y resultado:** predije 3 de 5 y salió 5 de 5: en los cinco intentos quedó declarada la ruta `DELETE` y el README de la capability mencionó el endpoint nuevo.
2. **Qué haría con el resultado:** convertirla en una comprobación automática (un chequeo que falle si un commit toca rutas, controladores, validadores o transformers de una capability sin tocar su README). No sé qué habría hecho el agente si esa línea no estuviera en el `CLAUDE.md`: sin esa línea base no puedo saber si el 5 de 5 se debe a la regla o a que documentar un endpoint ya es lo natural, y por eso no me atrevo a eliminarla; y como 5 de 5 tampoco demuestra que se cumpla siempre (con cinco intentos sin fallos, la tasa real de incumplimiento podría llegar a cerca del 45 % con un 95 % de confianza), prefiero una garantía que no dependa de que el agente la siga, y no reescribirla.
3. **Lo que mi medición no comprueba:** qué habría hecho el agente sin la regla (no hay línea base); la otra mitad de la regla (el documento OpenAPI); que el README quede *correcto* y no solo que mencione `delete`; y la independencia entre intentos, porque en el segundo el agente vio la rama del primero.
