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

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code (sesión en la nube, dentro de un proyecto de claude.ai)

````
MISIÓN: COMPLETAR Y ENTREGAR EL EJERCICIO FLOWSYNC — MÓDULO 10 AI4DEVS SENIORS
Actúa como un ingeniero de software senior especializado en Node.js, TypeScript, PostgreSQL, Docker, migraciones de bases de datos y análisis de regresiones.
Necesito que completes de principio a fin el ejercicio del módulo 10 de AI4Devs Seniors: «FlowSync: cambia el motor y averigua qué se ha perdido».
Tienes autorización para inspeccionar el repositorio, instalar dependencias, modificar código, ejecutar comandos y pruebas, crear commits, publicar una rama y abrir el Pull Request de entrega, utilizando las herramientas disponibles.
Quiero que ejecutes el trabajo completo de manera autónoma, no que te limites a proponer un plan.
1. DATOS IMPORTANTES
Mi usuario de GitHub es:
`diegolopezotero`
NO utilices `pulgosillo`.
Repositorio original:
`https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1`
Mi fork debe estar en:
`https://github.com/diegolopezotero/flowsync-ai4devs-202609-seniors-1`
Rama de partida:
`upstream/s10/start`
Rama de entrega:
`motor-dslo`
Fecha límite: 18 de noviembre de 2026, al final del día.
Trabajamos en macOS.
Si algún comando o ruta presupone Linux, adáptalo a macOS sin alterar las restricciones del ejercicio.
2. NORMAS DE TRABAJO
Debes cumplir estas reglas durante toda la ejecución:

1. Trabaja sobre el repositorio real, inspeccionando sus archivos y ejecutando comandos.
2. Lee `CLAUDE.md` y las instrucciones del proyecto antes de modificar nada.
3. No inventes resultados, métricas, consultas, pruebas superadas ni comportamientos.
4. No modifiques las migraciones existentes bajo ninguna circunstancia.
5. No elimines ni desactives pruebas para conseguir que pasen.
6. No suprimas errores de TypeScript mediante `any`, `@ts-ignore` ni mecanismos equivalentes para ocultar problemas.
7. Respeta la arquitectura y los contratos existentes.
8. Prioriza cambios pequeños, verificables y coherentes con el proyecto.
9. Comprueba realmente los resultados de los comandos.
10. No introduzcas secretos, contraseñas reales ni configuraciones privadas en Git.
11. No realices operaciones destructivas sobre datos preexistentes sin comprobar su alcance.
12. Conserva los hallazgos negativos: una comprobación que falla también es información importante.
13. No declares completada ninguna fase sin haberla verificado.
14. Si una estrategia falla, investiga la causa, corrígela y vuelve a comprobarla.
15. No detengas el trabajo entre fases para pedirme confirmación, salvo cuando necesites autenticación, permisos, una decisión con riesgo de pérdida de datos o información que no puedas obtener.

IMPORTANTE: Todos los prompts deben registrarse literalmente en `prompts.md`, desde este primero.
Este prompt debe incorporarse íntegramente, tal como lo has recibido, sin resumirlo ni reformularlo. Utiliza la plantilla existente, con un bloque de código por prompt y el nombre real de la herramienta y el modelo.
Si no tienes acceso al texto literal de algún prompt, indícalo y solicita que se aporte. Nunca inventes su contenido.
3. FASE 0 — INSPECCIÓN Y PREPARACIÓN DEL ENTORNO
Primero comprueba:

```
docker ps
node -v
make --version
git --version
git status
git branch -a
git remote -v
```

Necesitamos:

* Docker funcionando.
* Node.js 24 o superior.
* GNU Make.
* Git.
* Acceso a GitHub mediante SSH, HTTPS autenticado o GitHub CLI.

Comprueba también `gh auth status` si GitHub CLI está disponible.
Si falta alguna dependencia, intenta solucionar el problema utilizando las herramientas instaladas y las opciones apropiadas para macOS.
Después:

