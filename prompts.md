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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Puedes realizar la siguiente acción con mi cuenta de git sara-sanchez: ntra en https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1 y pulsa Fork.
```

**Qué salió:** el fork ya existía en la cuenta (creado el 2026-11-04) con el nombre `flowsync-ai4devs-202609-seniors-1-temp.`; no se creó otro.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Requiero haer lo siguiente, me comnfirmas por fsvor si se puede con el que ya tenemos o que propones hacer:

Clona tu fork y entra en la carpeta.
Añade el repositorio original como upstream y trae desde allí la rama de partida.
git remote add upstream https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1.git
git fetch upstream
git checkout -b s10/start upstream/s10/start
```

**Qué salió:** confirmó que se podía con el fork existente; propuso un clon limpio en `~/flowsync-s10` y renombrar el fork. No ejecutó nada.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
sí, hazlo así, con el renombrado del fork
```

**Qué salió:** fork renombrado a `flowsync-ai4devs-202609-seniors-1-fork`, clonado en `~/flowsync-s10` y rama `s10/start` creada desde `upstream/s10/start`.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
comprueba que cumples este punto: Trae la rama s10/start desde upstream. Si al crear el fork solo copiaste la rama predeterminada, tu copia tendrá main y git checkout s10/start devolverá el error did not match any file(s) known to git. Aunque hayas copiado todas las ramas, las que se publiquen después en el repositorio original tampoco se incorporarán automáticamente a tu fork.
```

**Qué salió:** comprobado: la rama sigue a `upstream/s10/start` y está al día; el fork no tenía `s10/start`.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
. Instala y arranca el proyecto

Ejecuta estos comandos desde la raíz del proyecto.

make setup
make start
```

**Qué salió:** `make setup` sin errores; `make start` no se lanzó desde el agente (el Makefile lo desaconseja fuera de una terminal) y en su lugar arrancó backend y frontend por separado con `npm run dev`.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Comprueba que ambos responden.
```

**Qué salió:** backend 200 en `:3333` y frontend 200 en `:5173`.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ejecuta las pruebas del backend

Ejecuta la batería de pruebas antes de modificar el proyecto. Así compruebas que el entorno funciona y tienes un resultado inicial con el que comparar después de la migración.

(cd backend && npm test)
```

**Qué salió:** 23/23 en verde con SQLite (línea de partida).

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea tu rama de trabajo

Desde s10/start, crea tu propia rama antes del primer prompt.

git checkout -b motor-<tus-iniciales>



, las iniciales son ssa
```

**Qué salió:** rama `motor-ssa` creada desde `s10/start`.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guarda esta instruccion: Entregarás desde esta rama. Si el agente guarda commits en otra, intégralos en la tuya con git merge <esa-rama> antes de subirla.
```

**Qué salió:** guardada en la memoria persistente del agente.

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
añádelo también al CLAUDE.md del proyecto, muestrame primero el texto que guardarias antes de hacerlo
```

**Qué salió:** mostró el texto propuesto y avisó de que `CLAUDE.md` se versiona; no escribió nada.

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Prediero usar CLAUDE.local.md
```

**Qué salió:** creado `CLAUDE.local.md` y excluido de git con `.git/info/exclude`.

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
A partir de aqui, vamos a comenzar a guardar los promts
```

**Qué salió:** empezó el registro en este fichero; la regla se guardó en `CLAUDE.local.md`. Los prompts anteriores a este se recuperaron después, literalmente, del historial de la conversación.

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Actúa como un ingeniero senior especializado en Node.js, bases de datos, PostgreSQL, Docker y testing.

Vamos a realizar una migración de SQLite a PostgreSQL en este proyecto.

Antes de realizar cualquier modificación, necesito que analices la estructura actual del repositorio y me entregues un diagnóstico técnico.

Revisa:

