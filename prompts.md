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

Los cinco primeros (0.1 a 0.5) son anteriores a la numeración: los añadí después, en el orden en
que los lancé. Quedan fuera los de mantenimiento («guarda este prompt en prompts.md como Prompt N»).

## Prompt 0.1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
vamos con el ejercicio
```

**Qué salió:** no tenía el enunciado; pidió que pegara la lección.

## Prompt 0.2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

````
este es el ejercicio 

⏱ La fecha límite es miércoles 18 de Noviembre al final del día.
Repositorio: [FlowSync](https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1)
Esta es la última lección antes del directo. Aquí tienes los pasos para preparar el proyecto, hacer el ejercicio y entregarlo.
🚨 Guarda cada prompt tal como lo envías, desde el primero. Así podremos revisar cómo le pediste cada paso al agente sin que tengas que reconstruir los prompts de memoria.
Migra el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. Después, comprueba qué se ha perdido con el cambio de motor, incluso si las pruebas pasan.
En el directo, el mentor resolverá el mismo encargo con el mismo proyecto y las mismas restricciones. Los prompts los escribes tú.
El ejercicio tiene tres partes. En la A cambias el motor, en la B investigas qué se ha perdido y en la C recoges tus hallazgos en tres líneas.
🔁 Cómo funciona este módulo
El ejercicio se desarrolla en tres etapas:
1. Lo intentas tú. Trabaja con tu agente sobre el proyecto de abajo, dentro del tiempo indicado. Entrega lo que hayas conseguido, aunque esté incompleto: este paso no se puntúa por completarlo. En el directo se tratarán las dificultades que pueden surgir durante este primer intento.
2. Lo ves resuelto en el directo. El mentor hace la misma migración. Podrás comparar su recorrido con el tuyo y ver cómo resuelve los problemas que encontraste. Conviene mirar sin teclear. Después podrás repetirlo con calma.
3. Lo replicas. Recibirás por escrito los prompts del mentor. Úsalos para repetir el ejercicio en tu entorno.
⚠ En el paso 3 no esperes salidas idénticas. Con el mismo prompt, la inteligencia artificial (IA) puede cambiar los nombres de las variables, el orden de los servicios en Compose o la cantidad de atajos en el Makefile. Repite los pasos del ejercicio con las mismas restricciones.
🛠 Deja el entorno listo
1. Comprueba los requisitos de tu máquina
En la lección anterior instalaste las herramientas. Antes de preparar el proyecto, comprueba que las cuatro responden en tu terminal.

```
docker ps
node -v
make --version
git --version

```

* `docker ps` debe mostrar una tabla, aunque esté vacía. Si devuelve `Cannot connect to the Docker daemon`, comprueba que Docker esté en marcha. Si está instalado y cerrado, ábrelo y vuelve a ejecutar el comando.
* `node -v` debe devolver `v24` o superior. Es la versión mínima que declara el mapeador de base de datos del proyecto. Con Node 20, la instalación falla con `Unknown file extension ".ts"`. Con Node 22, el proyecto arranca con un aviso de incompatibilidad.
* `make --version` debe mostrar `GNU Make` y un número de versión.
* `git --version` debe mostrar una versión reciente de Git.

🪟 En Windows, trabaja dentro de WSL. El proyecto se levanta con `make`, que no viene incluido de forma nativa en Windows. Los atajos del proyecto usan comandos de shell como `cp`, `test` y `rm`.
Haz todo dentro de WSL. Instala Node y `make` allí, clona el repositorio y ejecuta los comandos de esta lección desde esa terminal. Clona el proyecto dentro del sistema de archivos de Linux (`~/…`) para evitar problemas de rendimiento al instalar dependencias en `/mnt/c`.
⚠ Comprueba que tu distribución de WSL incluye `make`. Ejecuta `make --version`. Si el comando no está disponible, instala `make` con el gestor de paquetes de tu distribución.
2. Crea tu fork y clona el proyecto
Trabaja sobre tu propio fork. Desde allí abrirás el pull request hacia el repositorio del curso.

1. Entra en https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1 y pulsa Fork.
2. Clona tu fork y entra en la carpeta.
3. Añade el repositorio original como `upstream` y trae desde allí la rama de partida.


```
git remote add upstream https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1.git
git fetch upstream
git checkout -b s10/start upstream/s10/start

