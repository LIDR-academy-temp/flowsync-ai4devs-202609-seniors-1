# Inventario de datos personales, secretos e información consultada

Fecha: 2026-11-11 · Rama: `bloqueo-ajmr` · Elaborado por Claude Code (Opus 5.5) a petición de Adam Marquez.

Método: lectura de migraciones, modelos, esquema generado, transformers y validadores; `git ls-files`,
`git status --ignored` y los tres `.gitignore`; búsqueda de correos y nombres con `git grep` en todo
el repositorio (incluido `openspec/changes/archive/`). **No se ha copiado ni leído ningún valor
secreto**: de los `.env` ignorados solo se leyeron los nombres de las claves (con el valor sustituido
antes de que la salida llegara al modelo) y de la base de datos local solo el número de filas por tabla.

---

## Lista 1 — Datos personales

### 1.1 Tablas y columnas

| Tabla.columna | Qué guarda | Por qué es dato personal | Evidencia (archivo:línea) |
|---|---|---|---|
| `users.full_name` | Nombre completo, opcional | Identifica directamente a la persona | `backend/database/migrations/1761885935168_create_users_table.ts:9` · `backend/database/schema.ts:61-62` (`fullName: string \| null`) · se valida en `backend/app/validators/user.ts:13` · se usa para calcular iniciales en `backend/app/models/user.ts:12` |
| `users.email` | Correo, único | Identifica directamente a la persona | migración `…create_users_table.ts:10` (`notNullable().unique()`) · `schema.ts:59-60` · `validators/user.ts:14` · fallback de iniciales en `models/user.ts:12` |
| `users.password` | Hash de la contraseña | Credencial de la persona (no es el texto plano: el modelo compone `withAuthFinder(hash)`) | migración `…create_users_table.ts:11` · `schema.ts:65-66` (`serializeAs: null`) · `models/user.ts:7` |
| `users.created_at` / `updated_at` | Fecha de alta y de modificación | Dato asociado a una persona identificada (cuándo se registró) | migración `…create_users_table.ts:13-14` |
| `auth_access_tokens.tokenable_id` | FK a `users.id` | Vincula cada token con una persona | `backend/database/migrations/1768620764696_create_access_tokens_table.ts:9-15` · `schema.ts:28` |
| `auth_access_tokens.hash` | Hash del token de acceso | Credencial de sesión de la persona | migración `…create_access_tokens_table.ts:19` · `schema.ts:20` |
| `auth_access_tokens.last_used_at`, `created_at`, `expires_at` | Marcas de tiempo de uso del token | Registro de actividad de una persona identificada | migración `…create_access_tokens_table.ts:21-24` · `schema.ts:24` |
| `auth_access_tokens.name` | Nombre opcional del token | Puede contener texto libre (hoy no se rellena en el código revisado); dato personal solo por asociación | migración `…create_access_tokens_table.ts:18` · `schema.ts:26` |
| `tasks.assignee_id` | FK a `users.id` | Vincula cada tarea con una persona (quién tiene asignado qué) | `backend/database/migrations/1786642030284_create_tasks_table.ts:11-17` · relación en `backend/app/models/task.ts:28-29` |
| `tasks.title`, `tasks.due_date` | Texto libre (≤200) y fecha | **No es dato personal por diseño**, pero es texto libre ligado a una persona por `assignee_id`: puede acabar conteniendo nombres u otros datos | `…create_tasks_table.ts:9` · `backend/database/migrations/1786644500000_add_due_date_to_tasks_table.ts:11` |

Exposición por la API (relevante para saber hasta dónde viajan estos datos):

- `backend/app/transformers/user_transformer.ts:6-13` devuelve `id`, `fullName`, **`email`**, `createdAt`, `updatedAt`, `initials` (solo en el perfil propio).
- `backend/app/transformers/task_assignee_transformer.ts:15` recorta el responsable a `id`, `fullName`, `initials`: **sin email**, y hay un test que lo comprueba (`backend/tests/functional/tasks/assignee.spec.ts:92-93`).
- `password` no se serializa nunca (`schema.ts:65`, `serializeAs: null`).
- En el navegador, el token de acceso se guarda en `localStorage` bajo `flowsync.token` (`frontend/src/auth/auth-provider.tsx:7,32`).

