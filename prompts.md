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
