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

**Modelo:** claude-opus-5-5 (esfuerzo no indicado)
**Herramienta:** Claude Code 2.1.322 (WSL, Terminal 1), lanzado a las 19:36 (hora local)

Texto pegado sin cambios desde el borrador de prompts que había preparado antes con el asistente (`PROPUESTA-PROMPTS.md`, Prompt 1).

```
Quiero migrar este proyecto (FlowSync) de SQLite a PostgreSQL en Docker, con una base de datos para
desarrollo y otra para pruebas. Antes de tocar nada, léete el CLAUDE.md, el Makefile y la carpeta
backend/database, y dime en pocas líneas qué vas a cambiar.

Resultado que espero: un compose.yaml (sin la clave version:) con dos servicios, db y db-test, que usen la imagen
pgvector/pgvector:pg17, en los puertos 54410 (desarrollo) y 54411 (pruebas). La de pruebas va en memoria, sin
volumen. Los dos servicios tienen una comprobación de salud y el arranque espera a que las dos bases acepten
conexiones. Las pruebas del backend se conectan a la base de pruebas con su propio archivo de entorno. Quiero
atajos en el Makefile para arrancar y parar las bases, migrar ambas y lanzar las pruebas.

Restricción importante: no modifiques ninguna migración existente. Si crees que hay que tocar una, para y
dímelo, no lo hagas.

Sobre el proceso del proyecto: sigue con los commits por petición, pero no abras ningún PR ni lances el
revisor adversarial; el PR lo abro yo desde mi fork. Y respeta el hook de datos: usa valores de mentira en
las credenciales de las bases y no metas ningún .env en un commit.

Al terminar, enséñame cuántas pruebas pasan, contra qué base se han ejecutado y qué archivos has cambiado.
Si dudas de algo, pregúntame antes de decidir.
```

**Qué salió:** Leyó `CLAUDE.md`, el `Makefile`, `backend/database/`, `config/database.ts`, `start/env.ts`, `.env.test` y `tests/bootstrap.ts` sin tocar nada, y propuso un plan de 7 puntos (`compose.yaml`, conexión `pg`, variables `DB_*`, archivos de entorno, atajos de `make`, actualizar `CLAUDE.md` y dejar las migraciones intactas). Avisó de que el driver `pg` devuelve las columnas `date` como objetos `Date` y propuso registrar un parser que las devuelva como texto. Preguntó si quita SQLite del todo y si vale ese parser. Todavía no ha cambiado ningún archivo.

---

## Prompt 2

**Modelo:** claude-opus-5-5 (esfuerzo no indicado)
**Herramienta:** Claude Code 2.1.322 (WSL, Terminal 1), lanzado a las 19:41 (hora local)

Respuesta a las dos dudas y a un punto del plan del agente. Texto pegado sin cambios desde un borrador que me preparó el asistente en esta conversación.

```
Respondo a tus dos dudas y a un punto del plan:

1. SQLite: déjala como conexión secundaria. No borres better-sqlite3 ni toques el borrado de tmp/db.sqlite3 en make clean. La conexión por defecto pasa a ser pg.

2. Parser de fechas: no lo añadas. No arregles nada de cómo se leen las fechas por ahora, y tampoco toques las migraciones ni schema_rules.ts. Si ves que el driver pg cambia cómo llegan las fechas, anótalo y dímelo, pero no lo corrijas.

3. No modifiques CLAUDE.md. El cambio se limita a compose.yaml, config/database.ts, start/env.ts, .env.example, .env.test, el Makefile y la dependencia pg. Tu .env local sí puedes editarlo (no entra en el commit).

Con eso, adelante. Sigue con los commits por petición y, al terminar, enséñame cuántas pruebas pasan, contra qué base y qué archivos has cambiado.
```

**Qué salió:** Hizo la parte A: instaló `pg`, creó `compose.yaml` (`db` en 54410 con volumen, `db-test` en 54411 en `tmpfs`, ambos con healthcheck y credenciales de mentira), dejó `pg` como conexión por defecto con SQLite secundaria, añadió las variables `DB_*`, apuntó `.env.example` y `.env.test` a cada base y añadió al `Makefile` `db-up`, `db-down`, `db-migrate` y `test`. Migró las dos bases y las 23 pruebas pasan contra `db-test`; para comprobarlo paró `db` y repitió las pruebas. Lo dejó commiteado (`b7c2dae`) y enseñó la lista de archivos cambiados. No tocó migraciones, `schema_rules.ts`, `CLAUDE.md` ni `schema.ts` (regenerado, idéntico). Como se le pidió, no arregló lo de las fechas pero lo reportó: `pg` devuelve `due_date` como objeto `Date`, `this.dueDate < referenceDay` compararía un `Date` con texto y `isOverdue` saldría siempre `false` sin error, y fuera de UTC el día puede desplazarse (en su shell salió `2026-11-17T23:00:00Z`); ninguna de las 23 pruebas toca fechas.