1. La estructura general del proyecto.
2. La configuración actual de SQLite.
3. El framework y la configuración del backend.
4. Las migraciones existentes y su ubicación.
5. La configuración actual de las pruebas.
6. El archivo Makefile, si existe.
7. El archivo de tipos generado `backend/database/schema.ts`.
8. La lógica que determina si una tarea está vencida.
9. Los archivos de entorno y la configuración de conexión a la base de datos.

Restricciones:

- No modifiques ningún archivo.
- No ejecutes migraciones.
- No elimines información.
- No modifiques las migraciones existentes.
- No inventes información que no esté respaldada por el código.
- Identifica los riesgos técnicos de realizar la migración.
- Indica qué archivos necesitarían modificarse y por qué.

Al finalizar, presenta un diagnóstico organizado y espera mi autorización antes de realizar cualquier cambio.
```

**Qué salió:** diagnóstico solo lectura sin tocar código; detectó que la regla `due_date: string` de `schema_rules.ts` oculta el cambio de tipo y que con `pg` `isOverdueOn` puede dejar de funcionar (pendiente de verificar).

## Prompt 14

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ejecuta lo siguiente:git status --short
```

**Qué salió:** solo aparece `M prompts.md`; ningún otro fichero modificado tras el diagnóstico.

## Prompt 15

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Confirmame que no eliminaste ningun archivo, solo lo modificaste y no lo moviste de su ubicacion
```

**Qué salió:** comprobado con `git status` y `git diff --name-status`: ningún fichero borrado ni movido; solo `prompts.md` modificado en su sitio.

## Prompt 16

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Actúa como un ingeniero senior especializado en Node.js, AdonisJS, Lucid, PostgreSQL, Docker y automatización de pruebas.

OBJETIVO GENERAL

Vamos a realizar la migración del proyecto de SQLite a PostgreSQL utilizando Docker, manteniendo dos bases de datos independientes:

Una base de datos para desarrollo.

Una base de datos para pruebas.

Ya realizaste un diagnóstico previo del proyecto. Utiliza los hallazgos de ese diagnóstico y vuelve a analizar los archivos antes de realizar cualquier modificación.

La prioridad es conseguir una migración técnicamente correcta, conservar las migraciones existentes y evitar alterar el comportamiento funcional del sistema.

1. DOCKER COMPOSE

Crear en la raíz del repositorio un archivo llamado compose.yaml.

Debe contener exactamente dos servicios:

db: PostgreSQL para desarrollo.

db-test: PostgreSQL para pruebas.

Ambos deben utilizar la imagen:

pgvector/pgvector:pg17

Configurar los puertos:

Desarrollo: 54410.

Pruebas: 54411.

Requisitos:

Base de desarrollo:

Debe conservar la información mediante un volumen persistente.

Debe permitir conexiones desde el backend utilizando el puerto 54410.

Base de pruebas:

Debe funcionar sin volumen persistente.

Los datos deben desaparecer al eliminar y recrear el contenedor.

Debe utilizar el puerto 54411.

Healthchecks:

Configurar una comprobación de salud en ambos servicios.

Utilizar pg_isready para comprobar que PostgreSQL acepta conexiones.

Configurar correctamente los intervalos, tiempos de espera y reintentos.

Configurar las dependencias necesarias para que los procesos que ejecutan migraciones o pruebas esperen a que las bases estén saludables.

Evitar errores de conexión durante el primer arranque.

No incluir la propiedad version: en compose.yaml.

2. CONFIGURACIÓN DE ADONISJS Y LUCID

Adaptar backend/config/database.ts para utilizar PostgreSQL mediante las variables de entorno correspondientes.

Requisitos:

Configurar correctamente el driver PostgreSQL.

Mantener las configuraciones necesarias de migraciones.

Conservar la configuración de generación de esquema.

Revisar la compatibilidad de la configuración actual de SQLite con PostgreSQL.

No copiar bloques de configuración comentados sin verificar que sean funcionales.

Instalar las dependencias necesarias para PostgreSQL y actualizar package-lock.json.

Revisar backend/start/env.ts y configurar la validación de las variables necesarias.

No introducir variables obligatorias que puedan romper otros procesos del proyecto, especialmente CI, sin analizar y resolver previamente sus implicaciones.

3. CONFIGURACIÓN DE ENTORNOS

Configurar los archivos de entorno de manera independiente.

backend/.env.example

Debe contener la configuración de desarrollo y utilizar el puerto 54410.

backend/.env.test

Debe contener la configuración de pruebas y utilizar el puerto 54411.

Garantizar que:

El framework cargue automáticamente el archivo de entorno de pruebas en el entorno correspondiente.

Las pruebas se conecten exclusivamente a db-test.

Las pruebas nunca utilicen accidentalmente la base de desarrollo.

Las variables de conexión estén correctamente configuradas.

No se incorporen secretos reales en archivos versionados.

Verificar también las implicaciones de los cambios sobre los procesos de CI y los comandos de ejecución existentes.

4. MAKEFILE

Modificar el Makefile existente y agregar atajos claros y consistentes para:

Levantar ambas bases de datos.

Detener ambas bases de datos.

Ejecutar las migraciones de desarrollo.

Ejecutar las migraciones de pruebas.

Ejecutar la batería de pruebas.

Facilitar la inicialización del entorno.

Los comandos deben garantizar que las bases estén saludables antes de ejecutar las migraciones o las pruebas.

Revisar los comandos existentes antes de modificarlos para evitar eliminar funcionalidades que todavía sean necesarias.

5. PROTECCIÓN DE LAS MIGRACIONES EXISTENTES

ESTA ES UNA RESTRICCIÓN CRÍTICA.

NO modificar, eliminar, renombrar, reescribir ni alterar ninguna migración existente.

Las cuatro migraciones identificadas durante el diagnóstico deben permanecer exactamente como están.

Si identificas que alguna migración necesita modificarse para funcionar con PostgreSQL:

DETENTE inmediatamente.

No realices el cambio.

Identifica el archivo involucrado.

Explica el problema técnico.

Describe por qué consideras necesario modificarlo.

Espera mi autorización.

No generes una solución que altere el historial de migraciones.

6. PRESERVACIÓN DEL COMPORTAMIENTO DE FECHAS: HALLAZGO PARA LA PARTE B

Durante el diagnóstico identificaste un posible cambio de comportamiento en la columna due_date al migrar de SQLite a PostgreSQL.

Actualmente, la lógica de vencimiento se encuentra en:

backend/app/models/task.ts

En particular, en el método:

Task.isOverdueOn(referenceDay)

La comparación actual utiliza:

this.dueDate < referenceDay

El comentario del código explica que esta comparación funciona porque ambos valores son cadenas de texto con formato yyyy-MM-dd.

Sin embargo, PostgreSQL puede devolver las columnas de tipo DATE como objetos Date de JavaScript, lo que podría alterar el resultado de la comparación.

Este comportamiento es uno de los principales puntos de investigación de la Parte B.

Por lo tanto, debes cumplir las siguientes restricciones:

NO modificar la lógica de vencimiento en backend/app/models/task.ts.

NO convertir manualmente los valores de fecha para ocultar posibles diferencias.

NO modificar database/schema_rules.js para forzar tipos.

NO modificar manualmente backend/database/schema.ts.

NO cambiar los tipos generados para forzar compatibilidad.

NO agregar una solución preventiva que impida observar el comportamiento original.

NO modificar el comentario existente para justificar un comportamiento que todavía no ha sido comprobado.

Una vez completada la migración, conserva la posibilidad de investigar:

Qué tipo de dato devuelve PostgreSQL al consultar due_date.

Qué valor y tipo de dato recibe Task.isOverdueOn().

Qué resultado produce la comparación actual.

Si una tarea cuya fecha de vencimiento ya pasó continúa identificándose como vencida.

Si el comportamiento difiere respecto al que se tenía con SQLite.

Si es posible comprobar estos puntos sin modificar la lógica de negocio, registra evidencia técnica de los resultados.

Si no es posible comprobarlos durante esta etapa, documenta la limitación y deja la investigación para la Parte B.

No declares que el comportamiento es correcto únicamente porque las pruebas generales pasen.

IMPORTANTE: El objetivo es descubrir si la migración introduce una regresión, no corregirla anticipadamente.

7. PROTECCIÓN GENERAL DEL PROYECTO

Cumplir las siguientes restricciones:

No abrir, leer, restaurar ni utilizar los backups de producción.

No modificar funcionalidades de negocio.

No modificar archivos ajenos al alcance de la migración, salvo que exista una necesidad técnica justificada.

No modificar manualmente archivos generados.

No eliminar pruebas existentes.

No cambiar las pruebas para hacer que pasen artificialmente.

No inventar resultados.

No afirmar que una validación pasó si no se ejecutó correctamente.

Si detectas alguna incompatibilidad que requiera modificar un componente fuera del alcance previsto, explica el problema y espera autorización cuando pueda comprometer las restricciones anteriores.

8. VALIDACIONES TÉCNICAS

Una vez implementados los cambios, realizar las siguientes comprobaciones:

Docker:

Validar la sintaxis de compose.yaml.

Levantar los dos servicios.

Comprobar que ambos estén saludables.

Verificar que desarrollo utiliza el puerto 54410.

Verificar que pruebas utiliza el puerto 54411.

Comprobar que db-test no tenga ningún volumen persistente.

Detener y volver a levantar los servicios para comprobar el comportamiento del arranque.

Bases de datos:

Comprobar que ambas bases sean independientes.

Ejecutar las migraciones de desarrollo.

Ejecutar las migraciones de pruebas.

Confirmar que las tablas se creen correctamente.

Pruebas:

Ejecutar la batería de pruebas existente.

Confirmar que las pruebas utilicen exclusivamente la base de pruebas.

Reportar el número de pruebas ejecutadas y su resultado.

No modificar la lógica de vencimiento para conseguir que pasen.

Migraciones:
Ejecutar:

git diff -- backend/database/migrations/

El resultado debe confirmar que ninguna migración existente fue modificada.

9. INFORME FINAL

Al terminar, presenta un informe técnico organizado con los siguientes apartados:

Archivos creados.

Archivos modificados.

Dependencias instaladas.

Configuración de Docker implementada.

Servicios y puertos configurados.

Resultado de los healthchecks.

Confirmación de que la base de pruebas no utiliza volúmenes persistentes.

Comandos disponibles en Makefile.

Resultado de las migraciones de ambas bases.

Resultado de la batería de pruebas.

Confirmación de que las migraciones originales permanecen intactas.

Posibles problemas pendientes.

Observaciones relacionadas con el comportamiento de las fechas.

Validaciones que no pudieron realizarse y sus motivos.

Distingue claramente entre las comprobaciones ejecutadas correctamente, las que fallaron y las que quedaron pendientes.

No declares terminada una actividad que no hayas podido comprobar.

FORMA DE TRABAJO

Antes de modificar archivos, presenta una lista de los archivos que planeas crear o modificar y explica brevemente el motivo de cada cambio.

Si encuentras que una migración existente necesita modificarse, DETENTE y espera autorización.

Una vez autorizado el plan de implementación, realiza los cambios necesarios dentro del alcance establecido.

Trabaja de forma ordenada, segura y verificable.

Mi prioridad es completar correctamente la migración sin perder la posibilidad de investigar los cambios de comportamiento que introduce PostgreSQL.
```

