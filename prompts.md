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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Antes de una migración de SQLite a PostgreSQL necesito resolver unas dudas sobre este proyecto. **No modifiques nada:** no crees, edites ni borres archivos, no instales dependencias y no ejecutes migraciones ni comandos que escriban en la base. Puedes leer archivos y usar `git` en modo consulta (`git log`, `git ls-files`, `git check-ignore`…).

Responde a cada pregunta con:
- la respuesta corta;
- la evidencia: rutas de archivo y líneas, o la salida del comando que hayas usado;
- tu grado de certeza: confirmado / probable / no encontrado.

Si algo no está en el repositorio, dilo y no lo supongas.

### 1. Credenciales y nombres de las bases
- ¿Hay en algún sitio (README, docs, `.env.example`, comentarios, scripts, CI) valores previstos para el usuario, la contraseña y los nombres de las bases de PostgreSQL?
- ¿Qué variables de base de datos se definen hoy en `backend/.env`, `backend/.env.example` y `backend/start/env.ts`? Lista los nombres y si son obligatorias u opcionales. No me muestres valores secretos.
- ¿Hay alguna convención de nombres en el proyecto (nombre del paquete, del repo, de la app en `APP_NAME`) que encaje como nombre de base?

### 2. pgvector
- ¿Hay alguna referencia a vectores, embeddings, búsqueda semántica o similitud en el código, las migraciones, los modelos, las dependencias o la documentación? Busca, entre otros, `vector`, `embedding`, `pgvector`, `similarity`, `openai`, `cosine`.
- ¿Hay algún indicio (README, TODO, issues, ramas, `git log`) de que se vaya a usar pgvector pronto?
- Con eso, ¿hace falta activar la extensión ya o basta con que la imagen la incluya?

### 3. Datos actuales en SQLite
- ¿Dónde está el archivo de SQLite que usa el proyecto (ruta configurada en `config/database.ts`)? ¿Existe? ¿Qué tamaño tiene?
- ¿Cuántas filas hay en cada tabla? Consúltalo en solo lectura (por ejemplo, `sqlite3 -readonly`). Si no puedes, dime por qué.
- ¿Hay seeders o factories en `backend/database/` que permitan regenerar los datos desde cero?
- ¿El archivo de SQLite está en git o en `.gitignore`?

### 4. Archivos de entorno y git
- ¿Qué archivos `.env*` hay en `backend/` y en la raíz, y cuáles están versionados (`git ls-files`)?
- ¿Qué dicen los `.gitignore` sobre `.env`, `.env.test` y `.env.*`? Comprueba con `git check-ignore -v backend/.env.test` si se ignoraría.
- ¿Algún `.env*` versionado contiene secretos reales (claves, tokens, `APP_KEY`)? Dime solo qué archivo y qué variable, sin el valor.

### 5. Pruebas
- ¿Cómo prepara hoy la base la batería de pruebas? Revisa `backend/tests/bootstrap.ts` y la configuración de Japa: si migra al empezar, si trunca, si usa transacciones globales o si usa SQLite en memoria.
- ¿Algún test, migración o consulta usa algo propio de SQLite (`sqlite_master`, `PRAGMA`, `AUTOINCREMENT`, booleanos como 0/1, fechas como texto, `json_extract`…) que pueda fallar en PostgreSQL? Lista los casos con su ruta.

### 6. Entorno local
- ¿Existe un `Makefile` en la raíz o en `backend/`? Si existe, ¿qué objetivos tiene?
- ¿Qué devuelven `docker --version` y `docker compose version`?
- ¿Hay algo escuchando ya en los puertos 54410 o 54411?

### Resumen final
Termina con una tabla de cuatro columnas: punto, respuesta, certeza y decisión que propones. Añade aparte las preguntas que solo pueda responder yo.
```

**Qué salió:** funcionó a la primera sin tocar nada, aunque el agente leyó el dump de producción (filas por tabla y dominio de correo) antes de ver el aviso de INC-0412 de no abrirlo y lo confesó. Hallazgos: no hay credenciales previstas en el repo (solo la pista `flowsync` del dump), pgvector solo aparece en el README, SQLite tiene 0 filas de negocio y no hay seeders, `backend/.env.test` está versionado y ningún `.gitignore` ni el hook lo cubren, los tests usan transacción global sin migrar, `isOverdueOn` comparará `Date` con string en PG (probable, sin comprobar), y 54410/54411 están libres con el 5432 ocupado por otro contenedor.
