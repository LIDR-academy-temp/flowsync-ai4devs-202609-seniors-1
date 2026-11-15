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

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Vamos a migrar este proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. Lo haremos en varios pasos; en este primero solo la parte de Docker y los atajos del Makefile, sin tocar el código de la aplicación.

Crea un compose.yaml en la raíz con estas restricciones:
- Dos servicios, llamados db y db-test.
- Imagen pgvector/pgvector:pg17 en los dos (PostgreSQL 17 con la extensión pgvector).
- Puertos: 54410 en el host para db (desarrollo) y 54411 en el host para db-test (pruebas), para evitar conflictos con una instancia en el 5432.
- La base de pruebas va en memoria y sin volumen: los datos de una ejecución no deben quedar guardados para la siguiente. La de desarrollo sí guarda sus datos en un volumen con nombre.
- Una comprobación de salud (healthcheck) en ambos servicios, de modo que el arranque espere a que las dos bases acepten conexiones. En el primer arranque PostgreSQL todavía está inicializando cuando otros procesos intentan conectarse.
- No incluyas la clave version: en compose.yaml, porque está obsoleta.
- Credenciales y nombres de base de datos solo de desarrollo local, sin nada sensible; indícame en tu respuesta cuáles has elegido para usarlos en el siguiente paso.

Añade al Makefile atajos para arrancar las dos bases esperando a que estén sanas y para detenerlas. Sigue el estilo de los atajos que ya hay y haz que aparezcan en make help. Todavía no añadas los de migraciones ni pruebas.

No modifiques ninguna migración existente ni el código de la aplicación. Cuando termines, arranca las bases con el atajo nuevo, comprueba que las dos quedan sanas y enséñame el estado de los contenedores.

```

**Qué salió:** 
He creado compose.yaml y los atajos make db-up y make db-down. Las dos bases arrancan y quedan sanas. Lo he comprobado arrancándolas con el atajo nuevo, y el primer arranque tardó unos 25 s, incluida la descarga de la imagen.

NAME                 IMAGE                    SERVICE   STATUS                   PORTS
flowsync-db-1        pgvector/pgvector:pg17   db        Up 9 seconds (healthy)   127.0.0.1:54410->5432/tcp
flowsync-db-test-1   pgvector/pgvector:pg17   db-test   Up 9 seconds (healthy)   127.0.0.1:54411->5432/tcp

Además, psql responde en las dos bases, que corren PostgreSQL 17.12 con la extensión vector disponible. En db-test, /var/lib/postgresql/data es un tmpfs, así que no deja nada guardado. En db, ese mismo directorio está en el volumen flowsync_db-data.

Credenciales para el siguiente paso

Son solo de desarrollo local.

┌───────────────┬─────────────────┬─────────────────┐
│               │   Desarrollo    │     Pruebas     │
├───────────────┼─────────────────┼─────────────────┤
│ Host / puerto │ 127.0.0.1:54410 │ 127.0.0.1:54411 │
├───────────────┼─────────────────┼─────────────────┤
│ Usuario       │ flowsync        │ flowsync        │
├───────────────┼─────────────────┼─────────────────┤
│ Contraseña    │ flowsync        │ flowsync        │
├───────────────┼─────────────────┼─────────────────┤
│ Base de datos │ flowsync_dev    │ flowsync_test   │
└───────────────┴─────────────────┴─────────────────┘

Las URLs de conexión quedan así:
- postgres://flowsync:flowsync@127.0.0.1:54410/flowsync_dev
- postgres://flowsync:flowsync@127.0.0.1:54411/flowsync_test

Decisiones que no pediste

- Healthcheck por TCP: usa pg_isready -h 127.0.0.1. En el primer arranque la imagen levanta un servidor temporal que solo escucha por socket unix. Sin -h, el chequeo daría "ok" a ese servidor temporal y no al definitivo.
- Puertos solo en localhost: los publiqué en 127.0.0.1 y no en todas las interfaces, porque las contraseñas son triviales. Para el host siguen siendo 54410 y 54411.
- Nombre del proyecto: puse name: flowsync en el compose para que los nombres de contenedor, red y volumen no dependan del nombre de la carpeta.
- make db-down conserva los datos: no usa -v, así que el volumen de desarrollo se mantiene. Para borrarlo, ejecuta docker compose down -v.
- Ayuda: los atajos aparecen en make help con su descripción. Cabían en la columna existente, así que no cambié el formato.

Cerré la petición con el commit f1e5363 (compose.yaml y Makefile) y no toqué migraciones ni código de la aplicación. No he abierto PR ni lanzado el adversarial-reviewer, porque tus reglas los reservan para el final de la unidad de trabajo. Las bases siguen corriendo. la tradición de américa


---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Segundo paso de la migración a PostgreSQL: ahora la aplicación. El compose y las credenciales ya están (las que me diste: usuario y contraseña flowsync, bases flowsync_dev en el puerto 54410 y flowsync_test en el 54411, host 127.0.0.1).

Haz esto en el backend, siguiendo las reglas de este repositorio:
- Instala el controlador de PostgreSQL para Lucid (el paquete pg).
- Haz de PostgreSQL la conexión por defecto en backend/config/database.ts, leyendo host, puerto, usuario, contraseña y base de datos de variables de entorno. Mantén en esa conexión la misma configuración de migraciones y de generación de esquema que tiene la de SQLite. Dime qué haces con la conexión de SQLite.
- Declara las variables nuevas en el esquema de entorno de la aplicación y en el .env.example, y pon en el .env de desarrollo los valores de la base de desarrollo.
- Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno (backend/.env.test), que el framework carga solo en el entorno de pruebas. Deja ahí lo que ya tiene y añade lo necesario para apuntar a la base de pruebas.
- Añade atajos al Makefile, con el mismo estilo y apareciendo en make help, para ejecutar las migraciones en las dos bases (desarrollo y pruebas) y para lanzar la batería de pruebas contra la base de pruebas, asegurándose de que esa base esté arrancada y migrada antes.

No modifiques ninguna migración existente: si crees que hace falta tocar alguna, detente y dímelo en vez de hacerlo. En este paso no ejecutes las migraciones ni las pruebas; las lanzaremos en el siguiente.

```