**Base de datos local real** (`backend/tmp/db.sqlite3`, ignorada por Git): a 2026-11-11 tiene
`users` = 3 filas, `auth_access_tokens` = 3 filas, `tasks` = 0 filas. **No he leído su contenido**,
así que no sé si esas 3 cuentas son ficticias (las de los tests, que escriben en este mismo fichero
según `CLAUDE.md`) o personas reales.

### 1.2 Archivos del repo con ejemplos de correos o nombres

No existen seeders, factories ni fixtures de base de datos (`backend/database/` solo contiene
`migrations/`, `schema.ts` y `schema_rules.ts`). Los ejemplos están en:

| Archivo | Qué contiene | Líneas |
|---|---|---|
| `backend/tests/functional/auth/signup.spec.ts` | «Ada Lovelace», «Otra Persona», `ada@example.com`, `sin-nombre@example.com` | 20-21, 29-31, 40, 45-46, 57-58, 70-71, 78, 83-84, 91, 96, 108-109, 114-115, 123, 125 |
| `backend/tests/functional/auth/login.spec.ts` | «Ada Lovelace», `ada@example.com`, `nadie@example.com` | 15-16, 29, 34, 48, 62, 66 |
| `backend/tests/functional/auth/session.spec.ts` | «Ada Lovelace», «Alan Turing», `ada@example.com`, `alan@example.com` | 13-14, 32, 75, 89-90 |
| `backend/tests/functional/auth/initials.spec.ts` | «Ada», `ada@example.com` | 17, 20-21 |
| `backend/tests/functional/tasks/assignee.spec.ts` | «Ada Lovelace», `ada@example.com`, `sin-nombre@example.com` | 66-67, 73, 80-81, 93, 103, 115 |
| `docs/capabilities/tasks/README.md` | «Ada Lovelace», `ada@example.com` (ejemplos de respuesta y un `curl`) | 41, 52, 155 |
| `openspec/specs/auth/spec.md` | «Ada Lovelace», `ada@example.com` | 13, 150 |
| `eval-harness/evals/commit-skill/fixture.sh` | `alumno@example.com` (configura `git user.email` en un repo de prueba) | 6 |
| `frontend/src/pages/login-page.tsx`, `register-page.tsx` | Placeholder `tu@email.com` | 50 / 92 |

Todos los correos usan el dominio reservado `example.com` (o el placeholder `email.com`) y los nombres
son de personajes históricos: **ficticios**. La contraseña de ejemplo de esos mismos ficheros se
trata en la lista 2.

Fuera de los archivos, pero dentro del repositorio: **el historial de Git** guarda nombre y correo de
cada autor de commit (4 autores distintos, uno de ellos tú). Esos son datos personales reales y viajan
con cada clon. No he revisado el contenido de ficheros borrados en commits antiguos.

---

## Lista 2 — Secretos

