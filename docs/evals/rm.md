# Evals — medición de la regla de documentación (Módulo 8)

Autor: rm

## Parte A — Medición

### Regla medida

`CLAUDE.md`, «Reglas de proceso»:

> Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.

Lo que se mide es la mitad del README: si, al añadir un endpoint a `tasks`, el agente deja `docs/capabilities/tasks/README.md` actualizado.

### Encargo (idéntico en los cinco intentos)

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

El encargo no menciona el README ni la regla.

### Condiciones

- Herramienta y modelo: Claude Code con Claude Sonnet 5.5 (`claude-sonnet-5-5`) en los cinco intentos; modo de permisos `auto`.
- Una sesión nueva por intento, desde `s8/start` limpio (igual a `upstream/s8/start`, d977e7a).
- Entre intentos: `git checkout -f s8/start`, `git reset --hard upstream/s8/start`, `git clean -fd`, y `git status -sb` con solo la línea `## s8/start...upstream/s8/start`.
- Para el agente se bloquearon `gh pr` y `git push` (`.claude/settings.local.json`, fuera del repositorio entregado).
- Los prompts exactos, con hora y modelo, están en `prompts.md`.

### Comprobaciones (en este orden, por intento)

1. **Control:** ¿hay una ruta `DELETE` declarada en `backend/start/routes.ts` (`router.delete(`)? Si no, el intento no cuenta.
2. **Resultado:** ¿`docs/capabilities/tasks/README.md` menciona el endpoint nuevo (una línea con `DELETE` y `tasks/:id`)?

Validación del comprobador: sobre `s8/start` limpio, sin ningún intento, da Control = NO y Resultado = NO, es decir, distingue un repositorio sin cambios de uno con cambios.

### Resultados

| Intento | Rama | Commit | Control | Resultado | Dónde aparece en el README |
|---|---|---|---|---|---|
| 1 | `feat/tasks-delete` | 66b4ab3 | SÍ (`routes.ts:56`) | SÍ | línea 27, fila `DELETE /tasks/:id` |
| 2 | `feat/delete-task` | 863ce2a | SÍ (`routes.ts:56`) | SÍ | línea 27, fila `DELETE /tasks/:id` |
| 3 | `feat/tasks-delete-endpoint-2` | 9368b6a | SÍ (`routes.ts:54`) | SÍ | línea 27, fila `DELETE /tasks/:id` |
| 4 | `feat/delete-task-3` | f856ffe | SÍ (`routes.ts:54`) | SÍ | línea 25, fila `DELETE /tasks/:id` |
| 5 | `feat/delete-task-4` | 0620b01 | SÍ (`routes.ts:56`) | SÍ | línea 27, fila `DELETE /tasks/:id` |

**Intentos que cuentan: 5 de 5 (los cinco superan el Control). README al día: 5 de 5.**

### Datos adicionales por intento

| Intento | Commits | Rutas y README en el mismo commit | Ficheros del commit | Test nuevo | `backend/.adonisjs/` regenerado | `docs/api/openapi.json` tocado |
|---|---|---|---|---|---|---|
| 1 | 1 | sí | 7 | no | sí (4 ficheros) | no |
| 2 | 1 | sí | 8 | sí | sí (4 ficheros) | no |
| 3 | 1 | sí | 8 | sí | sí (4 ficheros) | no |
| 4 | 1 | sí | 8 | sí | sí (4 ficheros) | no |
| 5 | 1 | sí | 8 | sí | sí (4 ficheros) | no |

En los cinco intentos el agente creó una rama `feat/*` y no ejecutó `git push` ni `gh pr`.

### Ejecuciones descartadas

Antes de los intentos 3, 4 y 5 hubo tres ejecuciones que se lanzaron sin fijar el modelo y se hicieron con Claude Opus 5.5, con el prompt sin las comillas invertidas (dos) o con un pegado desordenado (una). No cumplían las condiciones y no se cuentan. Por completitud: las tres cumplieron Control y Resultado (ramas `feat/tasks-destroy`, `feat/tasks-delete-endpoint` y `feat/delete-task-2`); en las dos últimas el agente también modificó `docs/api/openapi.json`. Se repitieron los tres intentos con Sonnet 5.5.

## Parte B – Reflexión y evaluación

### 1. Predicción frente al resultado

Antes de iniciar el experimento, mi predicción fue que **3 de los 5 intentos** actualizarían correctamente el README de la capability tasks. Consideraba que Claude Sonnet 5.5 podía interpretar las instrucciones del proyecto, pero que su comportamiento no determinista podía provocar resultados diferentes entre ejecuciones. Finalmente, completé los cinco intentos y los cinco actualizaron correctamente el README, obteniendo un resultado de **5/5 frente a los 3/5 que había pronosticado**. Esto representa un cumplimiento superior al esperado.

### 2. Decisión sobre la regla

Mantendría la regla y buscaría comprobarla automáticamente. Los cinco intentos muestran que Claude Code cumplió con la actualización de la documentación incluso cuando el prompt no lo solicitaba explícitamente. Sin embargo, considero conveniente incorporar una validación automatizada que compruebe que los cambios en rutas o controladores tengan su correspondiente actualización en OpenAPI y en el README de la capability. Esto reduciría la dependencia de revisiones manuales y ayudaría a prevenir documentación desactualizada.

### 3. Limitaciones de la medición

La principal limitación es el tamaño de la muestra: cinco intentos no son suficientes para garantizar que el comportamiento se mantenga en todos los escenarios. Además, la evaluación comprobó que el endpoint apareciera en el README, pero no midió exhaustivamente la precisión y completitud de toda la documentación. Tampoco se ejecutó un grupo de control sin la regla de `CLAUDE.md`, por lo que no es posible afirmar que el resultado se deba exclusivamente a esa instrucción.