**Qué salió:** 
La aplicación ya apunta a PostgreSQL. Lo cerré con el commit 0616812. No he ejecutado migraciones ni pruebas, como pediste. Solo pasé typecheck, eslint y prettier sobre lo que toqué, y están limpios. No modifiqué ninguna migración.

Qué hice

- Driver: instalé pg 8.23.1.
- Conexión por defecto: en config/database.ts hay una conexión postgres que es la de por defecto. Lee DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_DATABASE del entorno. Copié tal cual las opciones de migraciones y de generación de esquema (naturalSort, paths, rulesPaths). Quité el bloque de ejemplo comentado de pg.
- Variables de entorno:
  - Las declaré en start/env.ts. DB_PASSWORD va como secret.
  - Las puse también en .env.example.
  - En tu .env puse los valores de la base de desarrollo. Ese fichero está ignorado por git y no entró en el commit.
- .env.test: conserva SESSION_DRIVER=memory y apunta a 127.0.0.1:54411, base flowsync_test. El cargador de Adonis da prioridad a .env.test sobre .env, así que lo pisa.
- Makefile:
  - make db-migrate migra la base de desarrollo.
  - make db-migrate-test migra la de pruebas.
  - make test lanza la batería contra la base de pruebas.
  - Los tres arrancan solo el servicio que necesitan y esperan a que esté sano. test encadena db-migrate-test, que a su vez arranca db-test.
  - Los dos de pruebas llevan NODE_ENV=test explícito, para que no puedan tocar la base de desarrollo aunque ace cargue el entorno tarde.

La conexión de SQLite

La dejé definida pero sin uso y ya no es la de por defecto. Con la nueva como predeterminada, nada la usa. No la borré ni quité better-sqlite3, porque eso es una limpieza reversible que puede esperar al final de la migración. Si prefieres quitarla ya, es un cambio pequeño.

Cambios que no pediste

- make migrate: make setup llama a este target, que ahora necesita PostgreSQL arrancado. Le puse como paso previo arrancar la base de desarrollo; si no, setup fallaría en un clon limpio. db-migrate es un alias suyo.
- make help: ensanché la columna de 8 a 16 caracteres, porque db-migrate-test no cabía.

Para el siguiente paso

1. due_date: schema_rules.ts declara due_date como string (día ISO) para comparar fechas con <. En SQLite una columna date se lee como texto. Si no recuerdo mal, el driver pg convierte las columnas date en objetos Date de JavaScript, con la zona horaria de por medio. Eso rompería justo lo que esa regla quería evitar. No lo he comprobado porque no he corrido nada. La solución habitual no toca migraciones: registrar un parser de tipos de pg que devuelva el texto tal cual. Lo propongo como primer punto cuando ejecutemos las pruebas.
2. CLAUDE.md: describe SQLite, tmp/db.sqlite3 y el aviso de que las suites functional pegan contra el mismo fichero que el servidor de desarrollo. Ya no es cierto. Lo dejé sin tocar y lo actualizaría al cerrar la migración.
3. make clean: sigue borrando los ficheros de SQLite, lo que es inocuo mientras la conexión exista. Convendrá revisarlo cuando se quite SQLite.


