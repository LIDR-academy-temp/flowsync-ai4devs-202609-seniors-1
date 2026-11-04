# Medición de la regla del README de la capability (módulo 8)

## Encargo y regla medidos

Regla (`CLAUDE.md`, sección de reglas de proceso): un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día.

Encargo, enviado tal cual en una sesión nueva de Claude Code por intento (Opus 5.5, modo manual), sin recordar la regla:

> Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.

## Cómo comprobé

Cada intento parte de `s8/start` (`git checkout -f s8/start`, `git reset --hard upstream/s8/start`, `git clean -fd`, y `git status -sb` solo con `## s8/start`). Se comparan las líneas **añadidas** frente a `upstream/s8/start`:

- **Control:** el diff de `backend/start/routes.ts` añade una línea con `router.delete(` o `.delete(`. Si no, el intento no cuenta.
- **Resultado:** el diff de `docs/capabilities/tasks/README.md` añade una línea que contiene `DELETE` y `/tasks/:id`.

Las dos comprobaciones se probaron antes del primer intento con siete casos (repo limpio, README con el endpoint, con otro método, con texto de tasks sin `DELETE`, ruta `DELETE`, ruta `GET` y un borrado en el controlador sin ruta) y dieron el resultado esperado.

## Tabla de intentos

| # | Hora | Control: ruta DELETE declarada | Resultado: README menciona el endpoint | ¿Cuenta? | Nota |
|---|---|---|---|---|---|
| 1 | 20:07 | sí | sí | sí | commit 3fe4fe6 en feat/delete-task |
| 2 | 20:15 | sí | sí | sí | commit dba9891 en feat/tasks-delete; vio la rama del intento 1 |
| 3 | 20:22 | sí | sí | sí | commit 96c1c15 en feat/tasks-delete-endpoint; sin docs/api/openapi.json; vio ramas viejas |
| 4 | 20:28 | sí | sí | sí | commit 1029ebd en feat/tasks-destroy; con docs/api/openapi.json; vio tres ramas viejas |
| 5 | 20:34 | sí | sí | sí | commit 038ff02 en feat/tasks-delete-by-id; con docs/api/openapi.json; vio ramas viejas |

**README actualizado: 5 de 5 intentos contados** (5 apuntados, 5 con ruta declarada).

## Parte B

1. **Predicción y resultado.** Predije 3 de 5 antes del primer intento (registrado en el reloj a las 19:59:20) y el resultado fue 5 de 5: en los cinco intentos el agente declaró la ruta `DELETE` y actualizó `docs/capabilities/tasks/README.md` sin que le recordara la regla. Hice los cinco intentos y los cinco cuentan, porque todos pasaron el control.

2. **Qué haría con el resultado.** Convertiría en comprobación automática la parte que se puede verificar con código (que toda ruta declarada en `routes.ts` tenga su fila en el README de su capability). Esa comprobación solo cubriría que la fila exista, no que sea correcta, así que la revisión del contenido seguiría siendo humana. Mantendría la regla escrita mientras no mida una línea base. No la borraría con este dato: 5 de 5 no demuestra que sea la regla la que produce el cumplimiento, y un fallo de documentación no avisa. Tampoco la reescribiría, porque no hay incumplimientos que arreglar.

3. **Qué no comprueba mi medición.** No tiene línea base: no sé qué habría hecho el agente sin la regla, así que el 5 de 5 no prueba que la regla aporte nada. Con cinco ensayos, cinco aciertos no descartan que la tasa real sea tan baja como ~55 % (cota inferior aproximada al 95 %, cálculo mío, no del enunciado). Mi comprobación solo mira que el README mencione `DELETE` y la ruta, no que sea correcto ni que el OpenAPI esté al día: el intento 3 no commiteó `docs/api/openapi.json` y mi comprobación no lo habría distinguido. Además, los intentos pudieron no ser del todo independientes: el agente veía las ramas `feat/…` de los intentos previos (cuatro al final), lo comentó en los intentos 2 a 5 y eligió otro nombre de rama cada vez. No tengo evidencia de que eso influyera en que actualizara el README, pero la limpieza no las borra y no puedo descartarlo.
