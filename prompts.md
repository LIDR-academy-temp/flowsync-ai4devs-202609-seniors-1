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

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Actúa como arquitecto de bases de datos experto y especialista en migraciones. Debes migrar el proyecto actual de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas.

Restricciones:
- El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.

- Usa pgvector/pgvector:pg17, que incluye PostgreSQL 17 con la extensión pgvector.

- Usa los puertos 54410 para desarrollo y 54411 para pruebas.

- La base de pruebas va en memoria, sin volumen. Hay que evitar que los datos de una ejecución queden guardados para la siguiente.

- Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse. Muéstrame la ruta en cada caso.

- Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

- Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno. Muéstrame las credenciales de acceso en cada caso.

- Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas. Haz que los nuevos atajos aparezcan en make help e indícame los nombres en cada caso.

No modifiques las migraciones existentes. No realices tampoco cambios en el código actual. Limítate a seguir las restricciones indicadas. No realices commit todavía, ni cambies de rama.

No supongas nada. Ante cualquier duda, pregunta primero.

Al finalizar, arranca las bases de datos con los nuevos atajos y haz una comprobación de salud.
```

**Qué salió:** La migración está hecha y las dos bases están arrancadas y sanas. Las 23 pruebas del backend pasan contra la base de pruebas. No hay commit y sigues en la rama `motor-jar`.

## Comprobación de salud

Las he arrancado con `make db-up`, que espera a que las dos estén sanas antes de devolver el control:

| Servicio  | Estado            | `pg_isready`                             | Puerto          |
| --------- | ----------------- | ---------------------------------------- | --------------- |
| `db`      | healthy, 0 fallos | `127.0.0.1:5432 - accepting connections` | 127.0.0.1:54410 |
| `db-test` | healthy, 0 fallos | `127.0.0.1:5432 - accepting connections` | 127.0.0.1:54411 |

La versión es PostgreSQL 17.12 y la extensión `vector` 0.8.7 está disponible, aunque no la he activado porque no lo pedías. El directorio de datos de `db-test` está montado en memoria (tmpfs).

## Dónde está la comprobación de salud

- **`db`:** `compose.yaml:22` → `pg_isready -h 127.0.0.1 -p 5432 -U flowsync -d flowsync_dev`
- **`db-test`:** `compose.yaml:42` → `pg_isready -h 127.0.0.1 -p 5432 -U flowsync -d flowsync_test`

La comprobación va por TCP (`-h 127.0.0.1`) a propósito. En el primer arranque, PostgreSQL levanta un servidor provisional que solo escucha en el socket interno mientras crea la base. Si la comprobación fuera por socket, daría la base por lista antes de tiempo.

## Credenciales

| Entorno    | Archivo                                   | Host:puerto     | Usuario / contraseña | Base          |
| ---------- | ----------------------------------------- | --------------- | -------------------- | ------------- |
| Desarrollo | `backend/.env` (y `backend/.env.example`) | 127.0.0.1:54410 | flowsync / flowsync  | flowsync_dev  |
| Pruebas    | `backend/.env.test`                       | 127.0.0.1:54411 | flowsync / flowsync  | flowsync_test |

Las pruebas cogen las suyas de `backend/.env.test`, que Adonis solo carga cuando `NODE_ENV=test`. Las variables de `backend/.env` las añadí con `node ace env:add`, sin abrir el fichero.

## Atajos nuevos (ya salen en `make help`)

- **`make db-up`:** arranca las dos bases y espera a que acepten conexiones.
- **`make db-down`:** las detiene. La de pruebas se pierde al pararla.
- **`make db-migrate`:** ejecuta las migraciones en la de desarrollo y en la de pruebas.
- **`make test`:** borra y vuelve a crear las tablas de la base de pruebas y lanza las pruebas. Así ningún dato de una ejecución llega a la siguiente, aunque el contenedor siga encendido.

He ensanchado la columna de nombres de `make help` de 8 a 12 caracteres para que los nombres nuevos queden alineados.

## Otros cambios y avisos

- **Copia de datos:** no había nada que copiar. La base SQLite no tenía ningún usuario, token ni tarea; solo guardaba el registro de migraciones, que ya se ha vuelto a crear en PostgreSQL. El fichero SQLite sigue donde estaba, sin tocar.
- **Código del backend:** he tocado lo que autorizaste. `config/database.ts` usa ahora `pg` por defecto y conserva la conexión `sqlite`. `start/env.ts` valida las variables de la base, con la contraseña tratada como secreto. Además he instalado el paquete `pg`. Las migraciones no se han tocado, y `database/schema.ts` y `.adonisjs/` se regeneraron sin ningún cambio.
- **Puertos:** solo se exponen en 127.0.0.1, no en todas las interfaces de red de la máquina. Es una decisión mía; dime si los quieres abiertos.
- **Riesgo con `due_date`:** PostgreSQL devuelve las columnas de fecha como un objeto `Date`, mientras que el esquema las trata como texto. Hoy las pruebas pasan, pero no hay ninguna que lea una `due_date` con valor. No lo he corregido.
- **Fichero que no es mío:** ha aparecido `.claude/settings.local.json` sin versionar. No lo he creado yo y no lo he tocado.

Los atajos de Make y los comandos de `node` solo funcionan dentro de WSL, porque las dependencias están compiladas para Linux. Desde Windows: `wsl.exe -d Ubuntu-22.04 -- bash -ic 'cd ~/PROJECTS/s10/flowsync-ai4devs && make db-up'`.

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
No hay cambios en backend/database/schema.ts?
```