---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ahora ejecuta lo que hemos preparado y dime exactamente qué pasa, sin arreglar nada.

Haz esto, en este orden:
1. Migra la base de desarrollo y luego la de pruebas con los atajos nuevos del Makefile.
2. Lanza la batería de pruebas contra la base de pruebas.

Cuéntame, para cada paso: el comando que has ejecutado, si ha ido bien o mal y, si ha fallado algo, el error literal. Al final, dime cuántas pruebas han pasado y cuántas han fallado.

Restricciones importantes:
- No arregles nada, aunque algo falle o aunque ya tengas una idea de cómo corregirlo. No apliques ninguna corrección, tampoco la del parser de tipos de pg que me propusiste: primero quiero ver qué ocurre sin ella.
- No modifiques ninguna migración existente. Si una migración falla en PostgreSQL, detente y cuéntamelo.
- Dime también qué archivos han cambiado en el repositorio como consecuencia de ejecutar las migraciones (por ejemplo el esquema generado), sin tocarlos.

```

**Qué salió:** 
He ejecutado las migraciones y la batería, sin arreglar nada. Las dos migraciones fueron bien y las pruebas dieron 23 pasadas y 0 falladas.

1. Migraciones

┌───────────────────────────────────────────────┬──────────────┐
│                    Comando                    │  Resultado   │
├───────────────────────────────────────────────┼──────────────┤
│ make db-migrate (desarrollo, flowsync_dev)    │ Bien, exit 0 │
├───────────────────────────────────────────────┼──────────────┤
│ make db-migrate-test (pruebas, flowsync_test) │ Bien, exit 0 │
└───────────────────────────────────────────────┴──────────────┘

En ambas bases se aplicaron las 4 migraciones existentes, sin errores. No hizo falta tocar ninguna. Tardaron 429 ms en desarrollo y 116 ms en pruebas.

Aparte de las migraciones, la salida mostró:
- Upgrading migrations version from "1" to "2", un aviso informativo de Lucid al crear la tabla de control.
- Scanned "postgres" database and found 3 tables, y después Schema classes generated. Es la generación de esquema funcionando contra PostgreSQL.

2. Pruebas

Comando: make test.
- Antes de las pruebas ejecutó db-migrate-test, que respondió Already up to date.
- El resultado fue Tests 23 passed (23), PASSED, Time 3s, exit 0.
- Se ejecutaron los 23 tests, incluidos tests/functional/tasks/assignee.spec.ts y los de auth.

Archivos cambiados en el repositorio

Ninguno. git status --short y git diff --stat salen vacíos tras migrar y tras las pruebas. Esto es lo que revisé:
- backend/database/schema.ts: está versionado y el generador lo reescribió, pero el contenido resultó idéntico al del commit. Ya contenía declare dueDate: string | null.
- .adonisjs/: el arranque de las pruebas informó codegen: created 5 file(s), pero tampoco hay diff.

El fichero .env está ignorado por git, así que no aparece en el estado aunque lo edité en el paso anterior.

Cosas que vi y que conviene que sepas

- due_date en PostgreSQL: la columna es de tipo date, y el esquema generado sigue declarándola como string | null. Que los 23 tests pasen no demuestra que el driver pg devuelva el texto YYYY-MM-DD y no un Date. No sé si alguna prueba lee due_date tras guardarlo. assignee.spec.ts es el único de tasks, y no lo he abierto.
- Qué base usaron las pruebas: después de las pruebas, users y tasks tienen 0 filas en las dos bases. Los tests usan transacciones globales (withGlobalTransaction), así que no dejan datos y el recuento no distingue una base de otra. Como indicio, pg_stat_database muestra más inserciones en flowsync_test (294) que en flowsync_dev (255), aunque ese contador incluye el catálogo de las migraciones. No es una prueba definitiva.

Las bases siguen arrancadas y con las migraciones aplicadas. No he hecho commit, porque no cambió nada versionable.


---

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ahora quiero comprobar cómo decide este proyecto si una tarea está vencida, y si sigue funcionando con PostgreSQL.

Haz esto:
1. Localiza dónde se decide si una tarea está vencida, lee el comentario que explica por qué funciona esa comparación y cítamelo.
2. Comprueba si ese comentario sigue siendo válido con PostgreSQL. No lo hagas solo leyendo el código: crea una tarea cuya fecha de vencimiento ya haya pasado en la base de desarrollo, a través de la propia API del backend (arrancándolo si hace falta), y pregunta por ella con un día de referencia posterior a esa fecha. Dime exactamente qué devuelve la API: el valor de la fecha y si la marca como vencida.
3. Si el resultado no es el esperado, dime qué has visto y por qué crees que ocurre, pero no apliques ninguna corrección.

Cuando termines, para el backend si lo has arrancado y borra la tarea de prueba que hayas creado.

```