```

🚨 Trae la rama `s10/start` desde `upstream`. Si al crear el fork solo copiaste la rama predeterminada, tu copia tendrá `main` y `git checkout s10/start` devolverá el error `did not match any file(s) known to git`. Aunque hayas copiado todas las ramas, las que se publiquen después en el repositorio original tampoco se incorporarán automáticamente a tu fork.
3. Instala y arranca el proyecto
Ejecuta estos comandos desde la raíz del proyecto.

```
make setup
make start

```

* `make setup` se ejecuta una vez. Instala las dependencias del backend y del frontend, crea los archivos de configuración y prepara la base de datos. Puede tardar unos minutos.
* `make start` arranca el backend y el frontend en la misma terminal. `Ctrl-C` detiene ambos.
* `make help` lista los atajos del proyecto. Consúltalos antes de seguir.

Comprueba que ambos responden.

* Backend. Desde otra terminal, ejecuta `c`u`rl -s http://localhost:3333` para comprobar que el servidor responde en `http://localhost:3333`.
* Frontend. Abre `http://localhost:5173` en el navegador.

4. Ejecuta las pruebas del backend
Ejecuta la batería de pruebas antes de modificar el proyecto. Así compruebas que el entorno funciona y tienes un resultado inicial con el que comparar después de la migración.

```
(cd backend && npm test)

```

📌 Los paréntesis ejecutan las pruebas en una subshell. El comando entra en `backend/`, pero tu terminal se queda en la raíz, donde está `CLAUDE.md`.
5. Crea tu rama de trabajo
Desde `s10/start`, crea tu propia rama antes del primer prompt.

```
git checkout -b motor-<tus-iniciales>

```

Entregarás desde esta rama. Si el agente guarda commits en otra, intégralos en la tuya con `git merge <esa-rama>` antes de subirla.
📋 La tarea
🅰 Parte A: cambia el motor
Pídele a tu agente que migre el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. Pásale las mismas restricciones que se usarán en el directo.

* El archivo de Compose se llama `compose.yaml` y define dos servicios, `db` y `db-test`.
* Usa `pgvector/pgvector:pg17`, que incluye PostgreSQL 17 con la extensión pgvector.
* Usa los puertos 54410 para desarrollo y 54411 para pruebas. Así evitas un conflicto si ya tienes una instancia de PostgreSQL en el 5432.
* La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.
* Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.
* Omite la clave `version:` de `compose.yaml`. Está obsoleta y Docker muestra un aviso si la incluyes.
* Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.
* Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.

Conserva intactas las migraciones existentes. Si el agente propone modificar alguna, detente y anótalo como hallazgo.
🅱 Parte B: averigua qué se ha perdido
Haz esta parte aunque la migración quede incompleta. Si las pruebas vuelven a pasar, sigue con estas tres comprobaciones y anota lo que observes.

1. Ejecuta la comprobación de tipos (`(cd backend && npm run typecheck)`) y anota si pasa o falla. Las dos respuestas son normales, y las dos enseñan algo.
2. Compara el archivo de tipos generado (`backend/database/schema.ts`) con el de la rama de partida. El diff puede mostrar declaraciones cambiadas o salir vacío, y las dos salidas son normales. Si hay cambios, indica qué declaraciones cambiaron de tipo y anota, para cada una, el tipo anterior y el nuevo. Si el diff está vacío, busca qué fija esos tipos al cambiar de motor: vacío no significa que no haya cambiado nada, sino que lo que cambió no está en lo que el proyecto declara.
3. Busca cómo decide el proyecto si una tarea está vencida. Lee el comentario que explica por qué funciona esa comparación y contrástalo con lo que encontraste en el paso anterior. Indica si sigue siendo válido y compruébalo con una tarea que ya debería estar vencida, no solo leyendo el código.

Parte C: las tres líneas
Escribe tus hallazgos en `HALLAZGOS.md`, en la raíz del proyecto. La rama de partida ya incluye los tres puntos. Añade una línea debajo de cada uno.