1. Localiza el repositorio en el directorio actual o en su entorno de trabajo.
2. Si no existe, clona mi fork. Si el fork todavía no existe, intenta crearlo usando GitHub CLI.
3. Configura `origin` apuntando a `diegolopezotero`.
4. Configura `upstream` apuntando al repositorio de LIDR.
5. Ejecuta `git fetch upstream`.
6. Comprueba si ya existe la rama `motor-dslo`.
7. Si no existe, créala desde `upstream/s10/start`.
8. Si existe, reutilízala y comprueba su relación con la rama de partida.
9. No sobrescribas cambios locales ni utilices `reset --hard`.
10. Comprueba que cualquier cambio que realices se incorpora a la rama correcta.

Inspecciona:

* `CLAUDE.md`
* `Makefile`
* `package.json` y sus equivalentes
* Configuración de base de datos
* Archivos de entorno
* Migraciones existentes
* `backend/database/schema.ts`
* Tests del backend
* Código que determina cuándo vence una tarea
* `HALLAZGOS.md`
* `prompts.md`

Identifica el framework, la biblioteca de acceso a datos, el mecanismo de migraciones y el generador de tipos.
4. FASE 1 — OBTENER UNA REFERENCIA INICIAL
Antes de cambiar el motor:

1. Ejecuta `make help`.
2. Ejecuta `make setup`, si el proyecto todavía lo necesita.
3. Ejecuta la batería original:


```
(cd backend && npm test)
```

4. Ejecuta la comprobación de tipos:


```
(cd backend && npm run typecheck)
```

5. Comprueba cómo arranca la aplicación con `make start`, cuando sea viable.
6. Registra los resultados reales iniciales.
7. Guarda la referencia de Git necesaria para comparar posteriormente el esquema generado con `upstream/s10/start`.

Si algo falla antes de la migración, distingue claramente ese fallo de los que aparezcan después.
No alteres las migraciones originales para conseguir que arranque.
5. FASE 2 — MIGRAR SQLITE A POSTGRESQL
Migra el proyecto para utilizar PostgreSQL en Docker.
Docker Compose
Crea `compose.yaml` en la raíz del repositorio.
Debe contener exactamente estos dos servicios de base de datos:

* `db`
* `db-test`

Ambos deben utilizar esta imagen:
`pgvector/pgvector:pg17`
Configuración obligatoria:
Desarrollo (`db`):

* PostgreSQL 17.
* Puerto del host: `54410`.
* Puerto del contenedor: `5432`.
* Almacenamiento persistente mediante un volumen Docker.
* Base de datos de desarrollo con credenciales locales configurables.
* Healthcheck que verifique que PostgreSQL acepta conexiones.

Pruebas (`db-test`):

* PostgreSQL 17.
* Puerto del host: `54411`.
* Puerto del contenedor: `5432`.
* Almacenamiento en memoria, sin volumen persistente.
* Healthcheck independiente.
* Credenciales y base de datos propias para pruebas.

La base de pruebas debe utilizar almacenamiento temporal en memoria, por ejemplo mediante `tmpfs` configurado correctamente para el directorio de datos de PostgreSQL.
No basta con omitir el volumen: asegúrate de que el almacenamiento de pruebas sea realmente en memoria.
No incluyas la clave `version:` en Compose.
Configuración del backend
Modifica la conexión y la configuración para utilizar PostgreSQL en lugar de SQLite.
Respeta las convenciones de la biblioteca de acceso a datos que realmente utiliza el proyecto.
Ten en cuenta:

* Diferencias de dialecto SQL.
* Tipos de datos.
* Fechas y marcas temporales.
* Booleanos.
* Identificadores.
* Parámetros de conexión.
* Consultas que dependan de comportamientos específicos de SQLite.

No realices sustituciones mecánicas sin investigar su semántica.
Entornos de desarrollo y pruebas
Configura archivos de entorno separados.
El framework de pruebas debe cargar automáticamente su propio entorno y utilizar exclusivamente `db-test`.
Comprueba que no exista riesgo de que una prueba borre o modifique datos de desarrollo.
No introduzcas secretos reales en archivos versionados.
Proporciona ejemplos de configuración cuando resulte necesario.
Migraciones
Las migraciones existentes deben permanecer absolutamente intactas.
No debes:

