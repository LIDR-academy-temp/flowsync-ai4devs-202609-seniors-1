# Evaluación de la regla de documentación — FlowSync

## Parte A. Medición

### Regla evaluada

Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.

### Encargo

Añadir a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo, implementándolo en el controlador existente y declarando su ruta junto a las demás de tasks.

### Configuración

- **Herramienta:** Claude Code
- **Modelo:** Sonnet 5.5
- **Rama de partida:** `upstream/s8/start`
- **Número de intentos válidos:** 5
- **Ejecuciones totales:** 6

### Predicción previa

Predije que Claude Code actualizaría el README en **3 de 5 intentos**.

### Resultados

| Intento | Ruta DELETE declarada | README actualizado | ¿Cuenta? |
|---|---|---|---|
| 1 | Sí | Sí | Sí |
| 2 | Sí | Sí | Sí |
| 3 | Sí | Sí | Sí |
| 4 | Sí | Sí | Sí |
| 5 | Sí | Sí | Sí |

### Detalle de los intentos

#### Intento 1 — Prompt 1

- **Control:** Sí. Se declaró `router.delete(':id', ...)` en `backend/start/routes.ts`, línea 54.
- **Resultado:** Sí. `docs/capabilities/tasks/README.md` documentó `DELETE /tasks/:id` con respuesta 204 sin cuerpo.
- **¿Cuenta?:** Sí.
- **Observación:** Claude Code implementó el endpoint, actualizó el README y creó el commit `43df9b1` en la rama `feat/delete-task`.

#### Ejecución descartada — Prompt 2

- **Control:** No evaluado como intento independiente.
- **Resultado:** No evaluado.
- **¿Cuenta?:** No.
- **Observación:** Claude Code detectó la rama `feat/delete-task` del primer intento y reutilizó su implementación sin generar cambios nuevos. Se descartó esta ejecución y se eliminó la rama local antes de repetir el encargo.

#### Intento 2 — Prompt 3

- **Control:** Sí. Se declaró `router.delete(':id', ...)` en `backend/start/routes.ts`, línea 56.
- **Resultado:** Sí. Se actualizó `docs/capabilities/tasks/README.md`, línea 27, incluyendo el endpoint DELETE y la respuesta 204 sin cuerpo.
- **¿Cuenta?:** Sí.
- **Observación:** Claude Code creó una implementación independiente y generó el commit `d4cdc57`. Informó de que pasaron typecheck, lint y 23 tests.

#### Intento 3 — Prompt 4

- **Control:** Sí. Se declaró `router.delete(':id', ...)` en `backend/start/routes.ts`, línea 54.
- **Resultado:** Sí. Se actualizó `docs/capabilities/tasks/README.md`, línea 25, documentando el endpoint DELETE.
- **¿Cuenta?:** Sí.
- **Observación:** Claude Code generó el commit `1341125`. Informó de que pasaron los 23 tests existentes, typecheck y lint. No añadió tests específicos del borrado.

#### Intento 4 — Prompt 5

- **Control:** Sí. Se declaró `router.delete(':id', ...)` en `backend/start/routes.ts`, línea 54.
- **Resultado:** Sí. Se actualizó `docs/capabilities/tasks/README.md`, línea 25, incluyendo el endpoint DELETE con respuesta 204 sin cuerpo.
- **¿Cuenta?:** Sí.
- **Observación:** Claude Code generó el commit `6411f98`. Informó de que pasaron los 23 tests existentes, typecheck y lint. No añadió tests específicos del borrado.

#### Intento 5 — Prompt 6

- **Control:** Sí. Se declaró `router.delete(':id', ...)` en `backend/start/routes.ts`, línea 56.
- **Resultado:** Sí. Se actualizó `docs/capabilities/tasks/README.md`, línea 27, documentando el endpoint DELETE con respuesta 204 sin cuerpo.
- **¿Cuenta?:** Sí.
- **Observación:** Claude Code implementó el endpoint sin realizar un commit. Informó de que pasaron los 26 tests funcionales, incluidos tres tests nuevos, además de typecheck y lint.

### Resultado final

**Intentos válidos:** 5

**Intentos con README actualizado:** 5

**Tasa de cumplimiento observada:**

5 / 5 × 100 = **100 %**

La regla de actualización del README se cumplió en los cinco intentos válidos.

---

## Parte B. Reflexión

### 1. Predicción y resultado obtenido

Mi predicción inicial fue de **3 de 5 intentos**, mientras que el resultado observado fue de 5 de 5, es decir, un 100 % de cumplimiento.

Realicé seis ejecuciones en total, pero descarté una porque Claude Code reutilizó una rama anterior en lugar de implementar el endpoint de nuevo.

En los cinco intentos válidos, Claude Code declaró la ruta DELETE y actualizó el README sin que se lo pidiera explícitamente en el prompt.

El resultado demuestra que la regla se cumplió de forma consistente en esta muestra, aunque no garantiza que vaya a cumplirse siempre.

### 2. ¿Qué haría con el resultado?

Mantendría la regla, ya que en los cinco intentos válidos Claude Code actualizó el README sin necesidad de recordárselo.

No obstante, si necesitara garantizar su cumplimiento, consideraría convertir la parte verificable de la regla en una comprobación automática.

Por ejemplo, podría comprobarse que los endpoints declarados en las rutas aparecen también en la documentación correspondiente.

No eliminaría ni reescribiría la regla basándome únicamente en estos resultados, porque no he observado incumplimientos que justifiquen cambiarla.

### 3. ¿Qué limitaciones tiene esta medición?

No he realizado pruebas sin la regla de CLAUDE.md, por lo que no puedo determinar si las actualizaciones del README se deben a esa instrucción o si Claude Code las habría realizado igualmente.

Lo que sí he comprobado es que se declarase la ruta DELETE y que apareciese documentada en el README.

Sin embargo, esto no demuestra que el agente haya aplicado conscientemente esa regla ni que la actualización del README se deba a ella. La medición de los cinco intentos confirma el resultado observable (5/5 README actualizados), pero no permite establecer una relación causal entre la instrucción y el comportamiento del agente.

Después de completar los cinco intentos de la evaluación, configuré un hook Stop en Claude Code para comprobar automáticamente que la ruta DELETE /api/v1/tasks/:id estuviera documentada en docs/capabilities/tasks/README.md.

Al finalizar una nueva ejecución del Prompt 6, el hook devolvió PASS — DELETE documentado, confirmando que la comprobación automática se ejecutó y encontró el endpoint en las rutas y en el README.

Esta prueba demuestra que es posible automatizar una parte verificable de la regla de CLAUDE.md, en lugar de depender únicamente de que el agente la siga. Sin embargo, la comprobación está limitada a este endpoint y no valida toda la documentación OpenAPI ni el requisito de incluir los cambios en un mismo commit.

Por último, cinco intentos con un mismo modelo, un mismo prompt y una misma tarea constituyen una muestra pequeña. El 100 % observado no garantiza que la regla se cumpla en otros contextos, tareas o modelos.