**Qué salió:** no tocó nada; presentó el plan de ficheros y detectó tres trampas antes de empezar: `.env.test` hereda de `.env` las variables que le falten, la imagen crea un volumen anónimo aunque no se declare, y `pg_isready` sin `-h` da por sana la base durante la inicialización. Pidió decidir sobre el seguro de tests, `better-sqlite3` y la documentación.

## Prompt 17

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Autorizo el plan de implementación con las siguientes decisiones y condiciones:

PROTECCIÓN DE LA BASE DE PRUEBAS

Sí, agrega la validación en tests/bootstrap.ts.

La batería de pruebas debe detenerse si detecta que:

DB_PORT no es 54411.

DB_DATABASE no es flowsync_test.

Verifica también que la conexión corresponda al servicio de pruebas y no a desarrollo.

La validación debe ejecutarse antes de que comiencen las pruebas y antes de realizar cualquier operación sobre la base de datos.

No modifiques las pruebas funcionales existentes para implementar esta protección.

DEPENDENCIA BETTER-SQLITE3

Sí, puedes desinstalar better-sqlite3, siempre que primero compruebes que no exista ninguna otra parte del proyecto que lo utilice.

Si encuentras otras dependencias de SQLite, detente y reporta dónde se utilizan antes de eliminarlas.

