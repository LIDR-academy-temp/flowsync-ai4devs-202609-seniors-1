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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Quiero añadir tests para el requisito **"Cuándo una tarea está vencida"**, definido en `openspec/specs/tasks/spec.md`.

Antes de escribir código, necesito que analices el requisito y cómo están organizados los tests actuales del proyecto.

Para ello:

1. Lee el requisito completo y todos sus Scenarios. Utiliza la especificación como fuente de verdad, independientemente de lo que haga actualmente la implementación.
2. Revisa los tests existentes en `backend/tests/functional/` para entender cómo se estructuran, cómo utilizan Japa y AdonisJS, cómo se autentican las peticiones y cómo se aíslan los datos entre tests.
3. Identifica los endpoints HTTP necesarios para crear tareas, consultarlas, cambiar su estado y modificar su fecha de vencimiento. Comprueba cómo se obtienen los identificadores de los recursos creados en los tests. No quiero utilizar IDs fijos ni asumir que la base de datos empieza con determinados valores; cada test debe trabajar con los identificadores reales que devuelve la API.
4. Comprueba cómo se proporciona el día de referencia mediante `today` y cómo se devuelve el campo `isOverdue` en las respuestas.
5. Propón un test funcional por cada Scenario del requisito, siguiendo las convenciones existentes y evitando pruebas redundantes.

Para cada test propuesto, indica:
- Nombre del test en inglés.
- Scenario que cubre.
- Datos necesarios para prepararlo.
- Petición HTTP que se realizará.
- Aserciones sobre la respuesta y el comportamiento que se pretende verificar.

Ten en cuenta que los tests deben comprobar el comportamiento observable desde la API, no métodos internos. Utiliza fechas de referencia fijas para que los resultados sean deterministas y la base de datos real de pruebas, respetando el aislamiento que ya utiliza el proyecto.

**De momento no modifiques ningún archivo ni escribas tests.** Tampoco cambies la implementación existente para adaptarla a los resultados esperados.

Quiero revisar primero la propuesta y asegurarme de que todos los escenarios quedan cubiertos antes de empezar a implementarlos.

No modifiques ningún archivo durante este análisis. Cuando pasemos a implementar los tests, los únicos archivos de código que se podrán crear o modificar estarán dentro de backend/tests/.
```

**Qué salió:** Se han identificado los siete escenarios del requisito y se ha detectado que la implementación actual no contempla el estado done al calcular isOverdue, por lo que se esperan fallos en los casos de tareas completadas.

---

## Prompt 2

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
La propuesta me parece correcta. Mantén los siete escenarios definidos en la especificación, sin añadir casos de otros requisitos.

Implementa los tests funcionales en `backend/tests/functional/tasks/overdue.spec.ts`, siguiendo la estructura, autenticación y aislamiento de los tests existentes.

Quiero un test por cada Scenario, con nombres en inglés y comprobando `isOverdue` en las respuestas HTTP.

Utiliza fechas de referencia fijas, los identificadores reales de los recursos creados y la base de datos de pruebas existente, sin mocks.

Para preparar los datos, puedes seguir el patrón de `Task.create` que ya utiliza el proyecto, pero las comprobaciones deben realizarse mediante peticiones HTTP. En los escenarios de cambio de estado o fecha, utiliza los endpoints correspondientes.

No modifiques ningún archivo fuera de `backend/tests/`. No cambies el modelo, los controladores ni los transformers, y no adaptes las expectativas de los tests al comportamiento actual.

Cuando termines, ejecuta `make test-e2e` y muéstrame cuántos tests nuevos pasan, cuántos fallan y si los tests que ya existían siguen pasando. Conserva los errores detectados sin corregir la implementación.
```

**Qué salió:** Se han creado siete tests funcionales; cuatro pasan y tres fallan, mientras que los 40 existentes siguen en verde. Los fallos apuntan a un posible problema de comparación entre fechas devueltas por PostgreSQL y el día de referencia.

---

## Prompt 3

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
He revisado los resultados de los tests funcionales. Antes de continuar, quiero entender mejor los tres fallos detectados.

Comprueba si el problema está relacionado con el tipo de dato que recibe `isOverdueOn()` desde PostgreSQL.

Revisa cómo se representa `dueDate` al recuperar una tarea y cómo se compara con el día de referencia. Si es posible, confirma el tipo real en tiempo de ejecución utilizando una comprobación de solo lectura, sin modificar el modelo ni ningún archivo de producción.

También quiero que compruebes que el archivo `overdue.spec.ts` contiene las aserciones corregidas para comparar las fechas por día y no por su representación ISO completa.

