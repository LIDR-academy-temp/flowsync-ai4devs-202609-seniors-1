# Medición: ¿se cumple la regla del README de la capability?

## Parte A
- Regla (CLAUDE.md): "Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día."
- Encargo, enviado tal cual en sesión nueva y sin recordar la regla: "Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks."
- Entorno: Claude Code 2.1.316, modelo Sonnet 5.5, rama s8/start (d977e7a).
- Predicción previa: 3 de 5.

| Intento | Control (ruta DELETE) | Resultado (README menciona el endpoint) | Commit | Notas |
|---|---|---|---|---|
| 1 | sí | sí | 3e076a3 | |
| 2 | sí | sí | 861ef7f | |
| 3 | sí | sí | 79f6409 | |
| 4 | sí | sí | db09ff0 | |
| 5 | sí | sí | c73ef84 | regeneró .adonisjs/ y lo incluyó en el commit |

Los 5 intentos cuentan (control sí en todos). Cada intento se limpió con git checkout -f s8/start, git reset --hard upstream/s8/start y git clean -fd.

## Parte B

1. Predicción y resultado: predije 3 de 5 porque el encargo no menciona el README ni la regla. El resultado fue 5 de 5: los cinco intentos declararon la ruta DELETE (control sí) y los cinco actualizaron docs/capabilities/tasks/README.md con fila nueva en la tabla y el recuento de operaciones de cinco a seis. Completé los cinco intentos, todos desde s8/start limpio.

2. Decisión sobre la regla: no la eliminaría ni la dejaría solo como texto. La convertiría en una comprobación automática (un script o hook que falle si el diff toca rutas, controladores, validadores o transformers de una capability sin tocar su README). Con 5 de 5 hoy la regla funciona, pero depende de que el modelo la recuerde, y un cambio de modelo o de CLAUDE.md puede romperla sin que nadie lo note. Antes de invertir en el guardarraíl mediría el mismo encargo sin la regla, para saber si el modelo ya lo haría por su cuenta.

3. Qué no comprueba la medición: (a) no hay línea base sin la regla, así que no sé si el README se actualiza por la regla o porque el modelo lo haría igualmente; (b) "el README menciona el endpoint" no es "el README está al día": no mido si el contenido es correcto; (c) no comprueba la otra mitad de la regla, el documento OpenAPI; (d) cinco intentos son pocos, y 5 de 5 es compatible con una tasa real de en torno al 80 %; (e) la comprobación nunca la vi fallar, así que no sé si detectaría un README sin actualizar; (f) un solo modelo y un solo encargo.