Actualiza package.json y package-lock.json correctamente.

DOCUMENTACIÓN

Sí, actualiza CLAUDE.md y AGENTS.md para reflejar la nueva arquitectura.

Realiza únicamente los ajustes necesarios relacionados con:

PostgreSQL como motor de base de datos.

Configuración de desarrollo.

Configuración independiente de pruebas.

Puertos de conexión.

Comandos disponibles en Makefile.

Ejecución de migraciones y pruebas.

Conserva las instrucciones y reglas existentes que no estén relacionadas con SQLite.

SERVIDORES ACTUALES

Sí, detén los servidores que actualmente utilizan SQLite antes de modificar la configuración.

Sin embargo, antes de detenerlos, realiza y registra la comprobación de línea base del comportamiento de las tareas vencidas utilizando SQLite, como propusiste en tu plan.

Conserva la evidencia del resultado para poder compararla posteriormente con PostgreSQL.

CONDICIONES ADICIONALES OBLIGATORIAS

No modificar ninguna migración existente.

No modificar la lógica de vencimiento de tareas.

No modificar database/schema_rules.js para alterar artificialmente los tipos.

No corregir anticipadamente el posible problema de las fechas.

No modificar manualmente backend/database/schema.ts.

No utilizar backups de producción.

No eliminar información de desarrollo.

