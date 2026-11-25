# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
Estamos realizando el módulo 11 del máster AI4Devs sobre FlowSync.

Registra este prompt íntegro y literal en prompts.md, respetando la plantilla existente e indicando el modelo y la herramienta utilizados.

Estado inicial:
- Rama tests-dslo, creada desde upstream/s11/start.
- Node.js 24.
- PostgreSQL de desarrollo y pruebas funcionando.
- 40 tests funcionales originales superados.
- Suite unitaria: NO TESTS EXECUTED.
- Repositorio limpio antes de comenzar.

Comprueba que puedes acceder a los hooks de seguridad y que no presentan errores. Si fallan, detente e informa.

Realiza exclusivamente la parte A del ejercicio.

Lee el Requirement completo «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md y todos sus Scenarios.

Revisa los tests existentes en backend/tests/functional/ y crea un único archivo de tests funcionales con un test independiente por cada Scenario del requisito.

Restricciones obligatorias:

- Entrar exclusivamente mediante HTTP.
- Comprobar el campo isOverdue del cuerpo de la respuesta.
- Pasar el día de referencia explícitamente en la petición.
- Utilizar fechas fijas, nunca el reloj del sistema.
- Respetar los mecanismos de aislamiento existentes.
- Utilizar los identificadores devueltos por la creación de los recursos.
- Derivar las expectativas de la especificación, no de la implementación actual.

Solo puedes crear tests dentro de backend/tests/functional/ y registrar este prompt en prompts.md.

No modifiques modelos, controladores, transformers, implementación, configuración, dependencias ni especificaciones.

El objetivo es detectar los defectos existentes mediante tests en rojo, NO corregirlos.

Ejecuta make test-e2e y guarda toda su salida en /tmp/flowsync-s11-e2e.log, conservando el código de salida real.

Informa de los siguientes resultados:

- Scenarios identificados.
- Archivo creado.
- Número de tests originales que siguen pasando.
- Número de tests nuevos que pasan y fallan.
- Valores esperados y obtenidos.
- Posible explicación técnica de los resultados.

No repitas instalaciones ni configuraciones del entorno. Si detectas un bloqueo de infraestructura, informa antes de modificar nada.

PROHIBIDO realizar commits, push, pull requests, merges, cambios de rama o publicar contenido en GitHub. Yo gestionaré personalmente la entrega.

Cuando termines, detente y espera mis instrucciones. No avances a la parte B ni corrijas la implementación.
```

**Qué salió:** 7 tests nuevos (4 en verde, 3 en rojo por defectos de la aplicación) y los 40 originales siguen pasando.

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
Continuamos con la parte B del módulo 11.

Registra este prompt íntegro y literal en prompts.md, en un bloque independiente, indicando el modelo y la herramienta utilizados. Conserva el registro del prompt anterior.

La parte A ha terminado con 40 tests originales en verde, 4 tests funcionales nuevos en verde y 3 en rojo.

Ahora realiza exclusivamente los tests unitarios.

Lee el método isOverdueOn de backend/app/models/task.ts, la especificación correspondiente y la configuración existente de los tests.

Crea el directorio backend/tests/unit/ y un archivo de tests unitarios que invoque directamente isOverdueOn, sin servidor HTTP ni acceso a la base de datos desde los tests.

Implementa exactamente estos seis casos independientes:

1. Fecha anterior al día de referencia y tarea sin hacer: vencida.
2. Fecha exactamente igual al día de referencia: no vencida.
3. Fecha posterior al día de referencia: no vencida.
4. Tarea sin fecha: no vencida.
5. Tarea ya hecha con fecha pasada: no vencida.
6. Comprobar que la regla se comporta igual cuando recibe la fecha como texto o como objeto de fecha. Utiliza los tipos y representaciones reales del proyecto y comprueba también el valor esperado para evitar falsos positivos.

Este sexto caso es especialmente relevante por el defecto de representación de fechas descubierto durante la parte A.

Restricciones:

- Utiliza fechas fijas y deterministas.
- No hagas mocks del método bajo prueba.
- No modifiques los tests funcionales de la parte A.
- No modifiques implementación, configuración, dependencias, modelos, controladores, transformers ni especificaciones.
- No adaptes las expectativas para conseguir que los tests pasen.
- Solo puedes crear archivos dentro de backend/tests/unit/ y actualizar prompts.md.
- No reinstales dependencias ni reconfigures el entorno.
- No desactives ni modifiques los hooks de seguridad.

Ejecuta make test-unit y guarda su salida completa en /tmp/flowsync-s11-unit.log, conservando el código de salida real.

Después ejecuta make test y guarda su salida completa en /tmp/flowsync-s11-final.log, conservando igualmente el código de salida real.

Informa de:

- Archivo creado.
- Resultado esperado y obtenido de cada uno de los seis casos.
- Número de tests unitarios correctos y fallidos.
- Resultado global de todos los tests funcionales y unitarios.
- Explicación técnica de los fallos.
- Posibles falsos positivos.
- Relación entre los defectos detectados en la parte A y la parte B.

No corrijas ningún defecto de implementación.

PROHIBIDO realizar commits, push, pull requests, merges, cambios de rama o publicar contenido en GitHub.

Cuando termines, detente y espera mis instrucciones. No avances a la parte C ni a la entrega.
```

