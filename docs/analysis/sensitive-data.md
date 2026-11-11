# Datos personales, secretos e información que consulta el agente

Análisis hecho el 2026-11-10 sobre la rama `bloqueo-mmg`.

## 1. Datos personales

**Tablas y columnas** (sacadas de `backend/database/migrations/`):

| Tabla | Columnas | Por qué identifica a alguien |
|---|---|---|
| `users` | `email` (único, obligatorio), `full_name` (opcional) | Identifican a la persona directamente |
| `users` | `password` | Es un hash de su contraseña: es una credencial y va en la lista 2 |
| `users` | `id`, `created_at`, `updated_at` | Datos ligados a la persona (cuándo se registró) |
| `auth_access_tokens` | `tokenable_id` → `users.id`, `name`, `created_at`, `last_used_at`, `expires_at` | Registran su actividad: cuándo usa la app |
| `tasks` | `assignee_id` → `users.id`, `title`, `due_date` | Cada tarea queda ligada a una persona. `title` es texto libre y puede contener cualquier dato |

En la BD local (`backend/tmp/db.sqlite3`) hoy hay **0 filas** en `users`, `auth_access_tokens` y `tasks`. Ojo: los tests functional escriben en ese mismo fichero.

**Archivos con correos o nombres de ejemplo:**
- `backend/tests/functional/auth/signup.spec.ts`, `login.spec.ts`, `session.spec.ts`, `initials.spec.ts` y `backend/tests/functional/tasks/assignee.spec.ts`: correos `@example.com` (ada, alan, nadie, sin-nombre) y nombres como Ada Lovelace, Alan Turing y Otra Persona.
- `docs/capabilities/tasks/README.md:41,52,155` y `openspec/specs/auth/spec.md:13,150`: Ada Lovelace y su correo `@example.com`.
- `eval-harness/evals/commit-skill/fixture.sh:6`: `alumno@example.com`.
- `frontend/src/pages/login-page.tsx:50` y `register-page.tsx:92`: el texto de ejemplo del campo de correo, con un dominio real (`email.com`) en vez de uno reservado.
- **`README.md:143`**: "Ana Pérez" con un correo de **gmail.com**. Es el único ejemplo con un proveedor de correo real; los demás usan dominios reservados para ejemplos.
- **Historial de git:** los commits llevan nombres y correos **reales** de los autores del curso (gmail.com y lidr.co). Tu propio `git config` hará lo mismo con tus commits.

## 2. Secretos

| Archivo | ¿En el repo? | Qué tiene o puede tener |
|---|---|---|
| `backend/.env` | No, lo ignora `backend/.gitignore:8` | `APP_KEY`, la clave de cifrado y firma de la app. Nunca se commiteó (lo comprobé en el historial) |
| `frontend/.env` | No, lo ignora `frontend/.gitignore:16` | Solo `VITE_API_URL`. Cualquier variable `VITE_*` acaba visible en el navegador, así que ahí nunca puede ir un secreto |
| `backend/.env.example`, `backend/.env.test`, `frontend/.env.example` | Sí | Hoy ningún valor secreto (`APP_KEY=` está vacío) |
| `backend/tmp/db.sqlite3` | No, lo ignora `tmp/*` | Hashes de contraseñas y hashes de tokens de acceso |
| Otras rutas ignoradas: `.env.local`, `.env.*.local`, `*.local`, `*.log`, `logs`, `coverage/`, `eval-harness/evals/results/` | No | Logs e informes de evals que podrían contener tokens o conversaciones completas |
| `.claude/settings.local.json` | No, lo ignora tu `~/.config/git/ignore` | Hoy solo habilita el MCP de Atlassian, pero ahí suelen ir permisos y variables locales |
| `.mcp.json` | Sí | Solo la URL de Atlassian, sin token |
| `~/.claude/.credentials.json`, `~/.claude.json` | Fuera del repo (permisos 600) | Tokens de acceso a Claude y, probablemente, el token de Atlassian |
| `~/.claude/history.jsonl`, `~/.claude/projects/…`, `paste-cache/`, `file-history/` | Fuera del repo | Copias de todo lo que se pegó o leyó en cada sesión |
| `localStorage` del navegador, clave `flowsync.token` | Fuera del repo | El token de sesión del usuario en la app |
| `README.md:227` | Sí | Una contraseña de ejemplo (`S3cr3t`) dentro de una dirección de conexión a BD |
| Tests y docs | Sí | Contraseñas de prueba inventadas (`secreto123`) |
| `backend/config/database.ts` | Sí | `DB_PASSWORD` comentado: si se activa, la contraseña saldría del `.env` |

## 3. Qué consulta el agente y si sale de la máquina

Regla general: el modelo no corre en tu máquina. **Todo lo que leo con una herramienta viaja a la API de Anthropic** como parte de la conversación. Lo que no leo no sale.

**Lo que ya leí en esta sesión:**

| Elemento | ¿Sale? |
|---|---|
| `CLAUDE.md` (y `AGENTS.md`, que apunta a él), cargado automáticamente | **Sí** |
| Contexto que se inyecta solo: rama, estado de git, commits recientes, tu nombre y tu correo | **Sí** |
| Migraciones, `.gitignore`, `.env.example`, `.env.test`, partes del `README.md`, `HALLAZGOS.md`, `prompts.md` | **Sí** |
| `backend/.env` y `frontend/.env` | **Solo los nombres de las claves.** Los leí sin los valores, así que el valor de `APP_KEY` no salió |
| `.mcp.json`, `.claude/settings.json`, `settings.local.json`, `~/.claude/settings.json` | **Sí** (no contienen secretos) |
| Listado de `~/.claude/` | **Solo los nombres de los archivos.** No abrí `.credentials.json`, `~/.claude.json` ni `history.jsonl` |
| BD local: lista de tablas, conteo de filas, migraciones aplicadas | **Sí**, pero sin datos de personas porque no hay filas |
| Búsqueda de correos, nombres y contraseñas en el repo | **Sí**: los datos de ejemplo y el correo de gmail.com del README |
| Autores del historial de git | **Sí.** Ahí envié correos y nombres reales de terceros. No los repito en este informe |

**Lo que podría leer al hacer un cambio en el backend:**

| Elemento | ¿Sale? |
|---|---|
| Código, tests, `.adonisjs/`, specs de `openspec/`, READMEs de capabilities, skills y agentes de `.claude/` | **Sí**, cada vez que los leo. Incluye los datos de ejemplo |
| `backend/.env` | Lo usa AdonisJS al arrancar, y eso queda en tu máquina. **Sale si lo abro** (`cat`, Read) o si un comando muestra los valores en pantalla |
| BD local | `migration:run` o `npm test` corren en local y no envían nada. **Sale lo que muestre en pantalla**: una consulta con `sqlite3`, la consola de `node ace repl` o un test fallido que imprime la respuesta |
| Hooks | El de Prettier corre en local, solo sobre el frontend, y descarta su salida: no sale. **No existe ningún hook previo a los comandos** que frene un dato personal antes de un commit |
| MCP de Atlassian (skill `priority-ticket`) | **Sí, por partida doble**: las peticiones van a Atlassian y el contenido de los tickets vuelve a mi contexto, o sea, a Anthropic |
| `~/.claude/.credentials.json` | Lo usa la herramienta para autenticarse. El token viaja como credencial, pero no entra en mi contexto si no lo abro |
| Conversaciones guardadas en `~/.claude/projects/…` | Quedan en tu disco, pero son copia de todo lo que ya salió |
| `git push` y `gh pr create` | **Sí, a GitHub**: commits con el correo del autor y la descripción del PR |
