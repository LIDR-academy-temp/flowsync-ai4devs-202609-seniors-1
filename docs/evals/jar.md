# Evals for Agentic Harness

## Medir la regla del README de la capability

### Predicción inicial

Mi predicción inicial fue que en **4 de 5** los cinco ensayos el `README` de la capability quedaría actualizado.

### Encargos realizados

Para medir si los ensayos salieron bien, se revisaron los archivos del commits, las trazas del agente, y el mensaje final.

| Ensayo | Control ruta DELETE | Resultado ruta en README |
| --- | --- | --- |
| 1 | ✅ OK | ✅ OK |
| 2 | ✅ OK | ✅ OK |
| 3 | ✅ OK | ✅ OK |
| 4 | ✅ OK | ✅ OK |
| 5 | ✅ OK | ✅ OK |

### Evidencias

#### Ensayo 1

- Rama creada: `feat/delete-task`
- Commit realizado: (15e1420)
- Ruta DELETE declarada: ✅ OK
- Archivo README con nueva ruta: ✅ OK
- Revisión de Trazas: ✅ OK
- Revisión de Mensaje final: ✅ OK
- Documento OpenAPI actualizado: ❎ KO

#### Ensayo 2

- Rama creada: `feat/delete-task-2`
- Commit realizado: (4675ed2)
- Ruta DELETE declarada: ✅ OK
- Archivo README con nueva ruta: ✅ OK
- Revisión de Trazas: ✅ OK
- Revisión de Mensaje final: ✅ OK
- Documento OpenAPI actualizado: ❎ KO

#### Ensayo 3

- Rama creada: `feat/delete-task-3`
- Commit realizado: (54c2687)
- Ruta DELETE declarada: ✅ OK
- Archivo README con nueva ruta: ✅ OK
- Revisión de Trazas: ✅ OK
- Revisión de Mensaje final: ✅ OK
- Documento OpenAPI actualizado: ❎ KO

#### Ensayo 4

- Rama creada: `feat/tasks-delete` (renombrada a `feat/delete-task-4`)
- Commit realizado: (597ca28)
- Ruta DELETE declarada: ✅ OK
- Archivo README con nueva ruta: ✅ OK
- Revisión de Trazas: ✅ OK
- Revisión de Mensaje final: ✅ OK
- Documento OpenAPI actualizado: ❎ KO

#### Ensayo 5

- Rama creada: `feat/tasks-delete` (renombrada a `feat/delete-task-5`)
- Commit realizado: (300cb52)
- Ruta DELETE declarada: ✅ OK
- Archivo README con nueva ruta: ✅ OK
- Revisión de Trazas: ✅ OK
- Revisión de Mensaje final: ✅ OK
- Documento OpenAPI actualizado: ❎ KO
- Nota: En este caso no se generó en el commit 

## Parte B

### Mi predicción y el resultado obtenido

Según los criterios definidos en los apartados de Control y Resultado, los 5 ensayos se completaron con éxito. En mi predicción inicial dejé un margen de un posible intento fallido, ya que en un proceso probabilístico y no determinista siempre puede salir algo mal. De hecho, el comportamiento varió entre ensayos, por ejemplo en la creación de ramas y, en el último, en que no se generaron los tests. Con este criterio, mi predicción fue de 4/5 y el resultado fue de 5/5.

Sin embargo, la regla de `CLAUDE.md` también exigía actualizar el documento OpenAPI. Los criterios de Control y Resultado no contemplaban este requisito, y el documento no se actualizó en ninguno de los 5 ensayos. Con este criterio, mi predicción fue de 4/5 y el resultado fue de 0/5.

### Qué haría con ese resultado

Como el documento OpenAPI no se actualizó en ningún ensayo, reescribiría la regla de `CLAUDE.md` con una instrucción más clara y repetiría los ensayos para comprobar si mejoran los resultados.

Además, las dos condiciones de la regla se pueden verificar mediante código, así que añadiría una comprobación automática que garantice su cumplimiento, sin depender de que el agente las cumpla.

La regla reescrita solo se mantendría si reduce los fallos de esa comprobación, porque su valor está en que el agente acierte a la primera. Para medirlo, compararía cuántas veces falla la comprobación con la regla y sin ella, usando más de 5 ensayos, ya que con solo 5 no se puede sacar una conclusión sólida. Si no hay una diferencia apreciable, eliminaría la regla y me quedaría solo con la comprobación automática.

### Algo que la medición no está comprobando

- Falta de línea base: Mi intención era repetir los ensayos sin la regla para comparar, pero no había tiempo suficiente para hacerlo. Por tanto, aunque se midió el cumplimiento de la regla con los criterios indicados, no puedo saber qué parte del resultado se debe a las instrucciones y cuál habría conseguido el agente por sí solo.

- Comprobaciones incompleta: Los criterios de Control y Resultado no contemplaban la actualización del documento OpenAPI que exige la regla. Por eso la medición solo cubre una parte de lo que la regla pide.

- Muestra insuficiente: Con solo 5 ensayos, y dado el carácter no determinista del agente, no se pueden sacar conclusiones sólidas sobre la efectividad de la regla.