| Archivo / ubicación | ¿En el repo? | Tipo de valor | Notas |
|---|---|---|---|
| `backend/.env` | **Solo local** (ignorado por `.gitignore:10,12` y `backend/.gitignore:8`) | `APP_KEY`: clave de la aplicación con la que se cifra y firma (`backend/config/encryption.ts:16`). El resto (`TZ`, `PORT`, `HOST`, `NODE_ENV`, `LOG_LEVEL`, `APP_URL`, `SESSION_DRIVER`) es configuración, no secreto | Solo se leyeron los nombres de las claves |
| `frontend/.env` | **Solo local** (ignorado por `frontend/.gitignore:16`) | `VITE_API_URL`: una URL, no un secreto | Ojo: toda variable `VITE_*` se incrusta en el JS público al compilar; aquí nunca debería ir un secreto |
| `backend/tmp/db.sqlite3` | **Solo local** (ignorado por `.gitignore:16`, `backend/.gitignore:4`) | Hashes de contraseñas (`users.password`) y hashes de tokens de acceso (`auth_access_tokens.hash`), además de los datos personales de la lista 1 | 3 usuarios y 3 tokens; contenido no leído |
| `backend/tmp/openapi/openapi.json` | **Solo local** (ignorado) | Documento OpenAPI generado; no debería contener secretos | No lo he leído |
| `backend/.env.example` | En el repo | Plantilla: `APP_KEY` vacía (línea 9) | Sin valor secreto |
| `backend/.env.test` | En el repo (a propósito) | Solo `SESSION_DRIVER` | Sin secretos hoy; cualquier clave que se añada aquí se publica |
| `.github/workflows/openapi.yml:39` | En el repo | `APP_KEY` de CI escrita en claro | El propio fichero (líneas 32-34) explica que es un valor sin función secreta, solo para pasar la validación del env |
| `.github/workflows/revisor.yml:53,59` | En el repo (solo referencias) | Referencias a `secrets.CLAUDE_CODE_OAUTH_TOKEN` y `secrets.GITHUB_TOKEN` | Los valores viven en la configuración de GitHub, no en el repo |
| Tests y docs con contraseña de ejemplo (`backend/tests/functional/**`, `docs/capabilities/tasks/README.md:155`, `openspec/specs/auth/spec.md:13`) | En el repo | Contraseña de prueba ficticia | No protege nada real; solo sería un problema si alguien la reutiliza |
| `backend/config/database.ts:61,81,101,119` | En el repo | Comentarios que leerían `DB_PASSWORD` / `LIBSQL_AUTH_TOKEN` del entorno | Hoy no se usan (SQLite sin credenciales) |
| `Makefile:57` | En el repo | Lee `backend/.env` para comprobar si `APP_KEY` está definida | No contiene valor |
| `.mcp.json` | En el repo | Solo la URL del servidor MCP de Atlassian, sin credenciales | El token OAuth, si lo autorizas, se guarda fuera del repo (no sé con certeza dónde: probablemente en `~/.claude/.credentials.json`) |
| `~/.claude/.credentials.json` | **Solo local**, fuera del repo | Credenciales OAuth de Claude Code (por su nombre y ubicación; no lo he leído) | |
| `~/.claude/settings.json` | **Solo local**, fuera del repo | Configura un servidor MCP `sqlserver` con `MSSQL_HOST`, `MSSQL_PORT`, `MSSQL_USER`, **`MSSQL_PASSWORD`** y `MSSQL_DATABASE` escritos en el propio fichero | **Contraseña en claro en un fichero de configuración.** Solo he leído los nombres de las claves. Es el hallazgo más sensible del inventario |
| `~/.claude.json` | **Solo local** | Estado de Claude Code: `oauthAccount`, `userID`, `machineID`, historial por proyecto | Identificadores de cuenta más que secretos; solo leí los nombres de las claves de primer nivel |
| `~/.claude/scripts/*.ps1` (`bitbucket-helper`, `jira-helper`, `outlook-helper`, `pr-teams-notifier`…) y `pr-teams-notifier.json` | **Solo local** | Por su función podrían contener tokens de Bitbucket, Jira, Outlook o webhooks de Teams | **No los he leído: no sé si los contienen** |
| `~/.claude/projects/<proyecto>/*.jsonl` | **Solo local** | Transcripciones completas de sesiones anteriores | Contienen todo lo que entró en esas sesiones, secretos incluidos si alguna vez se mostraron |
| `localStorage` del navegador (`flowsync.token`) | **Solo local**, perfil del navegador | Token de acceso en claro de la API | |

Huecos en `.gitignore` (archivos que hoy no existen pero que Git **sí** versionaría si se crearan):

- `backend/.env.production` y `backend/.env.development`: ni el `.gitignore` raíz (solo `.env` y `.env.local`) ni `backend/.gitignore` (solo las variantes `*.local`) los cubren.
- `.claude/settings.local.json`: ninguna regla lo ignora. Es donde Claude Code guarda permisos y a veces variables de entorno locales.

---

## Lista 3 — Información que consulto yo

Regla general: **yo no me ejecuto en tu máquina**. El modelo corre en los servidores de Anthropic.
Todo lo que entra en mi contexto (el prompt de sistema que monta Claude Code y la salida de cada
herramienta que ejecuto) se envía a la API de Anthropic, y **se reenvía en cada petición posterior de
la misma sesión**. Lo que no entra en el contexto (ficheros que no leo) no sale. Hay dos momentos:

- **Al arrancar la sesión** (y en cada turno a partir de ahí): lo que Claude Code añade al prompt de sistema sin que yo lo pida.
- **Al terminar cada herramienta**: su salida se envía en la siguiente petición al modelo.

Cuánto tiempo conserva Anthropic esos datos y si se usan o no para entrenamiento depende del plan y de
la configuración de la cuenta u organización. **No lo sé con certeza para tu cuenta.**

### 3.1 Lo que ya estaba en mi contexto sin que tú me lo enseñaras