1. Cuántas filas cambian de valor con el cambio de esquema, medido con una consulta, y en qué rama del árbol de reversibilidad cae el cambio. Si tu migración no modifica datos, indícalo.
2. Qué caso quedó fuera de la batería de pruebas. Si no encontraste ninguno, explica qué buscaste y dónde.
3. De qué dudaste o qué no pudiste comprobar.

💡 Entrega lo que hayas conseguido, aunque la parte A quede incompleta. Prioriza la parte B y anota qué te costó o qué quedó por comprobar.
Cómo saber que la has hecho bien

* Las migraciones existentes siguen intactas. Compruébalo con `git diff` sobre la carpeta de migraciones. Si cambió una migración anterior, también cambió la referencia que usas para medir el impacto.
* La base de pruebas funciona sin volumen. Así, los datos de una ejecución no se conservan para la siguiente.
* El arranque espera a que los dos servicios estén listos. Detenlos y vuelve a arrancarlos. Si la primera migración falla porque se rechaza la conexión, revisa cómo se está aplicando la comprobación de salud.
* La primera línea indica cuántas filas cambiaron de valor. Usa una consulta para obtener el recuento exacto y anota el resultado, aunque sea cero.
* Las tres líneas son concretas. En la segunda puedes escribir «no encontré ninguna» si también dices qué buscaste y dónde.

📤 Cómo se entrega

1. Entrega desde la rama `motor-<tus-iniciales>` que creaste a partir de `s10/start`.
2. Guarda tus prompts en `prompts.md`, en la raíz del repositorio. Usa la plantilla de la rama de partida y conserva el nombre y la ubicación del archivo que lee la herramienta de revisión.
   * Pon cada prompt en su propio bloque de código, con el modelo y la herramienta que usaste. Así se distingue dónde empieza y termina cada uno.
3. Sube tu rama a tu fork (`git push -u origin motor-<tus-iniciales>`) y abre el pull request desde tu fork hacia el repositorio del curso (`github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1`). Comprueba que GitHub propone ese repositorio como base e incluye `HALLAZGOS.md` y `prompts.md` en la entrega.

El plazo
Abre el pull request antes del directo. Lo que llegue después no se podrá tratar en la sesión.
📚 Si vas justo de tiempo
Prioriza la lección sobre por qué una migración es el cambio que peor se deshace, que te ayudará con la parte B, y la lección sobre por qué el agente no se inventa las columnas sino los valores.
Las cuatro lecciones sobre consultas complejas son obligatorias, pero puedes verlas después de entregar. Las cuatro sobre campos vectoriales son opcionales y tienen una ampliación en la lección de recursos.
Si te queda poco tiempo, prioriza la parte B, aunque la migración siga a medias.
````

**Qué salió:** sin restricciones propias, el agente empezó la parte A por su cuenta (bases arriba, migraciones y tests) antes de que existiera mi rama de trabajo, y tuve que pararlo. Ese intento quedó guardado en `git stash` (`intento-claude-parte-A`) y se rehízo desde cero.

## Prompt 0.3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
antes de iniciar no construyas nada lo primero es git checkout -b motor-xx
(cd backend && npm test) 2>&1 | tee /tmp/baseline-tests.txt como lo hago
```

**Qué salió:** se paró y explicó el estado (rama `motor-rm` ya creada con cambios sin commitear) y los pasos para apartarlos y empezar limpio.

## Prompt 0.4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
haz tú los pasos 2 a 6
```

**Qué salió:** el paso 2 (stash) ya lo había hecho yo; borró contenedores y volumen del intento, recreó `motor-rm` desde `s10/start` y guardó la referencia: 23/23 en SQLite en `/tmp/baseline-tests.txt`.

## Prompt 0.5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
copia la referencia a ~/baseline-tests.txt
```

**Qué salió:** copiada; sigue diciendo `Tests 23 passed (23)`.

## Prompt 1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Antes de cambiar nada, quiero entender el proyecto. NO modifiques ningún archivo en este paso.

1. Lee CLAUDE.md, el Makefile y la configuración de base de datos del backend.
2. Dime qué framework y qué ORM/mapeador usa, dónde se configura la conexión y cómo se cargan los archivos .env según el entorno (desarrollo vs test).
3. Explica cómo se genera backend/database/schema.ts (¿a partir de qué? ¿con qué comando?).
4. Lista todo lo que dependa específicamente de SQLite: driver, rutas de archivo .sqlite, funciones SQL propias de SQLite, tipos de columna (fechas, booleanos, JSON), y comparaciones de fechas hechas con texto.
5. Lista las migraciones existentes en orden.

Responde con un resumen; no propongas cambios todavía.
```

