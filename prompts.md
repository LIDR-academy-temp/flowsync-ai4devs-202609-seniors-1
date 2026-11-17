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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito migrar la base de datos de FlowSync de SQLite a PostgreSQL, utilizando Docker para gestionar las bases de datos de desarrollo y testing.

Antes de realizar cualquier modificación, analiza el estado actual del proyecto:

- Estructura y arquitectura del proyecto.
- Configuración actual de la base de datos.
- Dependencias relacionadas con la persistencia de datos.
- Migraciones, modelos y relaciones existentes.
- Configuración y funcionamiento del entorno de testing.
- Generación de esquemas y tipos.
- Variables de entorno y comandos disponibles en el Makefile.
- Posibles incompatibilidades o riesgos derivados del cambio de motor.

Una vez realizado el análisis, presenta un plan de implementación que incluya:

- Archivos que sería necesario crear, modificar o eliminar.
- Cambios necesarios y justificación de cada uno.
- Riesgos asociados a la migración.
- Estrategia para verificar que el sistema sigue funcionando correctamente.

Sigue las convenciones y buenas prácticas existentes en el proyecto. Evita cambios innecesarios y mantén las migraciones existentes intactas.

En esta fase únicamente quiero el análisis y la propuesta de implementación. No modifiques ningún archivo hasta que revise y apruebe el plan.
```

**Qué salió:** Me ha permitido conocer el estado actual del proyecto, identificar los cambios necesarios para migrar a PostgreSQL y anticipar posibles incompatibilidades entre ambos motores antes de modificar el código.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Apruebo el plan de implementación, pero quiero limitar el alcance a los cambios estrictamente necesarios para migrar FlowSync de SQLite a PostgreSQL.

Requisitos:

- Crea un archivo `compose.yaml` con dos servicios: `db` y `db-test`.
- Utiliza la imagen `pgvector/pgvector:pg17`.
- Utiliza el puerto 54410 para desarrollo y el 54411 para pruebas.
- La base de datos de pruebas debe funcionar en memoria, sin volumen persistente.
- Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases de datos acepten conexiones.
- Omite la clave `version:` de `compose.yaml`.
- Configura la batería de pruebas para que se conecte a la base de datos de pruebas mediante su propio archivo de entorno, cargado automáticamente por el framework.
- Añade atajos en el Makefile para arrancar y detener las bases de datos, ejecutar las migraciones en ambas y lanzar las pruebas.
- Conserva intactas las migraciones existentes. Si consideras necesario modificar alguna, detente y explícame el motivo.

Restricciones adicionales:

- Conserva la dependencia `better-sqlite3` por ahora.
- No elimines el fichero de base de datos SQLite existente.
- No introduzcas parsers personalizados de fechas ni correcciones de posibles diferencias de comportamiento entre los motores. Las analizaremos posteriormente.
- No modifiques las reglas de generación de tipos, la lógica de negocio ni los tests existentes.
- No realices tareas de limpieza, refactorizaciones ni mejoras ajenas a la migración.
- No accedas a ningún archivo del directorio `backups/`, respetando la restricción de INC-0412.

Una vez implementados los cambios, comprueba:

1. Que ambos servicios arrancan correctamente.
2. Que las migraciones se ejecutan en ambas bases de datos.
3. Que las pruebas utilizan la base de datos PostgreSQL destinada a testing.
4. El resultado de la batería de pruebas existente.

Al finalizar, muestra los archivos modificados, justifica los cambios realizados e indica cualquier problema detectado.

No corrijas automáticamente las incompatibilidades de comportamiento que encuentres.

No modifiques `HALLAZGOS.md` ni `prompts.md`. No realices commits ni push hasta que haya revisado los cambios.
```

**Qué salió:** Me ha permitido migrar el proyecto a PostgreSQL, configurar las bases de datos de desarrollo y pruebas en Docker y adaptar el entorno sin modificar las migraciones existentes, realizando manualmente las comprobaciones que el sandbox impedía ejecutar.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Tras completar la migración de SQLite a PostgreSQL, he comprobado manualmente que las 23 pruebas del backend pasan, que las migraciones originales permanecen intactas y que npm run typecheck termina sin errores.

Necesito analizar el impacto del cambio de motor sobre los tipos del proyecto.

- Compara backend/database/schema.ts con su versión en upstream/s10/start.
- Si existen diferencias, identifica las declaraciones que han cambiado de tipo, indicando el tipo anterior, el nuevo y el motivo del cambio.
- Si el diff está vacío, investiga qué determina que los tipos se mantengan al cambiar de motor.
- Analiza el papel de schemaGeneration y schema_rules.ts en la generación de tipos.
- Identifica si existen diferencias entre los tipos declarados en TypeScript y los valores que pueden devolver ambos motores en tiempo de ejecución.

Justifica tus conclusiones con referencias al código existente y distingue los hechos comprobados de las hipótesis.

No modifiques ningún archivo ni corrijas las posibles incompatibilidades detectadas. No accedas al directorio backups/ ni realices commits o push.
```

**Qué salió:** Me ha permitido identificar por qué los tipos generados permanecen intactos tras la migración y detectar una posible incompatibilidad entre el tipo declarado de due_date y el valor devuelto por PostgreSQL en tiempo de ejecución.

---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito comprobar si la lógica de vencimiento de las tareas sigue funcionando correctamente después de la migración a PostgreSQL.

He revisado manualmente los archivos app/models/task.ts, database/schema_rules.ts y database/schema.ts.

Analiza el método isOverdueOn y contrasta su implementación con las reglas de negocio descritas en su comentario y con las reglas de generación de tipos.

Comprueba qué supuestos realiza la implementación y cuáles siguen siendo válidos después del cambio de motor.

Distingue los posibles errores introducidos por la migración de aquellos que ya existían anteriormente.

Revisa también qué casos relacionados con el vencimiento están cubiertos por los tests existentes y cuáles no.

Proporciona los pasos y comandos exactos para que pueda comprobar manualmente:

- Una tarea pendiente con fecha de vencimiento pasada.
- Una tarea que vence hoy.
- Una tarea con fecha de vencimiento futura.
- Una tarea completada con fecha de vencimiento pasada.
- Una tarea sin fecha de vencimiento.

Quiero comprobar el valor almacenado en PostgreSQL, el tipo recibido por el modelo y el resultado devuelto por la API.

Ten en cuenta las restricciones del sandbox para acceder a Docker. Las comprobaciones que no puedas ejecutar las realizaré manualmente.

Distingue los hechos comprobados de las hipótesis.

No modifiques ningún archivo, no añadas tests ni corrijas los posibles errores detectados. No accedas al directorio backups/ ni realices commits o push.
```

**Qué salió:** Me ha permitido identificar un error previo en la lógica de vencimiento, una posible incompatibilidad introducida por PostgreSQL y la ausencia de tests que cubran estos comportamientos, proporcionando los pasos para verificarlos manualmente.

---