No cambiar funcionalidades de negocio.

Para la base db-test, verifica mediante docker inspect que tmpfs esté funcionando realmente en memoria y que no exista un volumen persistente o anónimo para almacenar los datos de PostgreSQL.

Comprueba que al detener y recrear el contenedor de pruebas sus datos no permanezcan.

Para el healthcheck, comprueba que PostgreSQL esté disponible por TCP y que no se considere saludable durante la inicialización temporal de la imagen.

COMPROBACIÓN DEL COMPORTAMIENTO DE FECHAS

Antes de cambiar el motor, registra la línea base con SQLite.

Después de la migración, repite exactamente el mismo escenario con PostgreSQL.

Utiliza una tarea con fecha de vencimiento 2026-01-01 y una fecha de referencia 2026-11-17.

Registra:

Valor de dueDate.

Tipo de dato recibido por JavaScript.

Resultado de isOverdueOn().

Resultado obtenido mediante la consulta GET.

No modifiques la lógica para conseguir el resultado esperado.

Si el comportamiento cambia, conserva la evidencia para analizarlo en la Parte B.

EJECUCIÓN

Puedes comenzar la implementación siguiendo el plan autorizado.

Si aparece algún problema que requiera modificar una migración existente, detente inmediatamente y solicita autorización.

Si alguna validación falla, no intentes ocultar el error ni modificar funcionalidades para conseguir que pase.

Al terminar, presenta el informe técnico con los archivos modificados, comandos ejecutados, resultados obtenidos y problemas pendientes.

Confirma expresamente que las cuatro migraciones originales permanecen intactas.