* Editar migraciones históricas.
* Reescribirlas para adaptar sintaxis.
* Cambiar sus nombres.
* Eliminar migraciones.
* Alterar su orden.
* Modificar sus checksums.

Si detectas una incompatibilidad de una migración antigua con PostgreSQL, investiga las alternativas válidas que no alteren esos archivos.
Si resolverla exige modificar una migración histórica, no lo hagas: documenta la incompatibilidad y continúa con las partes del ejercicio que todavía puedan verificarse.
Makefile
Añade los atajos necesarios para:

1. Arrancar ambas bases.
2. Detener ambas bases.
3. Esperar a que las dos estén saludables.
4. Ejecutar las migraciones de desarrollo.
5. Ejecutar las migraciones de pruebas.
6. Lanzar la batería de pruebas sobre `db-test`.

Integra estos cambios con los comandos existentes.
No dupliques innecesariamente funcionalidades.
Espera real de disponibilidad
Los healthchecks no son suficientes si los procesos siguen arrancando antes de tiempo.
Comprueba que las migraciones y las pruebas no empiezan hasta que PostgreSQL acepta conexiones.
Valida también el comportamiento tras detener y arrancar nuevamente ambos servicios.
6. FASE 3 — VALIDACIÓN DE LA MIGRACIÓN
Ejecuta las migraciones sobre ambas bases utilizando los comandos del proyecto.
Después ejecuta:

```
(cd backend && npm test)
```

La solución de referencia del ejercicio consigue 23 pruebas correctas, pero debes verificar cuántas existen realmente en esta rama.
No asumas que el resultado es correcto porque se imprimen pruebas verdes.
Comprueba también:

* Que los tests utilizan `db-test`.
* Que desarrollo y pruebas están aislados.
* Que la base temporal no utiliza volumen persistente.
* Que las migraciones históricas siguen intactas.
* Que el backend arranca y responde.
* Que el frontend sigue funcionando, si el entorno permite comprobarlo.
* Que las operaciones relevantes de lectura y escritura funcionan con PostgreSQL.

Si falla algo, investígalo y corrígelo sin romper las restricciones anteriores.
7. FASE 4 — INVESTIGAR QUÉ SE HA PERDIDO
Esta fase es especialmente importante.
Debes realizarla incluso si la migración queda parcialmente incompleta.
No basta con afirmar que las pruebas pasan.
Investigación A — Comprobación de tipos
Ejecuta:

```
(cd backend && npm run typecheck)
```

Registra:

* Si pasa o falla.
* Los errores relevantes, si existen.
* Qué relación tienen con el cambio de motor.
* Si el compilador detecta o no los posibles problemas funcionales.

No ocultes los errores para obtener una comprobación verde.
Investigación B — Comparar los tipos generados
Compara:
`backend/database/schema.ts`
contra la versión de:
`upstream/s10/start`
Utiliza Git para obtener el diff real.
Investiga todas las diferencias relevantes.
Si cambian declaraciones de tipos, documenta:

* Tabla.
* Columna.
* Tipo anterior.
* Tipo nuevo.
* Consecuencias para la aplicación.

Si el diff está vacío, NO concluyas automáticamente que no ha cambiado nada.
Investiga:

* Qué determina realmente los tipos generados.
* Qué parte depende de las declaraciones del proyecto.
* Qué parte depende del dialecto o del driver.
* Si SQLite y PostgreSQL interpretan de forma distinta los mismos valores.
* Si hay conversiones implícitas o dependencias que TypeScript no representa.

Explica la diferencia entre equivalencia de tipos estáticos y equivalencia de comportamiento.
Investigación C — Tareas vencidas
Busca en el código la implementación que determina si una tarea está vencida.
Localiza el comentario que justifica por qué funciona esa comparación.
Investiga:

1. Cómo se almacenaba la fecha en SQLite.
2. Cómo se almacena ahora en PostgreSQL.
3. Si la comparación dependía de un formato textual concreto.
4. Si influye el orden lexicográfico.
5. Si influyen la zona horaria y la representación de fechas.
6. Si el comentario sigue siendo válido.
7. Si las pruebas existentes cubren realmente ese comportamiento.

