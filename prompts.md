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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
/init
```

**Qué salió:** comando de Claude Code; ya existía un CLAUDE.md, así que lo revisó en lugar de crear uno nuevo.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito que me ayudes a analizar el requisito «Cuándo una tarea está vencida» antes de empezar a desarrollar los tests.

Por favor, revisa lo siguiente:

Lee completo el archivo openspec/specs/tasks/spec.md e identifica el Requirement «Cuándo una tarea está vencida» y todos sus Scenarios.

Explícame qué comportamiento se espera en cada Scenario, utilizando ejemplos sencillos.

Revisa cómo están estructurados los tests funcionales existentes en backend/tests/functional/.

Identifica qué archivos, utilidades y patrones existentes podemos reutilizar para nuestros nuevos tests.

Localiza la propiedad isOverdue y la función isOverdueOn para entender dónde se encuentra actualmente la lógica.

Confirma si ya existen pruebas relacionadas con este comportamiento.

Por ahora no quiero que modifiques ningún archivo ni escribas código. Tampoco quiero que corrijas errores de la implementación.

Primero quiero entender el requisito y conocer la estructura actual del proyecto para poder decidir cómo abordar las pruebas.

Al finalizar, comparte tus conclusiones y menciona cualquier duda que debamos resolver antes de comenzar.
```

**Qué salió:** funcionó a la primera. Detectó que `isOverdueOn` no comprueba `status !== 'done'`, que no hay tests de vencimiento y que CLAUDE.md está desactualizado respecto a los tests de `tasks`.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Vamos guardando los promts por favor para cumplir con la entrega
```

**Qué salió:** se rellenó este fichero con los prompts anteriores, en orden.

---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
amos guardando los promts por favor para cumplir con la entrega
```

**Qué salió:** mensaje repetido (con una errata) del anterior; los prompts ya estaban guardados, solo se añadió este.

---

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Primero escribiremos las pruebas y permitiremos que fallen cuando la implementación actual no cumpla la especificación. No debemos corregir ningún comportamiento de la aplicación.

Para la Parte A utilizaremos pruebas funcionales que ingresen por HTTP.

Para la Parte B crearemos pruebas unitarias independientes, sin servidor ni base de datos.

En los tests funcionales copiaremos localmente los helpers necesarios, sin extraerlos ni modificar los archivos de pruebas existentes.

Utilizaremos fechas fijas y enviaremos explícitamente el día de referencia en cada solicitud.

No modificaremos la carpeta duplicada flowsync-ai4devs-202609-seniors-1.

Restricciones importantes:

No modifiques ni crees archivos todavía.

No escribas código todavía.

No modifiques la implementación.

No toques archivos fuera de backend/tests/.

No cambies pruebas existentes.

No utilices fechas relativas al reloj del sistema.

Quiero revisar primero el diseño y confirmar que los siete escenarios están cubiertos antes de comenzar a escribir los tests.
```

**Qué salió:** un diseño con un test por scenario. Predijo bien que fallarían el 5 y el 6, pero no que la implementación fallaría también en el 1 y el 7 (ver Prompt 6).

---

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Confirmado, escribe overdue.spec.ts y guarda el prompt, el promt solo guarda la parte que no evidencie que te pedi hacer lo que corresponde a la tarea
```

**Qué salió:** `backend/tests/functional/tasks/overdue.spec.ts` con 7 tests: 4 pasan y 3 fallan (1, 5 y 7).

---

## Prompt 7

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito analizar los resultados de la ejecución de la Parte A.

La ejecución de make test-e2e terminó con 44 pruebas exitosas y 3 fallidas. Los tres fallos corresponden a los escenarios 1, 5 y 7 de overdue.spec.ts.

En los tres casos, la respuesta de GET /api/v1/tasks/:id devuelve isOverdue=false cuando el test esperaba true para una tarea con dueDate 2026-08-19 y today 2026-08-20.

Quiero que investigues la causa exacta de este comportamiento.

Revisa el recorrido completo del dato:

Cómo se guarda dueDate en el modelo Task.

Cómo se interpreta y compara en isOverdueOn.

Cómo se recibe today en el endpoint GET.

Cómo se calcula y devuelve isOverdue en TaskDetailTransformer.

También revisa si el test está creando correctamente la fecha y si existe alguna conversión de tipo o formato que explique el resultado.

Necesito que distingas entre un posible defecto de implementación y un posible error en el test.

Importante:

No modifiques ningún archivo.

No corrijas la implementación.

No cambies overdue.spec.ts.

No ejecutes cambios en la base de datos.

No agregues nuevas pruebas.