**Qué salió:** funcionó a la primera; no tocó archivos y señaló la comparación de `due_date` como texto (`isOverdueOn`) como lo más expuesto al cambio de motor.

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Quiero migrar el proyecto de SQLite a PostgreSQL en Docker, con una base para desarrollo y otra para pruebas. Primero dame un PLAN (lista de archivos a crear/modificar y qué cambia en cada uno). No implementes aún.

Restricciones obligatorias:
- El archivo de Compose se llama compose.yaml y define dos servicios: db y db-test.
- Imagen: pgvector/pgvector:pg17 en ambos.
- Puertos: 54410 (desarrollo) y 54411 (pruebas).
- db-test va en memoria, SIN volumen (usa tmpfs para el directorio de datos), para que los datos no persistan entre ejecuciones.
- Healthcheck en ambos servicios (pg_isready). El arranque debe esperar a que ambas bases acepten conexiones antes de migrar.
- No incluyas la clave `version:` en compose.yaml.
- La batería de pruebas se conecta a db-test mediante su propio archivo de entorno (el que el framework carga solo en el entorno de test).
- Atajos en el Makefile para: arrancar las bases, detenerlas, ejecutar migraciones en ambas y lanzar las pruebas.

Regla crítica: NO modifiques ninguna migración existente. Si crees que alguna necesita cambios para funcionar en PostgreSQL, DETENTE y explícame cuál, por qué, y qué alternativa hay sin tocarla.
```

**Qué salió:** plan de 11 archivos sin tocar ninguna migración; avisó de cuatro riesgos (healthcheck por TCP, `testUtils.db().migrate()` falla por `openapi_check`, el hook puede bloquear `.env.test`, y `due_date` puede llegar como otro tipo con `pg`).

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
El plan me parece bien [o: cambia X por Y]. Implementa solo la parte de infraestructura:
- compose.yaml
- los archivos .env de desarrollo y de test (y sus .example si el proyecto los usa)
- la configuración de conexión del backend para usar PostgreSQL
- los atajos del Makefile

Para el arranque usa `docker compose up -d --wait` (o equivalente) para que el comando no termine hasta que los healthchecks estén en verde. Recuerda: no toques las migraciones existentes. Al terminar, enséñame el compose.yaml completo.
```

**Qué salió:** funcionó a la primera; `make test` 23/23 sobre PostgreSQL, también tras reiniciar las bases, y sin diff en las migraciones. Queda pendiente que `npm test` a secas migre `db-test` (habría que tocar `tests/bootstrap.ts`).

## Prompt 4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Bien. Antes de seguir:
1. Confirma que el archivo SQLite original sigue existiendo (ruta y número de filas por tabla). No lo borres: lo necesito como referencia para comparar datos.
2. Dime cómo puedo consultar esa base SQLite ahora que se quitó better-sqlite3 (CLI sqlite3 o un worktree de s10/start), sin reinstalar el driver en esta rama.
3. Sobre el pendiente: el enunciado usa `(cd backend && npm test)`. Propón el cambio mínimo en tests/bootstrap.ts para que migre db-test antes de la batería, enséñamelo y aplícalo solo si no toca ninguna prueba ni migración.
4. Haz commit en la rama actual con un mensaje descriptivo. No hagas push.
```

**Qué salió:** el SQLite sigue en `backend/tmp/db.sqlite3` pero con 0 filas en `users`, `tasks` y `auth_access_tokens`, así que no sirve como referencia de datos. `sqlite3` CLI no está instalado; se consulta con `python3`. `bootstrap.ts` migra `db-test` con `MigrationRunner` y `npm test` a secas pasa 23/23. Commit `f93e3f2`, sin push.

## Prompt 5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Parte B. El typecheck pasa y el diff de schema.ts contra s10/start sale vacío. No modifiques nada en este paso; solo investiga e informa.

1. Explica qué fija los tipos de schema.ts: ¿se generan desde las migraciones, desde la base real o desde un mapeo? ¿Por qué no cambiaron al pasar a PostgreSQL?
2. Para las columnas de fecha/hora y booleanas de tasks y users, haz una tabla con:
   - lo que declara la migración (método de Knex/Lucid)
   - el tipo real en SQLite (PRAGMA table_info, en modo solo lectura con python3)
   - el tipo real en PostgreSQL (information_schema.columns en db, puerto 54410)
   - el tipo TypeScript en schema.ts
3. Señala dónde no coinciden.
```

