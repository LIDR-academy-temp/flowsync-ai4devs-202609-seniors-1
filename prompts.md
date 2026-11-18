# Prompts

**Modelo:** Claude Opus 5 · **Herramienta:** Claude Code (app de escritorio) para decidir el
método, medir y redactar la entrega; **Claude Code en modo `--print`** para el prompt que hizo el
cambio de motor.

> **Un solo prompt al agente, y a propósito.** La parte A es un encargo con ocho restricciones que
> ya vienen dadas por el enunciado: lo que decide el resultado no es iterar, es **qué le dices
> antes de empezar**. La parte B no la hice con prompts: la medí.

---

## Prompt 1 — el cambio de motor, con el aviso de que no puedo ejecutarlo

**Modelo:** Claude Opus 5 · **Herramienta:** Claude Code, modo `--print`

```
Cambia el motor de este proyecto de SQLite a PostgreSQL en Docker, con una base para desarrollo y otra para pruebas.

AVISO IMPORTANTE SOBRE MI ENTORNO: no tengo Docker instalado y no lo voy a instalar ahora. Quiero que escribas igualmente todos los archivos, completos y como si fueran a ejecutarse, pero NO intentes levantar nada, no ejecutes docker ni make, y no des por verde nada que no hayas podido ejecutar. Si algo no se puede comprobar sin Docker, dilo en vez de suponerlo.

Restricciones, que son las mismas del directo:

- El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.
- Usa la imagen pgvector/pgvector:pg17, que trae PostgreSQL 17 con la extension pgvector.
- Puertos 54410 para desarrollo y 54411 para pruebas, para no chocar con una instancia en el 5432.
- La base de pruebas va en memoria, sin volumen: los datos de una ejecucion no se quedan para la siguiente.
- Comprobacion de salud en los dos servicios. El arranque tiene que esperar a que las dos bases acepten conexiones, porque en el primer arranque PostgreSQL todavia esta inicializando cuando otros procesos intentan conectarse.
- Omite la clave version: de compose.yaml, que esta obsoleta.
- Haz que la bateria de pruebas se conecte a la base de pruebas con su propio archivo de entorno, el que el framework carga solo en ese entorno.
- Anade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.

Y una restriccion que es la mas importante de todas:

- CONSERVA INTACTAS LAS MIGRACIONES EXISTENTES. Si te parece que hay que modificar alguna, PARATE y dimelo en vez de tocarla. Que te haga falta cambiar una migracion ya aplicada es un hallazgo del ejercicio, no un tramite.

No hagas ningun commit. Cuando acabes, dime exactamente que archivos tocaste, que no pudiste comprobar por no tener Docker, y si en algun momento te vino la tentacion de tocar una migracion y por que.
```

**Qué salió:** los nueve archivos escritos y ninguna migración tocada. Pero lo que de verdad
devolvió este prompt fue la respuesta a la última pregunta:

> ### 🎯 *«¿Me tentó tocar una migración? **Sí**, la de `add_due_date_to_tasks_table`.»*
>
> Y a continuación, sin que yo hubiera dicho nada de la parte B: que `pg` convierte una columna
> `date` en un `Date`, que `schema.ts` no lo nota **porque `schema_rules.ts` fija `dueDate` como
> `string`**, y que `isOverdueOn` compara texto contra texto y deja de valer *«sin dar ningún
> error»*. El arreglo tentador era cambiar `table.date` por `table.string` **en la migración**.
> No lo hizo: lo resolvió en la conexión.

Y avisó por su cuenta de algo que yo tenía que decidir: **ese arreglo tapa justo lo que la parte B
pide encontrar.** Lo dejé puesto, y la parte B documenta el fallo que habría sin él.

> 🎯 **Las dos frases que cambiaron el resultado de este prompt** no son ninguna de las ocho
> restricciones técnicas:
> - *«no des por verde nada que no hayas podido ejecutar»* → produjo una lista de cinco cosas no
>   comprobadas, en vez de un «listo».
> - *«si te parece que hay que modificar una migración, párate y dímelo: eso es un hallazgo del
>   ejercicio, no un trámite»* → convirtió la tentación en el hallazgo central de la entrega.

---

## Lo que no fueron prompts, y es la parte B entera

La parte B no se la pedí al agente. **La medí**, porque la lección 1 de este módulo va justo de
eso: el código dice cómo se llama la columna, la base dice qué hay dentro, y son preguntas
distintas.

### 1 · Ejecutar la comparación en vez de razonarla

```js
const ref = '2026-11-18';
'2026-11-17' < ref                        // true   <- lo que pasa hoy, con SQLite
new Date('2026-11-17T00:00:00Z') < ref    // false  <- lo que pasaria con PostgreSQL
new Date('2026-11-17T00:00:00Z') >= ref   // false  <- y tambien al reves
Number(ref)                               // NaN    <- el motivo
```

**Las tres filas de abajo dan `false`.** No es que la comparación se equivoque: es que `<` convierte
los dos lados a número, `Number("2026-11-18")` es `NaN`, y **toda comparación con `NaN` es falsa en
los dos sentidos**. Ninguna tarea volvería a estar vencida.

### 2 · Ir a la fuente primaria del driver en vez de fiarme de lo que recordaba

Mi hallazgo se apoyaba en «`pg` devuelve un `Date`». Eso lo había leído en la respuesta del agente,
y la respuesta de un agente es la peor de las evidencias *(M9, lección 4)*. Fui a la documentación
de node-postgres: devuelve **un objeto `Date`** para `date` y `timestamp`, **y los convierte a la
hora local del proceso**. Lo segundo es peor que lo primero: es *el día de más* que el comentario
del modelo decía evitar.

### 3 · Contar los tests en vez de suponer que algo cubre el vencimiento

```bash
grep -rn "due\|Overdue" tests/     # no devuelve nada
find tests -name "*.spec.ts"       # 5 ficheros
```

**Cinco ficheros de prueba y ninguno menciona el vencimiento.** Esto es lo que convierte el hallazgo
en grave: después de migrar, `npm test` sigue verde — y siempre iba a seguir verde, porque **nunca
probó lo único que se rompe**.

### 4 · Medir qué se queda atrás, con una consulta

Con `better-sqlite3` ya desinstalado por el propio cambio, leí la base anterior con el `node:sqlite`
del runtime: **3 usuarios, 3 tokens, 0 tareas**, en un archivo que está en `.gitignore` y al que ya
no apunta nada.

---

## Lo que delató el archivo esta vez

En el M7 fue que recortar el alcance era el prompt. En el M8, que el prompt no varió una coma y los
cinco resultados fueron distintos. En el M9, que el hook bloqueó un correo y escribió otro. Este:

> ### Las tres redes que deberían avisar fallan a la vez, y cada una por un motivo distinto.

**`npm run typecheck` pasa** porque `schema_rules.ts` fija el tipo declarado. **El diff de
`schema.ts` sale vacío** por la misma razón. **La batería sigue verde** porque no existe el test.

Un cambio de motor no rompe lo que está declarado: **rompe lo que se daba por supuesto en un
comentario**, y el comentario estaba bien escrito y era verdad hasta el momento exacto en que dejó
de serlo.