**Qué salió:** No, no hay ninguno. `database/schema.ts` se ha reescrito tres veces, una por cada `migration:run` contra `db` o `db-test` y otra en `make test`; la última fue hoy a las 13:23. Aun así, el contenido es idéntico byte a byte al de la versión commiteada (`04940fc`): `git diff --exit-code` sale limpio.

Sale igual por dos motivos:

- **Los tipos básicos coinciden en los dos motores.** Al leer las tablas de PostgreSQL, el generador da los mismos tipos de TypeScript que con SQLite: los enteros como `number`, los textos como `string` y las fechas con hora como `DateTime`. Las columnas que pueden quedar vacías también se marcan igual.
- **Las dos columnas especiales salen de reglas fijas.** `status` y `due_date` se definen en `database/schema_rules.ts`, que sustituye por completo lo que deduciría el generador, sea cual sea la base. Por eso `dueDate` sigue declarada como `string | null` (`schema.ts:43`).

Eso enlaza con el aviso que te di: el tipo dice `string`, pero el driver `pg` devuelve las columnas de fecha como un objeto `Date` de JavaScript. El fichero no cambia, pero el valor real ya no coincide con lo que declara. Ninguna prueba actual lo detecta.

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Ahora vamos a probar la migración:
- Utiliza los nuevos atajos creados.
- Migra la base de datos de desarrollo, y luego la de pruebas.
- Ejecuta las pruebas en la base de datos de pruebas.

Indica:
- Cuántas pruebas se realizaron.
- Si hay errores, o si todo funcionó correctamente.
- En caso de error, muestra los detalles del error.