No presupongas cuál es el fallo: dedúcelo del código, del esquema y de los resultados observados.
Es obligatorio comprobarlo mediante una ejecución real.
Prepara una tarea con una fecha que inequívocamente ya haya vencido.
Ejecuta la operación real que determina si esa tarea está vencida.
Comprueba también, cuando sea pertinente, una tarea futura como control.
Compara:

* Resultado esperado.
* Resultado obtenido.
* Comportamiento anterior, si puedes reproducirlo.
* Comportamiento con PostgreSQL.

Si encuentras un problema, identifica exactamente su causa.
No sustituyas un problema funcional por un simple cambio cosmético del código.
No modifiques el comportamiento de negocio únicamente para conseguir pruebas verdes sin dejar constancia de la regresión original.
Si implementas una corrección, acompáñala de una prueba de regresión y documenta el problema que existía antes.
8. FASE 5 — IMPACTO SOBRE DATOS Y REVERSIBILIDAD
Esta parte es obligatoria para completar `HALLAZGOS.md`.
Debes determinar cuántas filas cambian realmente de valor durante el cambio de esquema o motor.
No inventes una cifra ni confundas cantidad de filas existentes con cantidad de filas modificadas.
Procedimiento:

1. Identifica las columnas afectadas por las transformaciones.
2. Determina qué valores existen realmente.
3. Construye una consulta SQL que mida las filas cuyos valores cambian.
4. Ejecútala sobre datos válidos disponibles.
5. Obtén el recuento exacto.
6. Comprueba si existe una diferencia entre cambios de representación, de tipo y de valor semántico.
7. Si no se modifican valores, registra cero y explica por qué.
8. Si no puedes medirlo por falta de datos o por bloqueo de la migración, documenta expresamente la limitación. No sustituyas un dato desconocido por cero.

Después clasifica el cambio dentro del árbol de reversibilidad explicado por el ejercicio.
Analiza especialmente:

* Si basta con revertir código.
* Si basta con revertir esquema.
* Si los datos pueden recuperarse sin pérdida.
* Si existe una transformación irreversible o pérdida de información.
* Si el comportamiento dependía del motor original.
* Qué tendría que conservarse para poder volver atrás.

No confundas la reversibilidad de una migración de datos con la posibilidad de volver a desplegar una versión anterior.
Si el árbol exacto no está disponible en el repositorio, utiliza las definiciones del material accesible y declara cualquier incertidumbre en la clasificación.
9. FASE 6 — COMPLETAR HALLAZGOS.md
El repositorio ya proporciona una plantilla de tres puntos.
Respeta esa estructura.
Añade una línea concreta debajo de cada punto.
Punto 1: Impacto y reversibilidad
Indica:

* Cuántas filas cambian de valor.
* Qué consulta ejecutaste para medirlas.
* En qué rama del árbol de reversibilidad cae el cambio.
* Una justificación breve.

Punto 2: Caso no cubierto por las pruebas
Identifica el comportamiento que la batería original no comprobaba.
Prioriza la investigación real sobre el cálculo de tareas vencidas.
Explica qué prueba faltaba y cómo comprobaste el comportamiento.
Si no encuentras un caso concreto, indica qué investigaste y dónde.
Punto 3: Dudas y limitaciones
Describe de forma concreta:

* Qué resultado te generó dudas.
* Qué comprobación no pudiste completar.
* Qué riesgo permanece.

No escribas tres frases genéricas sobre lo interesante que fue el ejercicio.
Quiero observaciones técnicas reales, escritas en español natural y en primera persona, como las escribiría yo: claras, concisas y sin lenguaje corporativo innecesario.
10. FASE 7 — DOCUMENTAR LOS PROMPTS
El archivo obligatorio es:
`prompts.md`
Debe estar en la raíz del repositorio.
Respeta la plantilla original.
Registra cada prompt que yo te envíe de manera literal.
Incluye:

* Herramienta: Claude Code.
* Nombre real del modelo utilizado.
* Prompt completo.
* Orden de ejecución.

Cada prompt debe estar en su propio bloque de código.
No inventes prompts intermedios atribuyéndomelos a mí.
Si tú utilizas instrucciones auxiliares o subagentes, puedes documentarlos por separado, identificándolos como tales.
Comprueba que el contenido es legible y que los bloques Markdown están correctamente delimitados.
11. FASE 8 — AUDITORÍA FINAL
Antes de realizar la entrega, comprueba todos los siguientes puntos:

* Estamos trabajando sobre `motor-dslo`.
* La rama procede de `upstream/s10/start`.
* `origin` apunta a `diegolopezotero`.
* Existe `compose.yaml`.
* El servicio `db` usa PostgreSQL 17 con pgvector.
* El servicio `db-test` usa la misma imagen.
* Desarrollo utiliza el puerto 54410.
* Pruebas utiliza el puerto 54411.
* Desarrollo tiene almacenamiento persistente.
* Pruebas utiliza almacenamiento en memoria sin volumen.
* Ambos servicios tienen healthchecks.
* Las migraciones esperan la disponibilidad real de las bases.
* El Makefile incluye los comandos necesarios.
* Las pruebas se conectan exclusivamente a `db-test`.
* Las migraciones originales no han sido modificadas.
* Se ha ejecutado la batería de pruebas.
* Se ha ejecutado `npm run typecheck`.
* Se ha comparado `backend/database/schema.ts` con la rama original.
* Se ha analizado el código de tareas vencidas y su comentario.
* Se ha probado realmente una tarea vencida.
* Se ha ejecutado una consulta para cuantificar los cambios de valores, o se ha documentado por qué no pudo hacerse.
* Se ha analizado la reversibilidad.
* `HALLAZGOS.md` contiene los tres resultados.
* `prompts.md` conserva los prompts literales disponibles.
* No se han introducido secretos.
* No se han realizado cambios innecesarios.

Ejecuta los comandos necesarios para respaldar cada verificación.
Comprueba especialmente que las migraciones originales no hayan cambiado mediante Git.
Examina el diff completo antes de hacer commit.
12. FASE 9 — COMMIT, PUSH Y PULL REQUEST
Una vez verificado el trabajo, prepara la entrega.
Crea un commit con un mensaje descriptivo, por ejemplo:
`feat: migrate FlowSync from SQLite to PostgreSQL and document findings`
Usa la identidad Git ya configurada para mi cuenta. No cambies mi configuración global de Git.
Publica la rama:

```
git push -u origin motor-dslo
```

Después abre un Pull Request usando GitHub CLI, si está disponible.
El PR debe tener:
Repositorio base:
`LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1`
Rama base:
`s10/start`
Repositorio origen:
`diegolopezotero/flowsync-ai4devs-202609-seniors-1`
Rama origen:
`motor-dslo`
Título sugerido:
`Módulo 10 - Migración PostgreSQL y análisis de regresiones`
En la descripción incluye:

* Resumen de la migración.
* Resultados de pruebas.
* Resultado del typecheck.
* Hallazgos funcionales.
* Estado de las migraciones originales.
* Limitaciones conocidas.

Comprueba mediante GitHub que el PR existe y que apunta al repositorio y a la rama correctos.
Si no puedes abrirlo por falta de permisos o autenticación, deja la rama preparada y facilita el enlace correcto para abrir manualmente el PR, sin afirmar que lo has creado.
13. QUÉ HACER SI SURGEN PROBLEMAS
No abandones el ejercicio ante el primer error.
Si Docker falla, investiga su configuración.
Si PostgreSQL no arranca, consulta sus logs.
Si falla una migración, localiza la incompatibilidad.
Si los tests fallan, identifica cuál es el problema.
Si el typecheck falla, analiza la causa y documenta lo descubierto.
Si no puedes completar la migración, continúa con la investigación de la parte B utilizando todo lo que sea técnicamente verificable.
Si encuentras un problema funcional que las pruebas no detectan, considéralo un hallazgo importante, no un inconveniente que debas ocultar.
Prioridad en caso de limitaciones de tiempo:

1. Conservar el trabajo realizado y evitar pérdidas.
2. Investigar la parte B y documentar los hallazgos.
3. Completar `HALLAZGOS.md` y `prompts.md`.
4. Publicar la rama y abrir el PR.
5. Seguir mejorando la migración si todavía es viable.

No dejes sin entregar el ejercicio únicamente porque no hayas conseguido completar todos los requisitos técnicos.
14. INFORME FINAL
Cuando termines, devuélveme un resumen en español con:

1. Estado de la migración: completa, parcial o bloqueada.
2. Pruebas: número exacto de pruebas ejecutadas, superadas y fallidas.
3. Typecheck: resultado.
4. Tipos generados: diferencias encontradas.
5. Tareas vencidas: comportamiento observado en la prueba real.
6. Reversibilidad: clasificación y número medido de filas modificadas, o limitación que impidió medirlo.
7. Migraciones históricas: confirmación de que siguen intactas, si se ha verificado.
8. Archivos modificados: relación de cambios relevantes.
9. Documentación: estado de `HALLAZGOS.md` y `prompts.md`.
10. GitHub: URL del Pull Request, si se ha creado realmente.

Distingue claramente los resultados verificados, los fallos y las hipótesis.
No presentes como completado lo que no hayas podido ejecutar o verificar.
INSTRUCCIÓN FINAL
Ejecuta ahora todas las fases, de principio a fin.
No quiero que te limites a explicar qué comandos debería ejecutar yo ni que te detengas después del análisis.
Investiga, implementa, prueba, documenta, revisa, haz commit, publica y abre el Pull Request cuando tengas acceso suficiente.
Trabaja con autonomía y criterio técnico, dando prioridad a los resultados reproducibles.
La finalidad del ejercicio no es simplemente sustituir SQLite por PostgreSQL: es demostrar qué puede cambiar silenciosamente en una aplicación aunque el código compile y las pruebas sigan pasando.
````

**Fidelidad:** copiado del mensaje tal y como quedó guardado en el chat del proyecto (lo comprobé
contra el original). Ese mensaje es texto plano: las secciones van numeradas (`1. DATOS IMPORTANTES`),
sin `#` ni negritas. Si en mi editor tenían formato, ese formato no llegó al chat y no lo puedo
recuperar; no lo he añadido a mano.

**Qué salió:** hizo la migración y la parte B entera en un Linux en la nube (Docker y Node 24); la sesión no tenía acceso de escritura a mi fork.

## Prompt 2

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code (sesión en la nube, dentro de un proyecto de claude.ai)

```
no ejecutes el PR sin mi autorizacion previa, termina todo lo demas y detente justo antes de hacer el pr
```

**Qué salió:** se paró antes de abrir el PR.

## Prompt 3

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code (sesión en la nube, dentro de un proyecto de claude.ai)

```
Quiero revisar personalmente los dos archivos de la entrega antes de publicar el PR.
Muéstrame el contenido COMPLETO y LITERAL de:

1. `HALLAZGOS.md`
2. `prompts.md`

Extrae ambos archivos directamente del último commit de la rama `motor-dslo`, mediante `git show HEAD:HALLAZGOS.md` y `git show HEAD:prompts.md`.
No resumas, no reescribas y no omitas ninguna parte, especialmente de los prompts.
Si la respuesta es demasiado larga, divídela en varios mensajes conservando íntegramente el contenido.
No modifiques archivos ni realices commits adicionales. Solo quiero inspeccionarlos.
```

**Qué salió:** me enseñó los dos archivos enteros, en cuatro mensajes, sin tocar nada.

## Prompt 4

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code (sesión en la nube, dentro de un proyecto de claude.ai)

El prompt dice «regístralo como `Prompt 3`», pero entre el 2 y este lancé el de revisar los
archivos, así que va como 4 para respetar el orden en que los lancé.