También verifica que el prompt de autorización quede registrado en prompts.md en su propio bloque de código, conservando la plantilla existente e indicando el modelo y la herramienta utilizados.
```

**Qué salió:** migración hecha sin tocar ninguna migración; 23/23 en verde contra db-test. Confirmó la regresión: con PostgreSQL `dueDate` llega como `Date` y la tarea vencida el 2026-01-01 sale `isOverdue: false` (con SQLite era `true`); el typecheck sigue en verde. Un `make test` salió con 0 pruebas por un servidor de desarrollo que no paró bien; tras pararlo, 23/23 estable.

## Prompt 18

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
las 23 pruebas pasan contra db-test y se confirmó una regresión en el cálculo de vencimiento de tareas.

Trabaja sobre el estado actual del repositorio.

1. Reglas obligatorias

Conserva la rama actual motor-ssa.

No hagas commit ni push.

No corrijas la lógica de vencimiento.

No modifiques las migraciones existentes.

No modifiques manualmente backend/database/schema.ts ni backend/database/schema_rules.ts.

No alteres la evidencia existente.

No leas ni restaures backups/produccion-2026-10-02.dump.

No inventes resultados. Si algo no puede comprobarse, indícalo expresamente.

Antes de modificar HALLAZGOS.md o prompts.md, lee su contenido original y conserva su estructura y formato.

2. Parte B: comprobaciones

B.1 Typecheck

Ejecuta:

(cd backend && npm run typecheck)

Registra el resultado exacto: pasa o falla. Si falla, incluye el error.

B.2 Comparación de schema.ts

Compara backend/database/schema.ts de la rama actual contra la rama inicial s10/start.

Indica:

Si existen diferencias.

Qué declaraciones cambiaron.

El tipo anterior y el tipo actual de cada declaración modificada.

Si no existen diferencias, explica qué mecanismo mantiene los tipos declarados aunque haya cambiado el motor de base de datos.

No modifiques el archivo para alterar el resultado.

B.3 Comportamiento de fechas vencidas

Revisa backend/app/models/task.ts, especialmente Task.isOverdueOn().

Utiliza la evidencia obtenida en la comparación SQLite/PostgreSQL:

Tarea con dueDate = 2026-01-01.

Fecha de referencia 2026-11-17.

Documenta:

Tipo y valor de dueDate en SQLite.

Tipo y valor de dueDate en PostgreSQL.

Resultado de isOverdueOn('2026-11-17') en ambos motores.

Resultado observado mediante GET.

Diferencia observada mediante PUT y por qué puede ocultar la regresión.

Si el comentario del método sigue siendo válido.

Distingue claramente la regresión causada por el cambio de motor de la observación independiente: el código no comprueba el estado de la tarea, aunque el comentario y el documento de diseño indiquen que una tarea completada no debería vencer.

No soluciones ninguno de estos comportamientos. La finalidad es documentarlos.

3. Parte C: HALLAZGOS.md

Lee primero el archivo original HALLAZGOS.md.

Conserva exactamente sus tres puntos existentes y su estructura. Añade una línea debajo de cada punto, respondiendo a lo solicitado por la actividad:

Punto 1. Cambios de datos y reversibilidad

Determina cuántas filas cambian de valor como consecuencia del cambio de esquema.

Sustenta el resultado con una consulta verificable.

Identifica en qué rama del árbol de reversibilidad cae el cambio.

Si no cambian datos, indícalo expresamente y explica cómo se comprobó.

Punto 2. Caso fuera de la batería de pruebas

Identifica qué caso quedó fuera de las pruebas.

Si no se identificó otro caso, explica qué se buscó y en qué archivos o pruebas se revisó.

Considera especialmente la ausencia de pruebas para fechas vencidas.

Punto 3. Dudas o aspectos no comprobados

Documenta qué se dudó durante la migración.

Indica qué no se pudo comprobar.

Explica por qué quedó pendiente.

No sustituyas los puntos originales, no elimines contenido y no agregues conclusiones que no estén sustentadas.

4. Revisión de prompts.md

Lee prompts.md y verifica:

Que conserva la plantilla original de la actividad.

Que mantiene su nombre y ubicación.

Que contiene los prompts utilizados durante el trabajo.

Que cada prompt está en su propio bloque de código.

Que cada prompt identifica el modelo y la herramienta utilizados.

Que no se hayan eliminado instrucciones originales.

Si falta información, indícala antes de modificarla. Conserva el formato y completa únicamente lo que esté respaldado por el historial disponible. No inventes modelos, herramientas ni prompts que no puedas verificar.

5. Revisión final

Al terminar:

Ejecuta nuevamente git status --short --branch.

Ejecuta git diff --stat.

Ejecuta git diff --check.

Confirma que las cuatro migraciones originales siguen intactas.

Confirma que no se modificó la lógica de vencimiento.

Confirma que HALLAZGOS.md conserva sus tres puntos originales y tiene las líneas solicitadas.

Confirma el estado de prompts.md.

Presenta un resumen separado en:

Comprobaciones realizadas.

Archivos modificados.

Hallazgos confirmados.

Pendientes o limitaciones.

No hagas commit ni push. Espera mi revisión antes de continuar.
```