**Qué salió:** 6 tests unitarios (4 en verde, 2 en rojo por defectos de la aplicación); la suite completa queda en 48 en verde y 5 en rojo.

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
Vamos a completar la parte C del módulo 11 y realizar la auditoría final antes de la entrega.

Registra este tercer prompt íntegro y literal en prompts.md, indicando modelo y herramienta, conservando los dos prompts anteriores.

Revisa los tests creados y las salidas reales de:

- /tmp/flowsync-s11-baseline.log
- /tmp/flowsync-s11-unit-baseline.log
- /tmp/flowsync-s11-e2e.log
- /tmp/flowsync-s11-unit.log
- /tmp/flowsync-s11-final.log

Los resultados comunicados hasta ahora son 40 tests originales correctos, 4 funcionales nuevos correctos, 3 funcionales nuevos fallidos, 4 unitarios correctos y 2 unitarios fallidos. Contrasta estas cifras con los logs.

Crea HALLAZGOS.md en la raíz del repositorio, con exactamente tres puntos, tal como exige el enunciado:

1. Cuántos casos nuevos fallaron y cuántos de los originales siguieron en verde. Diferencia funcionales y unitarios.
2. Qué casos nuevos pasaron y por qué. Explica los dos defectos encontrados y los posibles falsos verdes, de manera breve y concreta.
3. Qué dificultades técnicas o limitaciones reales aparecieron y qué comportamientos no se pudieron comprobar. No inventes dudas personales del alumno.

Redacta los hallazgos en castellano, de forma natural, breve y técnica. No inventes resultados.

Realiza una auditoría final mediante git status, git diff y la comparación con upstream/s11/start, incluyendo los archivos nuevos no rastreados.

Comprueba que los únicos archivos modificados o añadidos son:

- backend/tests/functional/tasks/overdue.spec.ts
- backend/tests/unit/tasks/is_overdue_on.spec.ts
- prompts.md
- HALLAZGOS.md

Verifica que los prompts están registrados íntegramente, cada uno en su propio bloque de código, con modelo y herramienta, sin restos del ejemplo de la plantilla ni metadatos duplicados.

Verifica que la implementación permanece intacta, que estamos en tests-dslo y que los tests utilizan fechas deterministas.

Solo puedes modificar HALLAZGOS.md y prompts.md durante esta fase.

No repitas instalaciones ni ejecuciones de tests si los logs existentes son suficientes.

PROHIBIDO realizar commits, push, pull requests, merges, cambios de rama o publicar contenido en GitHub.

Cuando termines, muestra el contenido completo de HALLAZGOS.md, el resumen de la auditoría y detente. Yo realizaré personalmente la entrega.
```

**Qué salió:** `HALLAZGOS.md` con los tres puntos, cifras contrastadas con los logs y auditoría final, sin tocar la implementación.