**Qué salió:** `schema.ts` sale de escanear la base real + mapeo de Lucid (`date`→DATE, `datetime`/`timestamptz`→DATE_TIME) + `schema_rules.ts`, que fija `due_date` a `string`; por eso el diff es vacío. No hay booleanas. Lo que no coincide: con `pg`, `due_date` llega como `Date` (no `string`) y `Date < '2026-08-20'` da `false`, así que `isOverdueOn` deja de detectar vencidas. Falta comprobarlo con una tarea real.

## Prompt 6

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Paso 3 de la parte B: compruébalo con el servidor, no solo con el driver. No corrijas nada.

1. Arranca el backend de esta rama contra db (54410).
2. Por la API, crea un usuario y estas tareas: vence hace 1 mes, vence ayer, vence hoy, vence mañana, sin fecha, y completada que venció ayer.
3. Lista las tareas por la API y enséñame, para cada una, el dueDate y el isOverdue que devuelve.
4. Haz lo mismo en un worktree de s10/start sobre SQLite (en ~/flowsync-s10-start, otro puerto) y pon las dos respuestas en una tabla lado a lado.
5. Repite el listado de esta rama arrancando el proceso con TZ=UTC y sin él, y dime si cambia algo.
```

**Qué salió:** con `today=2026-11-18`, en PostgreSQL las 6 tareas salen `isOverdue: false` (las vencidas de hace 1 mes y de ayer, mal) y `dueDate` pasa de `2026-11-17` a `2026-11-17T00:00:00.000Z`. En SQLite las vencidas salen bien, pero la completada que venció ayer sale `true` aunque el comentario de `isOverdueOn` dice que lo hecho no vence (fallo previo, sin prueba). TZ=UTC y sin TZ dan lo mismo porque `.env` fija `TZ=UTC`; con `TZ=Asia/Tokyo` la fecha serializada retrocede un día. Respuestas en `~/resultados-parte-b/`.

## Prompt 7

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Ya están las mismas 6 tareas en db (PostgreSQL) y en el SQLite del worktree. No corrijas nada.

1. Escribe y ejecuta una consulta en cada base que devuelva id/título y due_date tal como está almacenado (en PostgreSQL usa due_date::text). Compara y dime cuántas filas cambian de valor ALMACENADO.
2. Con los JSON de ~/resultados-parte-b/, dime cuántas filas cambian de valor LEÍDO: cuántas cambian dueDate y cuántas cambian isOverdue.
3. Revisa tests/ y dime qué prueba cubre isOverdueOn: ¿construye el modelo en memoria con un string o lo lee de la base? Lista los archivos que revisaste y confirma que ninguna prueba cubre (a) una tarea vencida leída desde la base, ni (b) una tarea completada con fecha pasada.
4. Elimina el worktree ~/flowsync-s10-start cuando termines (git worktree remove), sin tocar la rama s10/start.
```

**Qué salió:** valor almacenado: 0 de 6 filas cambian (mismo `due_date` en las dos bases). Valor leído por la API (TZ=UTC): `dueDate` cambia en 5 de 6 (texto → ISO con hora; con TZ=Asia/Tokyo además cambia el día en 5) e `isOverdue` en 3 de 6 (hace 1 mes, ayer y la completada, todas `true` → `false`). Ninguna prueba cubre `isOverdueOn`: ni en memoria ni leída de la base; tampoco una vencida leída de la base ni una completada con fecha pasada. Worktree eliminado; `s10/start` sigue en `fc41849`.