**Qué salió:** typecheck en verde y diff de `schema.ts` contra `s10/start` vacío (lo fija la regla de `schema_rules.ts`); escribió las tres líneas de `HALLAZGOS.md`: 0 filas cambian de valor almacenado, la batería no tiene ninguna prueba de vencimiento, y las dudas y lo que no se pudo comprobar. Sin commit.

## Prompt 19

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Vamos a realizar una última revisión antes de preparar la entrega. Conserva la rama motor-ssa.

No hagas commit ni push. No corrijas la lógica de vencimiento ni modifiques las migraciones.

1. Verificación del seguro de pruebas

Inspecciona backend/tests/bootstrap.ts.

Identifica los escenarios que ya fueron probados y el tercer escenario pendiente.

Comprueba si puedes validar ese escenario utilizando variables de entorno incorrectas, sin crear bases de datos adicionales y sin ejecutar pruebas contra la base de desarrollo.

Si la protección detiene la ejecución antes de conectarse a la base, registra el resultado.

Si no es posible comprobarlo de forma segura, déjalo pendiente y explica por qué.

2. Rama de reversibilidad

Consulta el README y el material disponible del ejercicio.

Verifica cuál es el nombre exacto de la rama del árbol de reversibilidad aplicable.

Comprueba si corresponde utilizar «no toca datos».

No cambies la clasificación si el material no permite confirmarla. En ese caso, indica la limitación.

3. Revisión de prompts.md

Compara el archivo con la plantilla original de la actividad.

Identifica qué instrucciones de preparación faltan.

Revisa si el nivel de razonamiento del modelo aparece en el historial disponible.

Recupera únicamente prompts y datos que puedas verificar.

No reconstruyas ni inventes prompts, modelos o niveles de razonamiento.

Si no puedes recuperar algún dato, documenta la limitación sin alterar la plantilla.

4. Backup de producción

No abras, leas, inspecciones ni restaures backups/produccion-2026-10-02.dump.

Mantén documentado que durante el diagnóstico inicial se consultó su cabecera, tal como ya fue reportado. No hagas ninguna otra operación sobre ese archivo.

5. Revisión de entrega

Ejecuta y presenta:

git branch --show-current

git status --short --branch

git diff --stat

git diff --check

Confirmación de que las cuatro migraciones siguen intactas.

Confirmación de que HALLAZGOS.md y prompts.md están incluidos entre los cambios.

Confirmación de que backend/.env no está siendo incluido en Git.