**Qué salió:** 
El comentario ya no es válido con PostgreSQL: con una tarea vencida de verdad, la API contesta isOverdue: false. Reproduje el fallo con una tarea real en la base de desarrollo y no he aplicado ninguna corrección.

1. Dónde se decide y qué dice el comentario

La decisión está en Task.isOverdueOn, en backend/app/models/task.ts:52. El código es:

isOverdueOn(referenceDay: string): boolean {
  if (this.dueDate === null) return false
  return this.dueDate < referenceDay
}

El comentario que justifica la comparación dice, textualmente:

▎ Se compara texto contra texto porque dos fechas ISO comparadas así son la comparación de días del calendario: no hay hora, ni huso, ni instante intermedio donde se cuele un día de más.

2. Qué devuelve la API

Pasos de la prueba, con el backend contra flowsync_dev:
1. Registré un usuario de prueba y creé una tarea.
2. Con PUT /tasks/1/due-date le puse dueDate: "2026-03-10".
3. Consulté GET /tasks/1?today=2026-03-15, un día posterior al vencimiento.

┌───────────────────────────────────┬────────────────────────────┬───────────┬──────────────────┐
│             Petición              │      dueDate devuelto      │ isOverdue │     Esperado     │
├───────────────────────────────────┼────────────────────────────┼───────────┼──────────────────┤
│ PUT …/due-date (today=2026-03-01) │ "2026-03-10"               │ false     │ false (correcto) │
├───────────────────────────────────┼────────────────────────────┼───────────┼──────────────────┤
│ GET …?today=2026-03-15            │ "2026-03-10T00:00:00.000Z" │ false     │ true             │
├───────────────────────────────────┼────────────────────────────┼───────────┼──────────────────┤
│ GET …?today=2026-03-10            │ "2026-03-10T00:00:00.000Z" │ false     │ false (correcto) │
├───────────────────────────────────┼────────────────────────────┼───────────┼──────────────────┤
│ GET …?today=2026-03-05            │ "2026-03-10T00:00:00.000Z" │ false     │ false (correcto) │
└───────────────────────────────────┴────────────────────────────┴───────────┴──────────────────┘

isOverdue salió false en las cuatro, y en la segunda fila debería ser true. Además, el valor de dueDate cambió de forma: la fecha vuelve como instante ISO y no como AAAA-MM-DD. En la base la columna se guardó bien: 2026-03-10, de tipo date.

3. Por qué creo que ocurre

Es una inferencia sin demostrar. No he inspeccionado el objeto en tiempo de ejecución, pero la secuencia de resultados la explica entera:

- El driver pg convierte por defecto las columnas date en objetos Date de JavaScript. Con TZ=UTC salen como medianoche UTC, que es lo que vemos en el JSON. SQLite devolvía el texto tal cual.
- El esquema generado sigue declarando dueDate: string | null, así que TypeScript no avisa de que en tiempo de ejecución es un Date.
- En this.dueDate < referenceDay se compara un Date con un texto. JavaScript pasa ambos a número, y "2026-03-15" se convierte en NaN. Cualquier comparación con NaN da false, así que nunca hay una tarea vencida y no salta ningún error.
- El PUT salió bien porque la tarea aún tenía en memoria el texto que acabábamos de asignar, y no una lectura de la base.
- Con otra zona horaria del servidor, la medianoche local se serializaría como otro día, y aparecería también el "día de más" que el comentario decía evitar.

Los 23 tests pasaban porque ninguno ejercita esto. Es el mismo punto que te adelanté con el parser de tipos de pg.

Aparte, el comentario del método habla de "tres condiciones": hay fecha, es anterior al día de referencia, y la tarea no está hecha. El código solo comprueba las dos primeras y no mira el estado. Es una discrepancia anterior a PostgreSQL y no tiene que ver con este fallo.

Limpieza

- Backend: lo paré. El puerto 3333 está libre y no queda ningún proceso.
- Fallo mío: mi primer intento de parada mató mi propia shell, porque pkill -f coincidió con su línea de comandos. El backend siguió vivo unos minutos más. Lo paré después con su PID exacto.
- Datos de prueba: borré la tarea de prueba y también el usuario que creé, porque la API exige sesión y no había otro modo de crear la tarea. Los tokens se fueron por cascada. La base de desarrollo vuelve a estar en tasks=0, users=0, tokens=0.
- Repositorio: git status está limpio. No hay nada que commitear.