````
REVISIÓN FINAL — FLOWSYNC MÓDULO 10
Necesito que revises y corrijas la documentación del ejercicio antes de su entrega.
Estamos trabajando en el repositorio FlowSync, rama `motor-dslo`, con la cuenta de GitHub `diegolopezotero`.
La migración a PostgreSQL y las pruebas de regresión ya están implementadas. No quiero que rehagas el trabajo ni modifiques código funcional sin encontrar un error real.
El objetivo es corregir dos problemas de documentación y verificar que las afirmaciones estén respaldadas por las pruebas realizadas.
1. Corregir la medición de filas modificadas
En `HALLAZGOS.md` afirmamos que 0 filas cambian de valor basándonos en una consulta similar a:

```
count(*) FILTER (
    WHERE due_date IS DISTINCT FROM due_date::date::text
)
```

Esta consulta no compara los valores originales de SQLite con los valores migrados a PostgreSQL. Compara un valor de PostgreSQL consigo mismo después de una conversión.
Por tanto, no demuestra que los datos originales y los migrados sean idénticos.
Quiero que:

1. Inspecciones cómo se realizó realmente la migración de datos.
2. Identifiques si hubo transformación de valores o únicamente cambios de conexión, motor y representación.
3. Determinemos si se migraron datos existentes o si PostgreSQL se inicializó desde cero.
4. Revises los datos de desarrollo utilizados para obtener el recuento original.
5. Si tenemos ambos conjuntos de datos disponibles y es seguro hacerlo, construyas una comparación real entre origen y destino.
6. Distingas entre equivalencia semántica y representación física de los valores.
7. No accedas a copias de producción ni a `backups/` si las restricciones del proyecto lo prohíben.
8. Si no puede realizarse una comparación real, documentes explícitamente la limitación y no presentes el resultado como una comprobación concluyente.

No confundas una migración de motor con una migración que modifica valores de filas.
Mantén los resultados que estén realmente respaldados por las comprobaciones.
2. Revisar la clasificación de reversibilidad
Actualmente indicamos que el cambio cae en la rama «no toca datos: se deshace revirtiendo código y configuración».
Esta afirmación puede ser incompleta.
Quiero que investigues:

* Si se han modificado datos persistentes.
* Si sería posible volver a SQLite sin transformar datos.
* Si existen datos nuevos escritos exclusivamente en PostgreSQL.
* Si revertir código y configuración basta para conservar esos datos.
* Si hay cambios de representación de fechas o timestamps.
* Qué diferencia existe entre revertir el despliegue y revertir el estado de los datos.

Intenta localizar la definición exacta del árbol de reversibilidad en los materiales disponibles del proyecto.
No inventes categorías del curso que no estén documentadas.
Si no encuentras el árbol, utiliza una clasificación provisional claramente identificada como tal.
No afirmes que toda la migración es reversible únicamente porque las migraciones SQL originales no se hayan modificado.
3. Revisar el hallazgo de las tareas vencidas
La investigación actual indica:

* El driver `pg` devuelve una columna `date` como objeto JavaScript `Date`.
* `backend/database/schema.ts` mantiene `dueDate` como `string`.
* La comparación que determina si una tarea está vencida deja de funcionar al leerla desde PostgreSQL.
* El problema se reprodujo con una tarea de fecha 2026-01-15 y fecha actual simulada 2026-11-18.
* El `PUT` devolvía `isOverdue: true`, mientras que el `GET` devolvía `false`.
* Se añadieron tres pruebas de regresión.
* Se configuró el driver para devolver las fechas como texto.

Comprueba que estas afirmaciones siguen siendo correctas.
Revisa específicamente la explicación del desplazamiento de fecha al utilizar `Europe/Madrid`.
Distingue entre:

1. El valor almacenado en PostgreSQL.
2. Su conversión a un objeto JavaScript `Date`.
3. Su serialización como fecha y hora UTC.
4. Su interpretación por la aplicación.

No afirmes que PostgreSQL ha perdido un día de información si lo observado es una representación diferente del mismo valor.
Mantén las pruebas de regresión y la corrección funcional, siempre que sean correctas.
4. Revisar prompts.md
El ejercicio exige guardar literalmente cada prompt enviado por el usuario.
He detectado que el primer prompt parece haber perdido parte del formato Markdown original.
Necesito que compruebes:

