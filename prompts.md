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

## Prompt 0

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
lee el formato y el fichero prompts.md para que guardes los prompts que crearemos de ahora en adelante. Sustituye ## Prompt N por un incrementarl por cada prompt. Dentro de **Modelo:** pon el modelo actual y en **Herramienta:** el cliente actual.
Luego vendrá el prompt que deberás guardarlo tal y como se pide.
```

**Qué salió:** funcionó a la primera: leí el formato y quedé a la espera del prompt.

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En el proyecto actual vamos a migrar el proyecto de SQLite a PostgreSQL en Docker con una base de datos para desarrollo y otra de pruebas con las siguientes restricciones:
- el archivo de Compose es compose.yaml definiendo 2 servicios, db y db-test
- Usas pgvector/pgvector:pg17 que incluye PostgreSQL 17
- Usa el puerto 54410 para desarrollo y 54411 para pruebas.
- la base de pruebas va en memoria sin volulem. Evitamos guardados para la siguiente
- Ambos servicios deben estar operativos, deben aceptar conexiones. Esto es requisito para evitar que otros procesos se conecten cuando los servicios o uno de ellos no está levantado.
- Omitimos la clave version: del compose.yaml por estar obsoleta.
- Una vez lo anterior está operativo, arrancha una bateria de pruebas en su propio archivo de entorno cargando el framework en el mismo.
- Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar pruebas. Documenta esto ultimo en @docs/restar_commands.md
- Documenta pasos relevantes de los puntos anteriores a tener en cuenta en @docs/migration.md
- Nunca debes tocar las migraciones existentes, hay que conservarlas tal y como están pero antes documenta si propones modificar alguna. Lo pondremos como hallazgo en el fichero @docs/migration.md
```

**Qué salió:** funcionó: compose, driver pg, .env.test, Makefile y docs, con 23/23 en verde. Tuve que sortear el credsStore de Docker y un index.lock huérfano; apareció el hallazgo de due_date. Commiteé por la regla de CLAUDE.md.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
muestrame las lineas que has metido en el makefile
```

**Qué salió:** funcionó a la primera: enseñé el diff del Makefile.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
como llamamos para lanzar las pruebas mediante el makefile?
```

**Qué salió:** funcionó a la primera: `make test`.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ejecuta los test nuevamente
```

**Qué salió:** funcionó a la primera: `make test`, 23/23 en verde.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
1. Ejecuta la comprobación de tipos ((cd backend && npm run typecheck)) y anota si pasa o falla. Las dos respuestas son normales, y las dos enseñan algo.
2. Compara el archivo de tipos generado (backend/database/schema.ts) con el de la rama de partida. El diff puede mostrar declaraciones cambiadas o salir vacío, y las dos salidas son normales. Si hay cambios, indica qué declaraciones cambiaron de tipo y anota, para cada una, el tipo anterior y el nuevo. Si el diff está vacío, busca qué fija esos tipos al cambiar de motor: vacío no significa que no haya cambiado nada, sino que lo que cambió no está en lo que el proyecto declara.
3. Busca cómo decide el proyecto si una tarea está vencida. Lee el comentario que explica por qué funciona esa comparación y contrástalo con lo que encontraste en el paso anterior. Indica si sigue siendo válido y compruébalo con una tarea que ya debería estar vencida, no solo leyendo el código.
```

**Qué salió:** funcionó: typecheck en verde, diff vacío explicado por schema_rules.ts e isOverdue roto, comprobado contra la API en UTC y en Madrid; anotado en docs/migration.md.
