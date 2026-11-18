# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

> ⚠️ **Dónde me quedé:** sin Docker en esta máquina, así que **la parte A está escrita pero no
> ejecutada**: no he levantado las bases, ni migrado contra PostgreSQL, ni corrido la batería. Todo
> lo que afirmo abajo está medido sobre lo que **sí** pude ejecutar, y lo que no, lo digo.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- **Cero filas cambian de valor, porque cero filas se mueven**, y eso es justo lo que me preocupa.
  El cambio de motor **crea tablas vacías en PostgreSQL y no traslada ni una fila**: medido con
  `SELECT count(*)` sobre la SQLite que sigue en disco, se quedan ahí **3 usuarios, 3 tokens de
  acceso y 0 tareas**. En el árbol cae en la **primera rama** —«se deshace con otra migración»,
  porque nada se destruye—, pero solo mientras ese archivo sobreviva, y sobrevive **por suerte, no
  por diseño**: `backend/tmp/db.sqlite3` está en `.gitignore`, no lo referencia ya nada, y el mismo
  cambio **quitó `better-sqlite3` de `package.json`**, así que el proyecto ya no puede ni abrir su
  propia base anterior *(lo comprobé: tuve que leerla con el `node:sqlite` del runtime)*. Es decir:
  **el cambio de motor no está en el árbol, porque el árbol habla de qué le pasa a los datos y aquí
  los datos no participan.** La lección lo dice en una línea: *«si cambias de motor, planifica
  también la transferencia de los datos como un trabajo separado de la creación de las tablas»*.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- **Que `Task.isOverdueOn` deja de funcionar, en silencio, y ninguna de las tres redes lo ve.** La
  comparación es `this.dueDate < referenceDay` y su comentario explica por qué vale: *«se compara
  texto contra texto porque dos fechas ISO comparadas así **son** la comparación de días del
  calendario»*. Con SQLite eso se cumple. Con PostgreSQL, el driver `pg` **convierte una columna
  `date` en un objeto `Date` de JavaScript, además pasado a la hora local del proceso**
  *(documentación de node-postgres)*, y `Date < string` **siempre es `false`**: lo ejecuté, y el
  motivo es que `<` convierte a número y `Number("2026-11-18")` es `NaN`. Resultado: **ninguna
  tarea vuelve a estar vencida nunca, sin un solo error**. Y las tres redes que deberían avisar
  fallan a la vez, las tres comprobadas por mí: **`npm run typecheck` pasa** y **el diff de
  `backend/database/schema.ts` sale vacío**, porque `schema_rules.ts` *fija* `due_date` a
  `tsType: 'string'` —el propio archivo explica que sin esa regla sería un `DateTime`—, así que el
  sistema de tipos declara justo lo único que cambió; y la batería **no puede verlo porque no
  existe**: de los **5 ficheros de prueba, ninguno menciona `due`, `dueDate` ni `isOverdueOn`**.
  La única definición de «vencida» del sistema, que alimenta el campo `isOverdue` de la API desde
  `task_detail_transformer.ts:29`, **no tiene ni un test**.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- **De todo lo que necesita un contenedor, que es la mitad del ejercicio.** No tengo Docker, así
  que no he comprobado que `compose.yaml` sea válido, que la comprobación de salud espere de verdad
  al primer arranque, que las migraciones se apliquen en PostgreSQL ni que la batería pase. En
  particular, **el arreglo que puse no lo he visto funcionar**: resolví el problema del punto 2 en
  la conexión, con `pg.types.setTypeParser(DATE, v => v)` en `config/database.ts`, y eso está
  **razonado, no observado** — es exactamente la clase de afirmación que este módulo enseña a no
  dar por buena. Y me queda una duda que el contenedor tampoco resolvería: **si hubiera tareas con
  fecha, ¿lo habría cazado alguien?** Como no hay test de vencimiento, la respuesta es que no, y
  entonces **el valor de «las pruebas siguen en verde» después de migrar es exactamente cero** para
  lo único que de verdad se rompió.
  - 📌 **Un apunte del proceso, que creo que es el hallazgo que pide el enunciado:** al agente
    **le tentó modificar la migración `add_due_date_to_tasks_table`** para cambiar `table.date` por
    `table.string` y esquivar el problema. **Se paró y me lo dijo en vez de tocarla**, que es lo que
    pedía la restricción. `git diff` sobre `backend/database/migrations/` sale vacío.