---

## Prompt 3

**Modelo:** claude-opus-5-5 (esfuerzo no indicado)
**Herramienta:** Claude Code 2.1.322 (WSL, Terminal 1), lanzado a las 19:47 (hora local)

Parte B3 (cómo se decide «vencida»). Texto pegado sin cambios desde un borrador que me preparó el asistente en esta conversación.

```
En este proyecto hay una comparación que decide si una tarea está vencida. Quiero encontrarla y entender por
qué funciona: dime en qué archivo y línea está, copia el comentario que la explica tal cual (sin
reformularlo) y dime qué condiciones del motor de base de datos da por supuestas, si las ves.

No cambies ningún archivo. Después, propón cómo comprobarlo ejecutando algo real: una tarea cuyo plazo ya
debería haber pasado, con el backend arrancado contra la base de desarrollo en PostgreSQL. No saques tú la
conclusión de si sigue siendo válida; quiero verla yo con esa tarea. Si hace falta crear datos, dime
exactamente qué vas a crear antes de hacerlo.
```

**Qué salió:** Sin cambiar ningún archivo ni crear datos, localizó la comparación (`backend/app/models/task.ts`, línea 55, dentro de `isOverdueOn`, línea 52) y copió el comentario (líneas 31-51). Dijo que da por supuesto que `due_date` llega de la base como texto `AAAA-MM-DD` y que el driver no aplica hora ni huso al leerlo (el tipo `string` de `schema_rules.ts` solo existe en TypeScript y no convierte nada al ejecutar). Advirtió de que la respuesta del `PUT /tasks/:id/due-date` no pasa por el driver y la lectura que sí pasa es `GET /tasks/:id?today=…`. Propuso, antes de crear nada, un usuario (`vencimiento@example.com`), una tarea con `dueDate` `2026-11-01`, lecturas con `today` 2026-11-18 y 2026-10-31 y una consulta `psql` con `pg_typeof(due_date)`, y preguntó si las creaba. No dio la conclusión.

---

## Prompt 4

**Modelo:** claude-opus-5-5 (esfuerzo no indicado)
**Herramienta:** Claude Code 2.1.322 (WSL, Terminal 1), lanzado a las 19:50 (hora local)

Respuesta mía a la pregunta del agente en el Prompt 3 (si creaba los datos y ejecutaba la comprobación).

```
Sí, créalos y ejecútalo
```

**Qué salió:** Arrancó el backend (`npm run dev`) contra la base de desarrollo en PostgreSQL y creó lo anunciado: el usuario `vencimiento@example.com`, la tarea `Tarea que ya debería estar vencida` y su fecha `2026-11-01` con `today` 2026-11-18. Respuestas, sin interpretar: el `PUT` devolvió `dueDate` `"2026-11-01"` e `isOverdue: true` (valor en memoria, sin releer de la base); el `GET /tasks/1?today=2026-11-18` devolvió `dueDate` `"2026-11-01T00:00:00.000Z"` e `isOverdue: false`; el `GET` con `today=2026-10-31` devolvió lo mismo, `isOverdue: false`; y `psql` mostró `due_date` `2026-11-01` de tipo `date`. Dejó la conclusión para mí. Al terminar el servidor seguía en marcha y los datos seguían en la base; ofreció borrarlos y pararlo.

---

## Prompt 5

**Modelo:** claude-opus-5-5 (esfuerzo no indicado)
**Herramienta:** Claude Code 2.1.322 (WSL, Terminal 1), lanzado a las 19:53 (hora local)

Limpieza de los datos de la comprobación, después de medir yo la línea 1 en la terminal de apoyo.

```
Borra los datos de prueba y para el servidor
```

**Qué salió:** Borró el usuario `vencimiento@example.com` con un `delete` (la tarea y el token se fueron con él por `CASCADE`) y comprobó que la base de desarrollo volvía a estar vacía: 0 usuarios, 0 tareas y 0 tokens. Paró el servidor; el comando de parada devolvió un error porque también cortó su propia shell, así que lo verificó aparte: ningún proceso `ace` y el puerto 3333 sin respuesta. No cambió nada del repositorio y las dos bases de Docker siguen arrancadas.