No cambies la implementación ni las expectativas de `isOverdue`. Mantén los fallos que reflejan incumplimientos del requisito.

Devuélveme una explicación breve de la causa confirmada o, si no puedes verificarla, indica qué evidencia falta.
```

**Qué salió:** Se ha comprobado que PostgreSQL devuelve dueDate como objeto Date, aunque el modelo lo declara como string. La comparación con el día de referencia devuelve false, lo que explica los tres tests funcionales fallidos.

---

## Prompt 4

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Quiero añadir tests unitarios para el método `isOverdueOn()` del modelo `Task`, definido en `backend/app/models/task.ts`.

Ya tenemos los tests funcionales y hemos detectado que la comparación de fechas puede comportarse de forma diferente según el tipo de dato recibido. Ahora quiero comprobar la regla de forma aislada, sin depender de HTTP ni de PostgreSQL.

Crea los tests dentro de `backend/tests/unit/`, utilizando Japa y la configuración existente del proyecto.

Necesito cubrir estos casos:

1. Una tarea `pending` con fecha anterior al día de referencia debe devolver `true`.
2. Una tarea `pending` con fecha exactamente igual al día de referencia debe devolver `false`.
3. Una tarea `pending` con fecha posterior al día de referencia debe devolver `false`.
4. Una tarea `pending` sin fecha de vencimiento debe devolver `false`.
5. Una tarea `done` con fecha anterior al día de referencia debe devolver `false`.
6. La misma fecha de vencimiento debe producir el mismo resultado tanto si se representa como `string` como si se representa como objeto `Date`.

Para los tests:

- Utiliza fechas fijas y nombres descriptivos en inglés.
- Construye las instancias del modelo con los datos mínimos necesarios, sin persistirlas en la base de datos.
- Llama directamente a `isOverdueOn()` y comprueba resultados booleanos concretos.
- Mantén los casos independientes entre sí.
- En la comparación de `string` y `Date`, utiliza exactamente el mismo día para ambas representaciones.
- Evita mocks innecesarios, dependencias externas y comprobaciones de detalles internos.

Restricciones:

- Solo puedes crear o modificar archivos dentro de `backend/tests/`.
- No modifiques `backend/app/models/task.ts` ni ningún otro archivo de producción.
- No cambies la implementación para hacer que pasen los tests.
- No adaptes las expectativas de los tests al comportamiento actual.
- No utilices PostgreSQL, peticiones HTTP ni el reloj del sistema.

Cuando termines:

1. Ejecuta `make test-unit`.
2. Indica cuántos tests pasan y cuántos fallan.
3. Explica qué comportamiento verifica cada fallo.
4. Distingue los errores de preparación de los tests de los incumplimientos reales de la regla.
5. Conserva en rojo los tests que detecten comportamientos incorrectos.

No quiero corregir la implementación, solo comprobar y documentar qué partes de la regla funcionan y cuáles no.
```

**Qué salió:** Se han generado seis tests unitarios de isOverdueOn(); cuatro pasan y dos fallan, detectando que la regla no excluye las tareas done y que devuelve resultados diferentes al recibir fechas como string o Date. Los fallos confirman que isOverdueOn() no excluye las tareas terminadas y compara incorrectamente las fechas cuando recibe objetos Date.

---

## Prompt 5

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Quiero resolver una última duda antes de cerrar los hallazgos, sin modificar la implementación.

Ya hemos confirmado que PostgreSQL devuelve las fechas como objetos Date y que `isOverdueOn()` se comporta de forma diferente con string y Date.

Necesito comprobar dos cosas:

1. Qué tipo real tiene `dueDate` cuando recuperamos una tarea mediante el modelo `Task` de Lucid.
2. Si los endpoints de cambio de estado y aplazamiento funcionan correctamente de forma independiente de la comprobación inicial de `isOverdue`.

Para la primera, utiliza una comprobación temporal con la base de tests y el mismo aislamiento existente, sin modificar archivos de producción.

Para la segunda, utiliza los tests funcionales actuales como referencia y comprueba las transiciones sin depender de una aserción previa que ya sabemos que falla.

No modifiques el modelo, los controladores ni los transformers. No cambies las expectativas del requisito ni elimines los tests en rojo existentes.

Si necesitas crear pruebas temporales, hazlo únicamente dentro de `backend/tests/` y elimínalas después de obtener los resultados.

Devuélveme los resultados observados, diferenciando claramente qué comportamientos has podido verificar y cuáles siguen sin estar demostrados. No añadas nuevos tests permanentes salvo que sean necesarios para cubrir un escenario que actualmente no esté comprobado.
```

**Qué salió:** .