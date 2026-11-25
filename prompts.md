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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas, atendiendo a estas restricciones:


La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.

Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.

Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.
```

**Qué salió:** funcionó, con dos correcciones en el camino. Creó `compose.yaml` (`db` :54410 con volumen, `db-test` :54411 en `tmpfs`, healthchecks, sin `version:`), conexión `pg` por `DB_*`, `.env.test` propio y los atajos `db-up`, `db-down`, `migrate-test`, `migrate-all` y `test` en el Makefile. Tomó los nombres, la imagen y los puertos del README del repo, que el prompt no daba. El primer `tmpfs` apuntaba a la ruta equivocada y dejaba un volumen anónimo; lo detectó con `docker inspect` y lo corrigió. Un comando con `rm` del SQLite de desarrollo fue bloqueado y se rehízo sin él. 23 tests en verde, `typecheck` y `lint` limpios. Commit `427e3e9` (vía `/commit`).

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
escribe todos los prompts que te he pedido al archivo prompts.md. Fíjate que hay un ejemplo para que te hagas una idea. Reemplázalo con los prompts reales que te he pedido en esta sesión y con el restultado obtenido al ejecutar cada uno de ellos
```

**Qué salió:** reemplazó el ejemplo de este archivo por los dos prompts reales de la sesión, con su resultado.