* Si conservas el texto literal recibido.
* Si los encabezados, negritas, listas y bloques de código están completos.
* Si el orden de los prompts es correcto.
* Si figura el modelo realmente utilizado.
* Si figura Claude Code como herramienta.
* Si el segundo prompt está correctamente registrado.
* Si las instrucciones auxiliares están diferenciadas de las instrucciones del usuario.

Nunca reconstruyas un prompt y lo presentes como una transcripción literal.
Si tienes acceso al mensaje original exacto, recupéralo y úsalo.
Si no lo tienes, conserva el material disponible e indica claramente que no puedes garantizar la fidelidad literal.
Registra también este nuevo prompt, de forma íntegra, como `Prompt 3`, utilizando la estructura existente.
Evita que los delimitadores de bloques de código internos rompan el Markdown del documento.
5. Actualizar HALLAZGOS.md
Conserva la estructura original, con sus tres apartados.
Cada apartado debe tener una única línea de respuesta.
Quiero que esté escrito en español natural, en primera persona y con un estilo técnico pero directo.
La redacción debe reflejar lo que realmente comprobamos, no lo que suponemos.
Especialmente:
Apartado 1: número de filas realmente medido, alcance de la medición y clasificación de reversibilidad con sus limitaciones.
Apartado 2: regresión no cubierta por los tests originales, causa real y prueba que la demuestra.
Apartado 3: dudas, límites de la validación, riesgo de la configuración global del driver y comportamiento preexistente de las tareas `done`.
No añadas conclusiones genéricas.
6. Validación final
Después de realizar las correcciones:

1. Ejecuta `git diff` y revisa los cambios.
2. Comprueba que las migraciones históricas siguen intactas.
3. Verifica que no has cambiado código funcional innecesariamente.
4. Ejecuta `npm test` y `npm run typecheck` si el entorno está disponible.
5. Confirma si las 26 pruebas siguen pasando.
6. Comprueba que `HALLAZGOS.md` y `prompts.md` están correctamente formateados.
7. Comprueba que no se hayan incluido secretos ni información privada.
8. Actualiza el commit de la rama `motor-dslo` para incluir las correcciones. Si el commit anterior sigue siendo local y no publicado, puedes modificarlo mediante `git commit --amend`, siempre que no haya cambios ajenos que puedan perderse.

No cambies de rama.
No modifiques las migraciones originales.
No hagas push ni abras el Pull Request todavía.
7. Resultado que quiero recibir
Al terminar, muéstrame:

1. El contenido completo y actualizado de `HALLAZGOS.md`.
2. El índice de `prompts.md` indicando cuántos prompts contiene y si se conserva su literalidad.
3. Qué has corregido exactamente.
4. Las consultas SQL que respaldan el recuento de filas, sus resultados y sus limitaciones.
5. El resultado de las pruebas y del typecheck.
6. El hash del commit actualizado.
7. Cualquier duda técnica que permanezca.

No te detengas después de proponer los cambios: realiza todas las correcciones que puedas verificar, guarda los archivos y actualiza el commit.
Detente únicamente antes de publicar la rama y abrir el PR.
````

**Qué salió:** rehízo la medición con una copia real de SQLite a PostgreSQL, cambió la
clasificación de reversibilidad, precisó lo del huso horario y añadió los prompts 3 y 4.

---

## Instrucciones auxiliares (no son prompts míos)

Los prompts de arriba los recibió primero el coordinador del proyecto de claude.ai (otra
sesión de Claude), que se los pasó tal cual a la sesión que hizo el trabajo, añadiendo notas
suyas: copiar los prompts literales aquí (y, en el último, avisar de que el texto podía llegar
con `&&` escapado como HTML), no suplantar mi cuenta de GitHub si la sesión no tenía
acceso a mi fork, documentar que el entorno era Linux y no macOS, y no abrir el PR sin mi
autorización. No las copio literales porque nombran cuentas personales que no quiero publicar.