Restricciones a seguir:
- No modifiques las migraciones existentes.
- No modifiques el código actual.
- No realices commit todavía, ni cambies de rama.
```

**Qué salió:** Todo ha funcionado: se ejecutaron **23 pruebas** y pasaron las 23, sin ningún error. Sigues en `motor-jar`, sin commit, y esta ejecución no ha modificado nada del proyecto.

| Paso                                | Atajo             | Resultado                                                                      | Código de salida |
| ----------------------------------- | ----------------- | ------------------------------------------------------------------------------ | ---------------- |
| Arrancar las bases                  | `make db-up`      | `db` y `db-test` ya estaban en marcha y `healthy`                              | 0                |
| Migrar desarrollo y después pruebas | `make db-migrate` | En las dos: `Already up to date` (las cuatro migraciones ya estaban aplicadas) | 0                |
| Lanzar las pruebas                  | `make test`       | `PASSED`: 23 de 23, en 2 s                                                     | 0                |

`make test` primero borra las tablas de `db-test` y vuelve a aplicar las cuatro migraciones. Después lanza las pruebas sobre una base limpia:

| Grupo               | Fichero                                   | Pruebas |
| ------------------- | ----------------------------------------- | ------- |
| Auth · iniciales    | `tests/functional/auth/initials.spec.ts`  | 3 ✔     |
| Auth · login        | `tests/functional/auth/login.spec.ts`     | 4 ✔     |
| Auth · sesión       | `tests/functional/auth/session.spec.ts`   | 6 ✔     |
| Auth · registro     | `tests/functional/auth/signup.spec.ts`    | 7 ✔     |
| Tasks · responsable | `tests/functional/tasks/assignee.spec.ts` | 3 ✔     |

`database/schema.ts` y `.adonisjs/` se regeneraron durante la ejecución, pero quedaron idénticos y no aparecen como modificados.

En `git status` vuelven a salir como modificados `.claude/hooks/datos-que-no-salen.sh`, los ficheros de `eval-harness/` y `prompts.md`. No vienen de esta prueba ni de la migración: ninguno de los atajos los toca. Los de `.claude/hooks` y `eval-harness` ya estaban modificados antes de que yo empezara. No los he tocado.

## Prompt 4

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Ahora vamos a examinar cómo se decide en el proyecto si una tarea está vencida, y si sigue funcionando correctamente tras la migración a PostgreSQL.

Indica:
- Dónde y como se decide si una tarea está vencida.
- Si funciona o no esta comprobación.

Crea casos de test para validarlo y verifica si esta funcionaldad sigue siendo válida tras el proceso de migración realizado.
```

**Qué salió:** Esto es lo que he averiguado leyendo el código:

## Dónde y cómo se decide

La regla está en un solo sitio, `Task.isOverdueOn(referenceDay)` (`backend/app/models/task.ts:52`):

```ts
if (this.dueDate === null) return false
return this.dueDate < referenceDay
```

- **Comparación:** compara dos textos `AAAA-MM-DD`. El `<` es estricto, así que una tarea que vence hoy no está vencida.
- **Día de referencia:** lo manda quien consulta en el parámetro `today`. El servidor nunca usa su propio reloj, y si falta `today` responde 422 (`taskReferenceDayValidator`, `app/validators/task.ts:70`).
- **Dónde se aplica:** `TaskDetailTransformer` (`task_detail_transformer.ts:29`) lo usa en `GET /tasks/:id` y en `PUT /tasks/:id/due-date`. La lista `GET /tasks` no lo incluye.
- **Frontend:** no compara fechas, solo muestra el `isOverdue` que recibe (`task-page.tsx:176`).

## ¿Funciona?

Veo dos problemas, y solo uno tiene que ver con la migración.

1. **Falta una condición, y no depende de PostgreSQL.** La especificación (`openspec/specs/tasks/spec.md:392`) exige tres condiciones: que haya fecha, que sea anterior y que el estado **no sea `done`**. El comentario del método también dice tres, pero el código solo aplica dos. Una tarea hecha con fecha pasada se sigue marcando vencida. Incumple los escenarios de las líneas 416 y 582 de la especificación. Es un fallo anterior a la migración que ninguna prueba cubre.
2. **Riesgo por la migración.** `dueDate` se declara como `string`, pero el driver `pg` suele devolver las columnas `date` como objeto `Date` de JavaScript. Si pasa aquí, `Date < "2026-08-20"` da siempre `false`. Sería el aviso que te di antes sobre `due_date`, ahora con consecuencias: ninguna tarea saldría nunca vencida al leerla de la base. `PUT` respondería bien, porque devuelve el valor recién asignado en memoria.

## Pruebas

Mi plan ha sido crear `backend/tests/functional/tasks/overdue.spec.ts` con 9 casos tomados de los escenarios de la especificación. Entre ellos: fecha anterior, vencer hoy, fecha posterior, sin fecha, tarea hecha, aplazar, mismo dato con distinto día y `today` ausente. Siempre he releido con `GET`, para pasar por la base de datos. Después ejecuté `make test` en PostgreSQL.