## Prompt 8

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Escribí HALLAZGOS.md (te lo pego abajo). Contrasta cada cifra y afirmación con lo que comprobamos en esta sesión y dime si alguna no está respaldada. No lo reescribas.
Después revisa prompts.md: cada prompt en su propio bloque de código, con herramienta y modelo, y el texto tal como lo envié.
Si todo está bien, haz commit de HALLAZGOS.md y prompts.md en motor-rm. No hagas push.

[pegas tu HALLAZGOS.md]
```

**Qué salió:** no funcionó como esperaba: lo envié con el marcador `[pegas tu HALLAZGOS.md]` sin rellenar y el archivo del repo seguía siendo la plantilla, así que no hubo nada que contrastar ni commit. Sí revisó `prompts.md`: los prompts 1–7 coincidían literalmente, pero faltaban los anteriores y quedaba una frase obsoleta de la plantilla.

## Prompt 9

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Ya guardé HALLAZGOS.md en el repo. Contrasta cada cifra y afirmación con lo que medimos en esta sesión y dime si alguna no está respaldada. No lo reescribas.

En prompts.md:
- Añade, en orden cronológico y antes del Prompt 1, los prompts anteriores que listaste (sin los de "guarda este prompt"), cada uno en su bloque con modelo y herramienta y con el texto literal que envié. Para el de la lección pegada, pon el texto completo.
- Añade como Prompt 8 el que te mandé con el marcador sin rellenar, y como Prompt 9 este.
- Borra la frase obsoleta de la línea 19.

Si HALLAZGOS.md está respaldado, haz commit de los dos archivos en motor-rm. No hagas push.
```

**Qué salió:** `HALLAZGOS.md` seguía siendo la plantilla en disco (858 bytes, sin cambios desde que se creó la rama), así que no hubo contraste ni commit. Se añadieron a `prompts.md` los prompts 0.1–0.5, el 8 y este, y se quitó la frase obsoleta.

## Prompt 10

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
Sustituye la línea del punto 1 de HALLAZGOS.md por esta, sin reescribirla:

[pega la línea 1 corregida]

Las líneas 2 y 3 se quedan como están. Después haz commit de HALLAZGOS.md y prompts.md en motor-rm, con este prompt añadido a prompts.md como el último. Enséñame el git log -1 --stat. No hagas push.

- La migración no toca datos, así que cae en la rama de cambio reversible sin pérdida: con `select due_date::text` en PostgreSQL y `select due_date` en SQLite, las 6 filas tienen el mismo valor almacenado. Sin embargo, al consultarlas desde la API, 5 de las 6 fechas cambian de formato y 3 de las 6 tareas dejan de aparecer como vencidas. Esto pasa porque el driver `pg` convierte las columnas `date` en objetos `Date` de JavaScript, y comparar un `Date` con un texto siempre da false.
```

**Qué salió:** el marcador `[pega la línea 1 corregida]` volvió a ir sin rellenar, pero la línea iba debajo del prompt y se usó esa. Punto 1 sustituido literalmente, puntos 2 y 3 intactos, y commit de `HALLAZGOS.md` y `prompts.md` sin push.

## Prompt 11

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

````
`git log -1 --stat` te deja comprobar que el commit incluye los dos archivos.
Después, la entrega:

```
git push -u origin motor-rm
```

En GitHub, abre el PR desde tu fork. Antes de crearlo, comprueba tres cosas:

* la base es `LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1`, no tu fork;
* el PR sale de la rama `motor-rm`;
* en “Files changed” aparecen `HALLAZGOS.md`, `prompts.md`, `compose.yaml`, el `Makefile` y la configuración, y no hay cambios en `database/migrations`.
````

**Qué salió:** el push a `origin` funcionó, pero el PR falló: ese fork lo es de `LIDR-academy`, no de `LIDR-academy-temp`, y GitHub no deja abrir el PR entre redes distintas. Respondí «Sí, desde flowsync-m8» y se abrió el PR #80 desde `RolandMartinez/flowsync-m8:motor-rm` hacia `s10/start`, con 11 archivos y ninguno de `database/migrations`.