Presenta los resultados y los pendientes. No hagas commit ni push y espera mi autorización.
```

**Qué salió:** las comprobaciones 1 y 2 del seguro paran antes de conectarse (0,7 s y 1,4 s frente a 75,8 s del control que sí conecta); la 3 y la 4 no se pueden provocar de forma segura solo con variables. El material no nombra las ramas del árbol de reversibilidad. Recuperó del historial los 12 prompts de preparación (Prompt 1 a 12) y renumeró el resto; el nivel de razonamiento no consta en el historial. Sin commit.

## Prompt 20

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Realiza una última revisión de seguridad e integridad de la entrega previo a la autorización.

Por favor, realiza lo siguiente:

**1. compose.yaml**

- Revisa el contenido del archivo.
- Confirma que corresponde a lo solicitado en el README.
- Verifica que no incluya credenciales, información sensible o configuraciones que puedan afectar ambientes ajenos al entorno de pruebas.
- Confirma qué cambios representa y si debe incluirse en el commit.

**2. Archivos que se incluirán en la entrega**

- Revisa nuevamente `git status` y `git diff`.
- Identifica todos los archivos modificados y nuevos.
- Confirma que no se incluyan archivos locales, variables de entorno, información sensible, respaldos o archivos temporales.
- No elimines ni modifiques archivos sin justificarlo.

**3. Seguro de pruebas**

- Mantén identificadas las cuatro comprobaciones.
- No intentes conectar al servidor de desarrollo ni modificar configuraciones de red para forzar las pruebas 3 y 4.
- Documenta claramente cuáles se ejecutaron y cuáles permanecen pendientes, incluyendo la justificación técnica.

**4. Hallazgos y documentación**

- Verifica que `HALLAZGOS.md` refleje fielmente las limitaciones encontradas.
- No inventes el nombre de la rama del árbol de reversibilidad ni el nivel de razonamiento.
- Confirma que `prompts.md` conserve el contenido recuperado y su orden.

**5. Validaciones**

- Confirma el resultado de `git diff --check`.
- Verifica el estado de las migraciones frente a HEAD.
- Revisa el fallo de `openapi:check` y confirma si también se presenta en la referencia sin cambios.
- No modifiques migraciones, lógica de vencimiento ni el volcado de producción.

**6. Destino del PR**

- Revisa la documentación y configuración del repositorio para identificar el destino solicitado.
- No abras el PR hasta confirmar el repositorio correcto.

**Restricciones importantes:**

- No realices commit.
- No hagas push.
- No abras el PR.
- No modifiques la lógica de negocio.
- No realices cambios fuera del alcance.
- No inventes resultados ni marques como exitosas pruebas que no se ejecutaron.

Al finalizar, entrégame:

1. Resultado de cada validación.
2. Lista exacta de archivos que entrarían al commit.
3. Riesgos o pendientes que todavía existan.
4. Confirmación de que la entrega está lista para recibir autorización de commit.

Espera mi autorización antes de ejecutar cualquier operación de Git que modifique el historial o publique cambios.
```

**Qué salió:** sin secretos, correos ni `.env` en la entrega; `compose.yaml` cumple el README y es el único fichero nuevo. Corrigió en `HALLAZGOS.md` el «tercer chequeo» por «comprobaciones 3 y 4». `openapi:check` falla igual en `s10/start`. El destino del PR del README (`LIDR-academy/...`) da 404 con esta cuenta y el fork cuelga de `LIDR-academy-temp`: queda por confirmar. Sin commit.

## Prompt 21

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Autorizo realizar el commit de la entrega en la rama actual motor-ssa, bajo las siguientes condiciones:

Incluir exactamente los archivos identificados en la última revisión, incluyendo compose.yaml.

Respetar los hooks y validaciones configurados en el proyecto. No omitirlos ni forzar el commit.

No incluir archivos locales, variables de entorno, respaldos, archivos temporales ni información sensible.

No modificar migraciones, lógica de vencimiento, lógica de negocio ni el volcado de producción.

Mantener documentadas las comprobaciones 3 y 4 pendientes, así como las demás limitaciones identificadas.

No realizar push ni abrir el PR.

Al finalizar, proporcióname:

Hash del commit generado.

Mensaje utilizado.

Resultado de los hooks ejecutados.

git status posterior al commit.

Confirmación de que únicamente se incluyeron los archivos autorizados.

Si algún hook falla o aparece algún archivo adicional, detén el proceso y consúltame antes de realizar cambios adicionales.
```

**Qué salió:** commit de la entrega en `motor-ssa` con los 12 ficheros autorizados (incluido `compose.yaml`), pasando por el hook del proyecto; sin push ni PR.