| Elemento | Contenido | ¿Sale de tu máquina? | Cuándo |
|---|---|---|---|
| `CLAUDE.md` del repo (completo) | Instrucciones del proyecto | Sí | Al arrancar la sesión y en cada turno |
| Snapshot de `git status` | Rama actual, rama principal, **tu nombre de Git**, últimos 5 commits | Sí | Al arrancar |
| **Tu correo** (`userEmail`) | El de tu cuenta | Sí | Al arrancar |
| Entorno | SO, versión de Windows, ruta del proyecto, ruta del scratchpad (incluye tu usuario de Windows) | Sí | Al arrancar |
| **Directorios de trabajo adicionales** (desde `~/.claude/settings.json`) | Rutas de otros proyectos: SIGA, siga_v2_vanilla, api_siga (OneDrive de Arendal), portal-proveedores, api_proveedores | Las rutas, sí. Su contenido no, salvo que lo lea | Al arrancar. Puedo leer esos directorios si una tarea me lleva allí |
| Descripciones de skills: las del proyecto (`.claude/skills/`, `.claude/commands/`), las de usuario (`~/.claude/skills/`: `revisar-pr`, `te`, `servicios-*`) y las de la organización (`anthropic-skills:*`) | Nombre y descripción de cada skill (mencionan Bitbucket, SIGA, Jira, Teams, entornos DEV/QA/PROD, proyectos de ingeniería) | Sí, las descripciones. El cuerpo de cada skill solo si se invoca | Al arrancar |
| Agentes disponibles (incluido `.claude/agents/adversarial-reviewer.md`) | Nombre y descripción | Sí | Al arrancar |
| Instrucciones de los conectores MCP de claude.ai (Claude Docs, Claude Data) y la lista de servidores sin autorizar (Atlassian, Slack, Microsoft 365…) | Texto de instrucciones y nombres | Sí. Además, si usara uno de esos conectores, el contenido iría también a ese servicio | Al arrancar y a mitad de sesión, cuando se cargaron |
| Sistema de memoria (`~/.claude/projects/<proyecto>/memory/`) | Instrucciones de uso. El directorio está **vacío**, así que no se cargó ninguna memoria | Sí (las instrucciones); no había contenido | Al arrancar |
| Recordatorios del harness (atribución de commits, fecha) | Texto fijo | Sí | Al arrancar |

### 3.2 Lo que he leído para responder a esto

| Elemento | ¿Leído? | ¿Sale de tu máquina? | Cuándo |
|---|---|---|---|
| Lista de ficheros versionados e ignorados (`git ls-files`, `git status --ignored`) | Sí, completo | Sí | Al terminar el comando |
| Migraciones, modelos, `database/schema.ts` (fragmentos), transformers, validador de usuario | Sí | Sí | Al terminar cada comando |
| `.gitignore` ×3, `.mcp.json`, `.claude/settings.json` (incluye el hook de Prettier) | Sí, completos | Sí | Al terminar el comando |
| `backend/start/env.ts`, `backend/.env.example`, `backend/.env.test`, `frontend/.env.example` | Sí, completos | Sí (no contienen secretos) | Al terminar el comando |
| `backend/.env`, `frontend/.env` | **Solo los nombres de las claves**: el valor se sustituyó en local antes de que la salida me llegara | Los nombres y comentarios, sí. Los valores, **no** | Al terminar el comando |
| `backend/tmp/db.sqlite3` | **Solo los nombres de tabla y el número de filas** (consulta de solo lectura) | Esos recuentos, sí. Las filas, no | Al terminar el comando |
| Resultados de `git grep` de correos y nombres | Sí: líneas recortadas de tests, docs y specs | Sí | Al terminar el comando |
| Líneas con referencias a secretos en workflows, `Makefile` y `config/` | Sí | Sí | Al terminar el comando |
| Nombres de los autores del historial de Git, con el número de commits de cada uno | Sí (sin correos) | Sí | Al terminar el comando |
| Listado de `~/.claude/` y `~/.claude/projects/<proyecto>/` | Sí: nombres de fichero, tamaños y fechas (incluye los nombres de tus scripts `jira-helper`, `outlook-helper`, `bitbucket-helper`, `vigilar-vpn`…) | Sí | Al terminar el comando |
| `~/.claude/settings.json` | Solo nombres de claves: secciones, nombre del servidor MCP `sqlserver` y nombres de sus variables. **No los valores** | Esos nombres, sí | Al terminar el comando |
| `~/.claude.json` | Solo los nombres de las claves de primer nivel | Sí | Al terminar el comando |
| **Tu `PATH` completo** | Sí, **sin querer**: un `which sqlite3` que falló lo imprimió entero. Revela software instalado (SQL Server, MySQL Shell, PHP, .NET, InvGate, Java, nvm…) y tu usuario | Sí | Al terminar ese comando |
| Este mismo `inventario.md` | Lo he escrito yo | Sí (lo genera el modelo) | Al escribirlo |

