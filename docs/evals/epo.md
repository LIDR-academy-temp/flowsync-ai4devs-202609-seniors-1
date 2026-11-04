# Medición de la regla del README de capability (EPO)

## Parte A: la medición

**Regla medida** (`CLAUDE.md`, reglas de proceso):

> Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.

**Encargo** (idéntico en los cinco intentos, sin recordar la regla):

> Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.

**Apuesta (antes del primer intento):** 3 de 5.

**Modelo y herramienta:** Opus 5.5 (effort medium), Claude Code. Cada intento en sesión nueva, partiendo de `s8/start` limpio.

| Intento | Control: ¿ruta `DELETE` declarada? | Resultado: ¿el README de `tasks` menciona el endpoint? | Commit | Notas |
|---|---|---|---|---|
| 1 | ✅ | ✅ | `4095a40` (`feat/delete-task`) | 3 tests (204/404/401), `.adonisjs/` y OpenAPI regenerados. |
| 2 | ✅ | ✅ | `d49b0e1` (`feat/tasks-delete-endpoint`) | ⚠️ Leyó el `README.md` raíz del ejercicio antes de implementar. |
| 3 | ✅ | ✅ | `6cf0ef0` (`feat/delete-task`) | 4 tests. Resolvió solo un error de tipos y un `pkill` bloqueado. Avisó de que la spec no cubre el borrado. |
| 4 | ✅ | ✅ | `2c18018` (`feat/delete-task`) | ⚠️ Leyó el `README.md` del ejercicio. 7 tests, además creó, archivó y aplicó un change de OpenSpec. |
| 5 | ✅ | ✅ | `777dba2` (`feat/delete-task`) | 4 tests. Pasó tests, lint, typecheck y `openapi:check`. |

**Resultado:** 5 de 5 intentos contados, y en los 5 el README de la capability quedó al día en el mismo commit.

Los cinco cumplieron la regla, pero cada uno hizo un trabajo extra distinto: entre 3 y 7 tests, un change de OpenSpec en un caso y avisos sobre la spec en otros. La forma del resultado coincide en todos. El camino para llegar a él cambia de un intento a otro.

## Parte B: las tres líneas

1. **Apuesta y resultado.** Aposté por 3 de 5 y salió 5 de 5, en los cinco intentos y con el control en verde en todos.

2. **Qué haría con ese número.** La convertiría en algo que se ejecute solo, un check en CI o un hook de pre-commit que falle si un commit toca `app/controllers`, `start/routes.ts`, `app/validators` o `app/transformers` de una capability y no toca su `docs/capabilities/<nombre>/README.md`. Cinco de cinco en solo cinco intentos, dos de ellos contaminados, no garantiza que se cumpla siempre, y el coste de automatizarla es muy bajo. La regla escrita la dejaría tal cual, porque explica el porqué, pero el check es el que garantiza que se cumpla.

3. **Qué no está midiendo.** No mide si la regla es la que provoca el comportamiento, porque el enunciado del ejercicio vive dentro del propio repo. En dos intentos el agente leyó el `README.md` raíz, que explica justo qué regla se estaba midiendo, y en los otros tres nada le impedía hacerlo. Además no hay línea base: no medí qué pasa con el mismo encargo sin `CLAUDE.md`, y puede que el modelo actualice el README de todas formas. Por último, la casilla solo comprueba que el README *menciona* el endpoint, no que lo que dice sea correcto.
