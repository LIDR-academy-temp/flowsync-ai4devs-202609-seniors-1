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

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
Migra el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas.

Aplica estas restricciones

- El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.

- Usa la imagen pgvector/pgvector:pg17 que incluye PostgreSQL 17 con la extensión pgvector.

- Usa los puertos 54410 para desarrollo y 54411 para pruebas. 

- La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.

- Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. 

- Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

- Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

- Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.


Antes de cualquier cambio sobre migraciones existentes, indica que quieres modificar y solicita confirmación antes de hacerlo. 

No elimines la base de datos SQLite. Una vez aplicado este cambió voy a lanzar otros prompts para comparar las bases migradas con la original.

```

**Qué salió:** Funciona:  No he tenido que tocar ninguna migración. database/schema.ts sale idéntico. Los 23 tests pasan contra db-test, y el typecheck y el lint están limpios.
Advierte fechas como date en PostgreSQL: Lo ajusta para que devuelvan texto.


## Prompt 2

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
El resultado de ejecutar (cd backend && npm run typecheck) es
  > backend@0.0.0 typecheck
  > tsc --noEmit
  sin ningun mensaje más. ¿Se ha ejecutado alguna comprobación? ¿Significa que la comprobación de tipos es correcta?
```

**Qué salió:** Indica que es correecto, y no hay errores de validación.

## Prompt 3

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
Haz un diff del archivo backend/database/schema.ts contra la versión de la rama s10/start
```

**Qué salió:**  Diff vacío.

## Prompt 4

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
¿Porque no se producen cambios en el schema al cambiar de base de datos? Indica donde se están declarando los tipos de datos para que el schema no cambie

```

**Qué salió:** Indica que schema.ts determina tipos entidades typescript. 
Lucid determina conversión de tipos en sus reglas internas. 
únicamente fija tipos en due_date como tring en lugar de datetime. Pero código define date, y base de datos queda como date. Anoto como duda.



## Prompt 5

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
¿Donde se decide si una tarea está vencida? - Indicame donde está ese código.
  ¿que hora se considerá para establecer el límite de las tareas? ¿y con que zona horaria devuelve los datos la consulta, con que zona horaria se comparará, y de que dependen estas zonas?
```

**Qué salió:**  Indica punto de comprobación. Me quedo con dudas e itero.

## Prompt 6

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
En la comprobación de isOverdueOn, desde donde se genera la referenceDay que se usa para comparar. La genera el propio backed en UTC, o proviene del navegador del usuario usando métodos locales (no
  UTC)
```

**Qué salió:** Indica que proviene del navehador, en timezone del usuario.

## Prompt 7

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
Una misma tarea puede aparecer vencida dependiendo de la zona horaria (y dia el que esté) el usuario que lo consulta?
```

**Qué salió:** Confirma que si, y que esta documnetado para que sea así.


## Prompt 8

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
Cuantos registros tiene cada tabla  del esquema en cada base de datos (desarrollo, test y sqlLite)?
```

**Qué salió:** Tablas vacías, excepto  adonis_schema y  adonis_schema_versions.
Propone hacer seed para validar, lo descarto


## Prompt 9

**Modelo:** Opus 5.5 - medium effort
**Herramienta:** Claude Code

```
haz commit, y dame una descripción para el PR (sin hacerlo)
```

**Qué salió:** 