No he decidido qué hacer con el fallo de `done`. Las pruebas lo hacen saltar, y como no puedo modificar el código actual, queda fallando hasta que me digas si lo arreglo.

La comprobación de vencida **no funciona tras la migración a PostgreSQL**. De las 32 pruebas, 28 pasan y 4 fallan; son 4 de las 9 nuevas de `overdue.spec.ts`, y las 23 anteriores siguen pasando. No he modificado código del proyecto, solo he creado `backend/tests/functional/tasks/overdue.spec.ts`.

## Causa

El driver `pg` devuelve la columna `due_date` (tipo `date`) como un objeto `Date` de JavaScript, no como texto. Lo confirma el cuarto error: `'2026-08-19T00:00:00.000Z'` en vez de `'2026-08-19'`. Eso rompe dos cosas:

- **La regla:** `isOverdueOn` compara `this.dueDate < referenceDay`, y un `Date` contra un texto da siempre `false`. Ninguna tarea sale nunca vencida cuando se lee de la base.
- **El contrato de la API:** `GET /tasks/:id` devuelve `dueDate` con hora y huso (`...T00:00:00.000Z`), en lugar de un día `AAAA-MM-DD`. Esto va contra la especificación y contra `schema.ts`, que declara `string`.

## Resultado por prueba

| Prueba                                            | Resultado |
| ------------------------------------------------- | --------- |
| Fecha anterior al día de referencia llega vencida | ✖         |
| Vencer hoy no es estar vencida                    | ✔         |
| Fecha posterior no llega vencida                  | ✔         |
| Sin fecha no llega vencida                        | ✔         |
| Tarea hecha no llega vencida y conserva su fecha  | ✖         |
| Aplazar una vencida la deja de mostrar vencida    | ✔         |
| Mismo dato se lee distinto según el día           | ✖         |
| Sin `today` responde 422                          | ✔         |
| La fecha leída es texto `AAAA-MM-DD`              | ✖         |

Las pruebas que pasan lo hacen sin demostrar nada: esperan `false` y `false` es justo lo que sale siempre. La de aplazar pasa porque `PUT` responde con el valor en memoria, que sigue siendo texto y no pasa por el driver.

## El fallo de `done`

La prueba de la tarea hecha falla en su paso previo (línea 96), cuando comprueba que la tarea está vencida antes de marcarla `done`. No llega a la parte que importa. El fallo que te conté, que el código no mira el estado `done`, queda tapado por el de PostgreSQL. Cuando se arregle el de las fechas, esa prueba lo hará saltar si sigue ahí.

## Cómo arreglarlo

No lo he tocado porque dijiste que no modificara el código actual. Estas son las opciones, de más a menos recomendable:

1. **Hacer que `pg` devuelva las fechas como texto:** registrar `types.setTypeParser(1082, (v) => v)` al configurar la conexión, en `config/database.ts`. Es una línea y deja `due_date` como `string`, como declara el esquema. Es mi recomendación.
2. **Convertir en el modelo:** un `consume` en la columna `dueDate` de `Task`. Es más local, pero repite lo que ya dice `schema_rules.ts`.
3. **Cambiar la comparación:** `isOverdueOn` normalizaría el valor antes de comparar. Tapa el síntoma, pero la API seguiría devolviendo fechas con hora.

Además hay que añadir `this.status !== 'done'` a `isOverdueOn`, que es el otro fallo.

## Prompt 5

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Perfecto, ahora borra la prueba que creaste.
```

**Qué salió:** He borrado `backend/tests/functional/tasks/overdue.spec.ts`. En esa carpeta solo queda `assignee.spec.ts`, la prueba que ya existía.

El código del proyecto sigue sin cambios y no he hecho commit ni cambiado de rama. Los dos fallos que encontré, el de las fechas con PostgreSQL y el de la condición `done`, siguen sin corregir.
