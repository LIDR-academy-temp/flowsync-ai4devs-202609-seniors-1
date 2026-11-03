 **Parte A:**  
 Medir la regla del README de la capability
 Predicción: espero y creo que se ejecute las 5 iteraciones y queden registrados en el REAMDE.md

 | Intento | Control: ¿ruta `DELETE` declarada? | ¿Cuenta para la medición? | Resultado: ¿`docs/capabilities/tasks/README.md` menciona el endpoint? | Observaciones |
|---------|------------------------------------|---------------------------|-----------------------------------------------------------------------|---------------|
| 1       | Sí                            | Sí                   | Sí                                                         |               |
| 2       | Sí                             | Sí                   | Sí                                                          |               |
| 3       | Sí                            | Sí                    | Sí                                                         |               Ejecuta el adversarial-reviewer|
| 4       | Sí                            | Sí                    | Sí                                                         |               |
| 5       | Sí                            | Sí                    | Sí                                                         |               Ejecuta el adversarial-reviewer|

**Cumplimiento del README:** 5 de 5 intentos válidos

## Parte B: las tres líneas

| # | Pregunta | Respuesta |
|---|----------|-----------|
| 1 | Predicción y resultado obtenido | Predicción: 5 de 5.  Resultado: 5 de 5 intentos válidos. 
| 2 | Qué haría con ese resultado (eliminar la regla / reescribirla / convertirla en comprobación automática) | Decisión: mantenerla Motivo: se ejecutó todas las veces a pesar que en algunos ejecutó otras ordenes que no hizo en otras |
| 3 | Algo que la medición no está comprobando | Limitación: algunas reglas parecen no ejecutarse siempre |