### 3.3 Lo que leería si me pidieras un cambio en el backend

| Elemento | ¿Lo leería? | ¿Sale de tu máquina? | Cuándo |
|---|---|---|---|
| `CLAUDE.md`, `AGENTS.md`, `REVIEW.md`, `openspec/specs/*/spec.md`, `docs/capabilities/<cap>/README.md`, `docs/architecture.md` | Sí | Sí | Al leerlos |
| Código de `backend/app/`, `start/`, `config/`, migraciones, `database/schema.ts`, tests | Sí, los que toque el cambio | Sí | Al leerlos |
| `backend/.adonisjs/` (generado y versionado) | Sí, para revisar el diff regenerado | Sí | Al leerlo o al ver el diff |
| `.claude/settings.json`, skills del proyecto (`/commit`, openspec) | El cuerpo de la skill solo si se invoca | Sí | Al invocarla |
| `backend/.env` | **No lo necesito** para cambiar código. Lo leería solo si me lo pides o para depurar un error de arranque | Si lo leo entero, **sí, incluida `APP_KEY`** | Al leerlo |
| `backend/tmp/db.sqlite3` | Normalmente no. Podría consultarlo para depurar datos | Si consulto filas, **sí, con nombres, correos y hashes** | Al terminar la consulta |
| **Salida de `npm test`, `npm run dev`, `node ace …`** | Sí, la ejecuto y leo su salida | Sí. **No estoy seguro** de qué puede incluir: un test que falla puede imprimir filas de la BD compartida (con nombres y correos de las cuentas que haya), y un error de arranque puede imprimir variables de entorno | Al terminar cada comando |
| `git diff` / `git log` | Sí | Sí, incluidos los nombres de los autores y, con `git log` sin formato, sus correos | Al terminar el comando |
| Salida de los hooks (`PostToolUse` de Prettier en `.claude/settings.json`; `Notification` y `Stop` en `~/.claude/settings.json`) | Los hooks se ejecutan en local. Su salida o sus errores pueden llegarme | Lo que me devuelvan, sí. **No he leído los comandos de los hooks globales**: no sé si alguno envía algo a otro servicio por su cuenta (por ejemplo, a Teams) | Tras cada Write/Edit o al acabar el turno |
| Conectores MCP (Atlassian del `.mcp.json`, `sqlserver` global, conectores de claude.ai) | Solo si una tarea los requiere | Sí, por partida doble: la petición va al servicio externo (o a la BD SQL Server) y la respuesta entra en mi contexto y va a Anthropic | Al usarlos |
| Otros directorios de trabajo (SIGA, proveedores…) | No para un cambio en FlowSync | Solo si los leyera | Al leerlos |
| Transcripción local de la sesión (`~/.claude/projects/…/*.jsonl`) | No la leo, pero Claude Code la escribe con todo lo anterior | Se guarda en local. **No sé con certeza** si Claude Code la sube a algún sitio; según su configuración, envía telemetría de uso, que en principio no incluye el contenido | Durante toda la sesión |
| Resúmenes por compactación del contexto | Automáticos si la sesión se alarga | Sí: el resumen se genera en el modelo con el contenido ya enviado | Al compactar |

### 3.4 Dudas que no he podido resolver

- Retención y uso de los datos por parte de Anthropic para tu cuenta concreta (depende del plan y de la organización).
- Si los hooks globales `Notification` y `Stop`, o los scripts de `~/.claude/scripts/`, envían algo a servicios externos.
- Si las 3 cuentas de `db.sqlite3` son de prueba o de personas reales.
- Dónde guarda exactamente Claude Code el token OAuth de los MCP remotos (Atlassian).
- Si los informes HTML de `eval-harness/informes/` incluyen transcripciones con datos de la máquina de quien los generó. La búsqueda de correos no encontró ninguno, pero no los he leído enteros.