Al finalizar, explícame la causa con evidencia del código y dime qué ajuste sería necesario, si corresponde, para que los escenarios 5 y 7 puedan probar realmente sus respectivos cambios.
```

**Qué salió:** defecto de implementación, no del test. `pg` devuelve las columnas `date` como objeto `Date`, y `isOverdueOn` lo compara con un texto con `<`, que da siempre `false`. El arreglo es de implementación (parser de fechas del driver); el test 5 seguirá rojo después por la falta de la condición `status !== 'done'`.

---

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Necesito crear las pruebas unitarias para el método isOverdueOn de backend/app/models/task.ts, siguiendo los seis casos definidos en las instrucciones de la actividad:

Fecha anterior al día de referencia y tarea no completada.

Fecha igual al día de referencia.

Fecha posterior al día de referencia.

Tarea sin fecha de vencimiento.

Tarea completada con fecha anterior al día de referencia.

Comprobar el comportamiento cuando la fecha se proporciona como string y cuando se proporciona como objeto Date.

Antes de escribir, revisa el método y la estructura actual del modelo para identificar cómo construir las pruebas unitarias sin utilizar servidor ni base de datos.

Restricciones:

Crea únicamente los archivos necesarios dentro de backend/tests/unit/.

No modifiques backend/app/models/task.ts ni ningún otro archivo de implementación.

No cambies las pruebas funcionales de la Parte A.

No intentes corregir los fallos todavía.

No inventes resultados ni comportamientos.

Utiliza una fecha de referencia fija; no utilices la fecha actual del sistema.

Al terminar, explícame qué pruebas creaste, qué valida cada una y qué comando debo ejecutar para comprobarlas. Indica claramente cuáles pasan y cuáles fallan, basándote en la salida real.
```

**Qué salió:** `backend/tests/unit/models/task_is_overdue_on.spec.ts` con 8 tests: 5 pasan y 3 fallan (5 por la falta de `status !== 'done'`; 6b y 6c porque con un `Date` la comparación da siempre `false`).

---

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa el archivo backend/tests/unit/models/task_is_overdue_on.spec.ts que acabas de crear.

Confirma que incluye los seis casos solicitados en la Parte B.

Verifica que las pruebas sean unitarias y no dependan de servidor ni base de datos.

Confirma que no modificaste ningún archivo fuera de backend/tests/unit/.

Ejecuta make test-unit desde la raíz del repositorio.

Muéstrame el resultado real, indicando cuántas pruebas pasan y cuántas fallan, y cuáles corresponden al archivo nuevo.

No modifiques la implementación ni corrijas los fallos. Por ahora solo quiero revisar y documentar los resultados.
```

**Qué salió:** `make test-unit` da 8 tests, 5 pasan y 3 fallan (5, 6b y 6c), todos del archivo nuevo. Confirmó los seis casos, que las pruebas no usan servidor ni base de datos y que fuera de `backend/tests/unit/` solo se tocaron `prompts.md` (a petición) y el `overdue.spec.ts` de la Parte A.

---

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Necesito crear el archivo HALLAZGOS.md en la raíz del repositorio, siguiendo exactamente las instrucciones de la actividad.

Utiliza únicamente los resultados reales que ya obtuvimos:

Parte A: make test-e2e terminó con 44 pruebas aprobadas y 3 fallidas. Las tres fallidas corresponden a los escenarios 1, 5 y 7 de overdue.spec.ts.

Parte B: make test-unit terminó con 5 pruebas aprobadas y 3 fallidas. Los fallos corresponden a los casos 5, 6b y 6c del archivo task_is_overdue_on.spec.ts.

El documento debe contener exactamente los tres puntos solicitados por la actividad:

Cuántos casos nuevos fallaron y cuántos casos preexistentes pasaron, de acuerdo con la salida real.

Qué caso nuevo pasó y qué explicación se puede inferir a partir de lo que tienen en común los casos que fallaron.

Qué dudé o qué no pude verificar durante el ejercicio.

No inventes información ni atribuyas causas que no estén respaldadas por los resultados o el código revisado. Si algún punto no puede determinarse con certeza, indícalo expresamente.

Restricciones:

Crea únicamente HALLAZGOS.md.

No modifiques archivos de implementación ni pruebas.

No cambies prompts.md.

Muéstrame el contenido completo del archivo y el resultado de git status al terminar.
```

**Qué salió:** `HALLAZGOS.md` ya existía como plantilla de la sesión 10 y se sustituyó por los tres puntos de este ejercicio. Señala que los tres rojos esperan `isOverdue: true`, y que por HTTP nunca sale `true` porque `pg` devuelve la fecha como `Date`.
