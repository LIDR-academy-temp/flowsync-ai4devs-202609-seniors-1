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

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Quiero un inventario de los datos personales de este proyecto. Es solo lectura: no modifiques ningún archivo.

Dame dos listas:

1. Las tablas y columnas de la base de datos que almacenan información de una persona identificable (por ejemplo nombre, correo o contraseña). Compruébalo leyendo las migraciones y no lo supongas: para cada columna indica la migración y la línea donde se define.

2. Los archivos del repositorio que contienen ejemplos de correos o de nombres de personas (semillas, tests, documentación, datos de prueba). Para cada archivo indica la ruta, si el dato es un correo o un nombre y en qué línea aparece. No copies los valores.

Si algo no lo has podido comprobar, dímelo en vez de suponerlo.
```

**Qué salió:** 
Solo he leído; no he modificado ningún archivo. Los números de línea vienen de las migraciones, de grep y de una lectura directa de las líneas dudosas.

1. Datos personales en la base de datos

Hay cuatro migraciones (backend/database/migrations/). Solo users guarda datos de una persona identificable por sí misma.

┌─────────────────┬────────────────────────────────────────┬────────────────────────────────────────┐
│  Tabla.columna  │                 Qué es                 │            Migración:línea             │
├─────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
│ users.full_name │ Nombre, opcional                       │ 1761885935168_create_users_table.ts:9  │
├─────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
│ users.email     │ Correo, único                          │ 1761885935168_create_users_table.ts:10 │
├─────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
│ users.password  │ Contraseña (la columna guarda el hash) │ 1761885935168_create_users_table.ts:11 │
└─────────────────┴────────────────────────────────────────┴────────────────────────────────────────┘

Estas columnas no identifican a nadie por sí solas, pero enlazan con una persona o registran su actividad:

Tabla.columna: users.id
Por qué: Clave de la persona
Migración:línea: 1761885935168_create_users_table.ts:8
────────────────────────────────────────
Tabla.columna: users.created_at, users.updated_at
Por qué: Fechas de alta y de modificación de la cuenta
Migración:línea: 1761885935168_create_users_table.ts:13, :14
────────────────────────────────────────
Tabla.columna: auth_access_tokens.tokenable_id
Por qué: FK a users.id: de quién es el token
Migración:línea: 1768620764696_create_access_tokens_table.ts:10
────────────────────────────────────────
Tabla.columna: auth_access_tokens.hash
Por qué: Credencial de sesión (hash del token)
Migración:línea: 1768620764696_create_access_tokens_table.ts:19
────────────────────────────────────────
Tabla.columna: auth_access_tokens.last_used_at, created_at, expires_at
Por qué: Cuándo usa la sesión
Migración:línea: 1768620764696_create_access_tokens_table.ts:21, :23, :24
────────────────────────────────────────
Tabla.columna: tasks.assignee_id
Por qué: FK a users.id: quién lleva la tarea
Migración:línea: 1786642030284_create_tasks_table.ts:12

Hay columnas que no cuento como datos personales. tasks.title (:9) es texto libre y puede contener datos personales si alguien los escribe, aunque el diseño no lo prevé. auth_access_tokens.name (:18) es el nombre del token. tasks.due_date (1786644500000_add_due_date_to_tasks_table.ts:11) no identifica a nadie.

2. Ficheros con correos o nombres de ejemplo

Ninguno parece un dato real de una persona. Todos los correos de tests y docs usan dominios reservados (example.*), salvo los dos casos señalados abajo.

Correos

┌─────────────────────────────────────────────────┬─────────────────────────────────────────────────┐
│                      Ruta                       │                     Líneas                      │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ backend/tests/functional/auth/signup.spec.ts    │ 21, 29, 40, 46, 58, 71, 78, 84, 91, 109, 115,   │
│                                                 │ 123                                             │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ backend/tests/functional/auth/login.spec.ts     │ 16, 29, 34, 48, 62, 66                          │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ backend/tests/functional/auth/session.spec.ts   │ 13, 32, 75, 90                                  │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ backend/tests/functional/auth/initials.spec.ts  │ 17, 20, 21                                      │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ backend/tests/functional/tasks/assignee.spec.ts │ 67, 81, 93, 103, 115                            │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ docs/capabilities/tasks/README.md               │ 155                                             │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ openspec/specs/auth/spec.md                     │ 13, 150                                         │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ eval-harness/evals/commit-skill/fixture.sh      │ 6 (git config user.email)                       │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│                                                 │ 143: correo inventado de dominio real           │
│ README.md                                       │ (gmail.com) con contraseña de ejemplo, en el    │
│                                                 │ ejercicio del hook                              │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ frontend/src/pages/login-page.tsx               │ 50 (placeholder genérico, no es una persona)    │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ frontend/src/pages/register-page.tsx            │ 92 (placeholder genérico, no es una persona)    │
└─────────────────────────────────────────────────┴─────────────────────────────────────────────────┘

README.md:227 no es un correo. Es una cadena de conexión usuario:clave@host con una contraseña de ejemplo. El patrón de correo la detectó por su forma, pero tiene credenciales de ejemplo.

Nombres

Los nombres de ejemplo son «Ada Lovelace», «Alan Turing», «Otra Persona» y «Ana Pérez».

┌───────────────────────────────────────────────────────────────────────┬───────────────────────────┐
│                                 Ruta                                  │          Líneas           │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│                                                                       │ 20, 30, 57, 70, 83, 96,   │
│ backend/tests/functional/auth/signup.spec.ts                          │ 108, 114 («Otra           │
│                                                                       │ Persona»), 125            │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ backend/tests/functional/auth/login.spec.ts                           │ 15                        │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ backend/tests/functional/auth/session.spec.ts                         │ 14, 89 («Alan Turing»)    │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ backend/tests/functional/auth/initials.spec.ts                        │ 16                        │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ backend/tests/functional/tasks/assignee.spec.ts                       │ 66, 73, 80                │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ backend/app/openapi/schemas.ts                                        │ 34 (ejemplo del esquema   │
│                                                                       │ OpenAPI)                  │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ docs/api/openapi.json                                                 │ 81 (el mismo ejemplo, ya  │
│                                                                       │ generado)                 │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ docs/capabilities/tasks/README.md                                     │ 41, 52, 155               │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ openspec/specs/auth/spec.md                                           │ 13, 140, 211, 212         │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ openspec/specs/tasks/spec.md                                          │ 103, 104                  │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ openspec/changes/archive/2026-08-13-add-task-list/specs/tasks/spec.md │ 99, 100                   │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ README.md                                                             │ 143, 145 («Ana Pérez»)    │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│ frontend/src/pages/register-page.tsx                                  │ 74 (placeholder de        │
│                                                                       │ nombre)                   │
├───────────────────────────────────────────────────────────────────────┼───────────────────────────┤
│                                                                       │ 7 (git config user.name;  │
│ eval-harness/evals/commit-skill/fixture.sh                            │ no he comprobado el       │
│                                                                       │ valor)                    │
└───────────────────────────────────────────────────────────────────────┴───────────────────────────┘

Lo que no he podido comprobar

- La base de datos local. backend/tmp/db.sqlite3 existe y está en .gitignore. sqlite3 no está instalado, así que no he comparado su esquema real con las migraciones ni he leído filas. El inventario sale solo de las migraciones, y backend/database/schema.ts (generado) lo confirma.
- Los nombres. Los he buscado con una heurística (los nombres que ya había visto y una lista de nombres y apellidos habituales). Puede quedar algún nombre en otro formato. Los correos sí son exhaustivos para el patrón x@y.z.
- Ficheros excluidos o no leídos. Excluí package-lock.json y no he abierto los .env* (backend/.env está ignorado; .env.example y .env.test están versionados). No he revisado a mano los informes HTML de eval-harness/informes/, aunque ninguno salió en la búsqueda de correos.
- Una discrepancia con CLAUDE.md. Dice que tasks no tiene ningún test, pero existe backend/tests/functional/tasks/assignee.spec.ts.

---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ahora quiero el inventario de los secretos de este proyecto. Sigue siendo solo lectura: no modifiques ningún archivo.

Dame la lista de archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio. Mira también lo que ignora Git y los archivos que existen en el directorio de trabajo aunque no estén versionados.

Para cada archivo indica: la ruta, si está versionado o ignorado por Git (compruébalo con Git, no lo supongas), qué tipo de secreto es o podría ser (clave de la aplicación, contraseña, token, hash...) y por qué crees que lo contiene. No copies ningún valor.

Si algo no lo has podido comprobar, dímelo en vez de suponerlo.
```

**Qué salió:** 
Solo he leído; no he modificado nada y no copio ningún valor. En los .env solo he mirado los nombres de variable y la longitud del valor.

Archivos con secretos reales o posibles

Ruta: backend/.env
Git: Ignorado (backend/.gitignore:8)
Tipo de secreto: Clave de la aplicación (APP_KEY)
Por qué lo creo: Tiene APP_KEY con 32 caracteres, es decir, rellena. start/env.ts:22 la declara
Env.schema.secret() y config/encryption.ts:16 la usa como clave de cifrado. Con ella se firman o
cifran cookies y sesión. El resto de variables (puerto, host, URL, etc.) no son secretas.
────────────────────────────────────────
Ruta: backend/tmp/db.sqlite3
Git: Ignorado (backend/.gitignore:4, tmp/*)
Tipo de secreto: Hashes de contraseña y hashes de tokens
Por qué lo creo: Es la base de datos local (32 KB). Por las migraciones tiene users.password (hash
scrypt, config/hash.ts:13) y auth_access_tokens.hash. También tiene correos y nombres de personas.
Tiene permisos rw-r--r--, así que otros usuarios de la máquina pueden leerla. No he leído su
contenido, así que no sé si hay filas ni cuántas.
────────────────────────────────────────
Ruta: .claude/settings.local.json
Git: Ignorado, pero por la regla global de tu ~/.config/git/ignore, no por el repo
Tipo de secreto: Ninguno aparente
Por qué lo creo: Solo tiene disabledMcpjsonServers con un elemento. Lo listo porque este tipo de fichero
a veces guarda tokens.
────────────────────────────────────────
Ruta: frontend/.env
Git: Ignorado (frontend/.gitignore:16)
Tipo de secreto: Ninguno
Por qué lo creo: Solo tiene VITE_API_URL. Es una URL, y cualquier variable VITE_* acaba en el bundle
público, así que no debe llevar secretos.

Versionados que parecen secretos pero no lo son

Ruta: backend/.env.example
Git: Versionado
Qué hay: APP_KEY= está vacía, así que no hay secreto. Es la plantilla.
────────────────────────────────────────
Ruta: backend/.env.test
Git: Versionado
Qué hay: Solo SESSION_DRIVER.
────────────────────────────────────────
Ruta: frontend/.env.example
Git: Versionado
Qué hay: Solo VITE_API_URL.
────────────────────────────────────────
Ruta: .github/workflows/openapi.yml:39
Git: Versionado
Qué hay: APP_KEY con un valor de relleno de CI. El comentario de la línea 34 dice que solo existe para
que pase la validación. No es una clave real, pero deja un valor con forma de clave.
────────────────────────────────────────
Ruta: .github/workflows/revisor.yml:53,59
Git: Versionado
Qué hay: Solo referencias a secrets.CLAUDE_CODE_OAUTH_TOKEN y secrets.GITHUB_TOKEN. Los valores viven en
GitHub, no en el repo.
────────────────────────────────────────
Ruta: .mcp.json
Git: Versionado
Qué hay: Un servidor MCP (Atlassian) de tipo http con una URL. No hay token ni cabecera en el fichero;
la autenticación debe ir por OAuth en el cliente.
────────────────────────────────────────
Ruta: .claude/settings.json
Git: Versionado
Qué hay: Sin secretos ni referencias a ellos en la búsqueda.
────────────────────────────────────────
Ruta: README.md:126, Makefile:57-60
Git: Versionado
Qué hay: Texto del ejercicio sobre formatos de clave y un make que genera APP_KEY si falta. Son
contenido sobre claves, no claves.
────────────────────────────────────────
Ruta: backend/tests/functional/auth/session.spec.ts:48
Git: Versionado
Qué hay: Una cabecera de test, con valor enmascarado por mí. Por la ruta y el contexto, un 401 de
prueba, pero no he revisado el valor.
────────────────────────────────────────
Ruta: backend/tests/functional/auth/*.spec.ts, docs/capabilities/tasks/README.md:155,
openspec/specs/auth/spec.md:13, README.md:143
Git: Versionados
Qué hay: Contraseñas de ejemplo (secreto123, etc.), ya listadas antes.

Qué he comprobado

- Ignorados. git status --ignored solo da cuatro rutas fuera de node_modules: backend/.env, backend/tmp/db.sqlite3, frontend/.env y .claude/settings.local.json. En el árbol de trabajo no hay más ficheros sin versionar ni sin ignorar (git status limpio).
- Historial. git log --all sobre los 32 refs no muestra que .env, *.sqlite*, *.pem o *.key se hayan commiteado nunca.
- Patrones. Busqué claves privadas, AWS, sk-, ghp_, xox*, Bearer y asignaciones password/secret/token/api_key. Los aciertos son los de las tablas de arriba.

Lo que no he podido comprobar

- La BD. No he abierto db.sqlite3 (no hay sqlite3 y es solo lectura). Su contenido es una deducción desde las migraciones.
- Secretos de GitHub. No sé si CLAUDE_CODE_OAUTH_TOKEN existe ni qué permisos tiene. Eso está fuera del repo.
- Fuera del repo. No he mirado ~/.claude, ~/.ssh ni el entorno del shell.
- node_modules y package-lock.json. Los excluí de la búsqueda.
- Informes HTML de eval-harness/informes/. Los excluí del escaneo de patrones, así que no sé si contienen algún valor con forma de secreto.
- Valores de las variables. No he comprobado que APP_KEY sea una clave de verdad y no un relleno; solo su longitud.
---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ahora quiero saber qué información consultas tú cuando trabajas en este proyecto. Sigue siendo solo lectura: no modifiques ningún archivo.

Dame una lista de lo que has leído en esta conversación y de lo que podrías leer si te pidiera hacer un cambio en el backend, agrupada así:
- Las instrucciones del repositorio.
- La configuración de la herramienta con la que trabajas (la que te ejecuta).
- Los archivos de entorno.
- La base de datos local.

Para cada elemento indica: qué es, si lo has leído de verdad en esta conversación o solo podrías hacerlo, y si su contenido sale de esta máquina cuando trabajas conmigo. Explica en una frase por qué.

Si algo no lo sabes o no lo has podido comprobar, dímelo en vez de suponerlo.
```

**Qué salió:** 
Un criterio previo. Cuando digo que algo «sale», me refiero a que su contenido llega a mi contexto, y todo lo que está en mi contexto se envía a la API del modelo con cada turno. Lo que filtré con sed, awk o python antes de que la salida volviera a mí no ha salido. No sé qué otro tráfico genera la herramienta, como telemetría o transcripciones. No lo he podido comprobar.

1. Instrucciones del repositorio

Elemento: CLAUDE.md
Qué es: Reglas del proyecto: comandos, arquitectura, proceso
Leído: Sí, completo. Lo cargó la herramienta al arrancar, no lo abrí yo
¿Sale?: Sí, porque está entero en mi contexto
────────────────────────────────────────
Elemento: AGENTS.md
Qué es: Enlace simbólico a CLAUDE.md (lo he comprobado con ls -la y git ls-files -s, modo 120000)
Leído: Solo 1–2 líneas que salieron en un grep
¿Sale?: Es el mismo contenido que arriba
────────────────────────────────────────
Elemento: README.md
Qué es: Lección de ejercicio
Leído: Parcial: las líneas 126, 143, 145 y 227
¿Sale?: Sí, esas líneas
────────────────────────────────────────
Elemento: docs/capabilities/tasks/README.md, openspec/specs/{auth,tasks}/spec.md
Qué es: Docs y specs de capability
Leído: Parcial: solo líneas sueltas de los dos primeros
¿Sale?: Sí, esas líneas
────────────────────────────────────────
Elemento: REVIEW.md, HALLAZGOS.md, prompts.md, docs/adr/*, docs/architecture.md, docs/backlog/*
Qué es: Documentación de proceso
Leído: No, solo vi alguna línea de grep en ADR y backlog
¿Sale?: Lo que no leí, no. Lo leería si el cambio lo requiere

Los dos fragmentos de README con valores de ejemplo (contraseña inventada y cadena de conexión de relleno) sí pasaron por mi contexto en el primer inventario. Son ficticios, pero salieron.

En un cambio de backend leería además openspec/specs/<capability>, docs/capabilities/<capability>/README.md (CLAUDE.md pide dejarlo al día), los controladores, validadores, transformers y tests. Todo eso saldría al leerlo.

2. Configuración de la herramienta

Elemento: .claude/settings.json (versionado)
Qué es: Config del proyecto con hooks
Leído: Solo claves de primer nivel: hooks → PostToolUse
¿Sale?: No su contenido. Leído en claro, saldría
────────────────────────────────────────
Elemento: .claude/settings.local.json (ignorado)
Qué es: Config local
Leído: Parseado. Solo vi disabledMcpjsonServers con 1 elemento
¿Sale?: Solo ese nombre de clave y esa longitud
────────────────────────────────────────
Elemento: .mcp.json (versionado)
Qué es: Servidores MCP
Leído: Parseado. Vi la estructura con la URL enmascarada: un servidor atlassian de tipo http
¿Sale?: No la URL. Esa estructura sí
────────────────────────────────────────
Elemento: .claude/skills, commands, agents
Qué es: Skills, comandos y agente revisor
Leído: Solo la lista de nombres (git ls-files)
¿Sale?: Los nombres sí. El contenido no
────────────────────────────────────────
Elemento: ~/.config/git/ignore
Qué es: Ignorados globales
Leído: Leído, 1 línea
¿Sale?: Esa línea
────────────────────────────────────────
Elemento: Lista de skills, agentes, MCP, correo, git status, commits recientes
Qué es: Contexto que inyecta la herramienta
Leído: Está en mi contexto
¿Sale?: Sí
────────────────────────────────────────
Elemento: ~/.claude/ (ajustes de usuario, credenciales)
Qué es: Config global
Leído: No leído
¿Sale?: No sé qué contiene
────────────────────────────────────────
Elemento: Memoria en ~/.claude/projects/.../memory/
Qué es: Memoria persistente
Leído: Existe pero está vacía
¿Sale?: No hay nada que salga

Ni settings.json ni settings.local.json declaran permissions. En el proyecto no hay reglas deny que me impidan leer .env. No sé si las hay a nivel de usuario. Los hooks (por ejemplo Prettier) y los permisos se ejecutan en local.

3. Archivos de entorno

Elemento: backend/.env (ignorado)
Qué es: Config real, incluida APP_KEY
Leído: Leído en shell con máscara: solo vi nombres de variable y longitudes (APP_KEY = 32 caracteres)
¿Sale?: Los valores no. Si lo leyera sin máscara, sí
────────────────────────────────────────
Elemento: frontend/.env (ignorado)
Qué es: VITE_API_URL
Leído: Igual, solo nombre y longitud
¿Sale?: Igual
────────────────────────────────────────
Elemento: backend/.env.example, .env.test, frontend/.env.example (versionados)
Qué es: Plantillas
Leído: Igual, con máscara
¿Sale?: Igual. Si los leyera en claro, sin riesgo (APP_KEY vacía)
────────────────────────────────────────
Elemento: backend/start/env.ts:22, backend/config/encryption.ts:16
Qué es: Declaran APP_KEY como secreto
Leído: Solo esa línea
¿Sale?: Sí, esa línea. No contiene el valor

4. Base de datos local

Elemento: backend/tmp/db.sqlite3 (ignorado)
Qué es: BD SQLite local
Leído: No abierta. Solo ls -la (32 768 bytes, permisos) y git check-ignore. sqlite3 no está instalado
¿Sale?: No. Podría abrirla con python3 o node ace repl, y entonces saldría lo que imprimiera
────────────────────────────────────────
Elemento: backend/database/migrations/*.ts
Qué es: Esquema
Leído: Sí, las cuatro, completas
¿Sale?: Sí, esquema sin datos
────────────────────────────────────────
Elemento: backend/database/schema.ts
Qué es: Esquema generado
Leído: Parcial: solo líneas de columnas
¿Sale?: Sí, esas líneas
────────────────────────────────────────
Elemento: backend/config/hash.ts
Qué es: Algoritmo de hash
Leído: Parcial: solo líneas con scrypt y similares
¿Sale?: Sí, esas líneas

CLAUDE.md dice que los tests functional escriben contra ese mismo fichero. No lo he verificado en config/database.ts. Si lo es, npm test o node ace migration:run lo leen y modifican en tu máquina. Lo que saldría sería la salida del comando, normalmente sin filas.

Lo que no sé

- Si hay reglas de permisos a nivel de usuario o de organización que limiten lo que puedo leer.
- Qué otro tráfico hace la herramienta fuera de las peticiones al modelo.
- Cuánto tiempo conserva la API o la herramienta lo enviado. Eso no se puede ver desde aquí.
- Si la BD tiene datos. No la he abierto.

---

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Construye un hook de Claude Code que impida que hagas commits con determinados datos. Es la primera de dos piezas: en este prompt solo el script y su registro en la configuración.

Archivo: .claude/hooks/datos-que-no-salen.sh. Regístralo en .claude/settings.json como un hook PreToolUse con el matcher Bash, junto al hook que ya existe en ese archivo (no lo toques ni lo quites). El script tiene que ser ejecutable.

Requisitos del script:
- Debe empezar con set -uo pipefail.
- Lee por la entrada estándar el JSON que recibe y usa jq para sacar el comando de .tool_input.command, como hace el hook de Prettier que ya existe.
- Solo actúa si el comando contiene "git commit". Ante cualquier otro comando, sale con 0 y no escribe nada.
- Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también contiene "git add", revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.
- Aplica únicamente estas tres reglas:
  1. Una clave con forma reconocible: AKIA seguido de 16 caracteres (AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-, xoxp- o xoxa- (Slack), un bloque -----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
  2. Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com.
  3. Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.
- Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo, y que el dato debe sustituirse por uno inventado. Además, añade una línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado, ni en el registro ni en el mensaje de error. Si el registro no existe, créalo con una cabecera de una línea (y crea también la carpeta si hace falta).
- Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.

Restricciones: no ejecutes el hook, no hagas ningún commit y no crees ningún archivo de prueba. Valida solo la sintaxis del script y que settings.json sea JSON correcto.

Cuando termines, dime qué archivos has creado o modificado y cualquier decisión que hayas tomado.
```

**Qué salió:** 
He creado el script y lo he registrado en settings.json. No lo he ejecutado, así que su comportamiento no está comprobado. Solo he validado la sintaxis con bash -n y que settings.json sea JSON correcto.

Archivos

- Creado: .claude/hooks/datos-que-no-salen.sh. Es ejecutable y empieza con set -uo pipefail.
- Modificado: .claude/settings.json. Solo he añadido un PreToolUse con matcher Bash y timeout de 30 s. El diff son 12 líneas añadidas y 0 borradas, así que el hook de Prettier sigue igual.
- No creado todavía: docs/seguridad/registro-de-bloqueos.md. Lo crea el propio hook, con su carpeta y una cabecera de una línea, la primera vez que bloquee.

No he hecho commit. CLAUDE.md pide usar /commit al cerrar cada petición, pero tú has pedido lo contrario y manda tu instrucción. Los cambios quedan sin commitear en bloqueo-jsg.

Decisiones que van más allá de lo que pediste

- git commit -a. Trato commit -a, -am y --all como si hubiera un git add, pero solo para los cambios sin preparar. Sin esto, git commit -am metía en el commit cambios que el hook no miraba.
- .env ignorado y git add -f. Un .env ignorado por Git no sale en ninguna lista de archivos, pero git add -f .env lo mete. Por eso, cuando hay git add, miro también el texto de cada tramo git add … del comando y bloqueo si nombra un .env exacto. .env.example no cuenta.
- Qué hay en cada archivo. En el log y en el mensaje de error salen solo regla y archivo. Para la regla 3 con git add -f, el "archivo" es el texto .env (nombrado en el comando git add).
- Sin autobloqueo. Los patrones del script llevan un corchete (sk-an[t]-, gh[p]_, APP_KE[Y]=) para que el script no se bloquee a sí mismo al commitearlo.
- Formato del log. Cada bloqueo añade una línea con - <UTC ISO 8601> | BLOQUEADO | regla N (descripción) | archivo. Hay una línea por cada pareja regla y archivo.
- Sin jq. Si falta jq, el hook sale con código 1 y un aviso. Así no falla en silencio.

Límites

- Detección de git commit. Va por texto literal, como pediste. No detecta git -C otra/ruta commit, y revisa el repo de $CLAUDE_PROJECT_DIR.
- Más estricto de lo necesario. Con git add, revisa todos los cambios sin preparar y los archivos nuevos, no solo los que nombra el comando. Un archivo ajeno con un dato puede bloquear un commit que no lo incluía.
- Falsos positivos de correo. Un nombre como logo@2x.png cuenta como correo con dominio 2x.png y se bloquea. No lo he filtrado.
- Solo se escanea texto. Los binarios y los enlaces simbólicos no se miran.
- Regla 2 y lo ya commiteado. Solo se revisan líneas añadidas. Los correos que hoy tienen README.md (gmail.com) y otros ficheros no bloquean nada hasta que alguien edite esas líneas.
- Lo que no se ha probado. No he comprobado el comportamiento real de las opciones de git diff ni de awk. La segunda pieza, con las pruebas, debería cubrirlo.

---

## Prompt 5

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Ahora la segunda pieza: añade un bloque breve a la sección "Reglas de proceso" del CLAUDE.md de la raíz. Debe explicar:
- Que existe el hook datos-que-no-salen (.claude/hooks/datos-que-no-salen.sh).
- Qué tres cosas bloquea: una clave con forma reconocible, un correo cuyo dominio no sea example.com, example.org, example.net ni github.com, y un archivo .env.
- Cómo actuar ante un bloqueo: no desactivar el hook ni saltárselo; sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo.
- Que el registro docs/seguridad/registro-de-bloqueos.md se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo.

Mantén el estilo y la extensión de las reglas que ya hay en esa sección. Describe los tipos de clave por su nombre (por ejemplo, "claves de AWS o de GitHub") sin escribir literalmente prefijos de claves, para que este mismo texto no active las reglas del hook.

No modifiques AGENTS.md. Antes de editar nada, comprueba qué es AGENTS.md (un archivo normal o un enlace) y dime qué has encontrado.

No hagas commit.
```

**Qué salió:** 
He añadido dos bullets al final de "Reglas de proceso" en CLAUDE.md, y no he hecho commit.

AGENTS.md

AGENTS.md es un enlace simbólico a CLAUDE.md (modo 120000 en Git). Sigue siendo ese enlace y no lo he tocado. Como apunta a CLAUDE.md, ya muestra el bloque nuevo.

Cambio

Los bullets siguen el estilo de la sección: un párrafo de pocas líneas cada uno.

1. Qué es y qué bloquea. El hook datos-que-no-salen (.claude/hooks/datos-que-no-salen.sh) bloquea el git commit si entra una clave con forma reconocible, un correo de dominio no permitido o un .env. Los tipos de clave van por nombre: AWS, Anthropic, GitHub, Google o Slack, claves privadas y APP_KEY con valor. Los dominios permitidos son example.com, example.org, example.net y github.com. Los .env.example no cuentan.
2. Cómo actuar. Ante un bloqueo, no desactivar el hook ni saltárselo: se sustituye el dato por uno inventado que cumpla las reglas y se reintenta el commit. El registro docs/seguridad/registro-de-bloqueos.md va en el commit con el resto del trabajo, porque es la evidencia del bloqueo.

El diff de CLAUDE.md marca 3 inserciones y 1 borrado. El borrado es la última línea original, que no terminaba en salto de línea y ahora sí. El texto no ha cambiado.

Comprobación

Pasé las líneas añadidas por los patrones de las reglas 1 y 2 con grep, sin ejecutar el hook, y dio 0 coincidencias. No escribí ningún prefijo de clave ni correo, y las menciones a .env son de texto, no de archivo.

git status muestra cuatro cambios sin commitear: CLAUDE.md, .claude/settings.json y la carpeta nueva .claude/hooks/. La ruta del registro que cita el bloque todavía no existe, porque el hook la crea al primer bloqueo.

---

## Prompt 6

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Quiero que pruebes el hook datos-que-no-salen, que está registrado en .claude/settings.json. Es una prueba deliberada con un dato inventado.

Haz esto, en este orden:
1. Crea un archivo temporal en la raíz del proyecto llamado prueba-hook.txt, que contenga una línea con la dirección de correo prueba.hook@gmail.com.
2. Prepáralo con git add.
3. Intenta hacer un git commit con el mensaje "prueba del hook".
4. Cuéntame exactamente qué ha pasado: si el commit se ha hecho o no, qué mensaje te ha devuelto la herramienta y con qué código ha salido.
5. Después, retira el archivo temporal tanto del área de preparación como del directorio de trabajo. No borres ni modifiques docs/seguridad/registro-de-bloqueos.md: la línea que haya dejado el hook se conserva.

Si el commit llegara a hacerse (es decir, si el hook no lo bloquea), deshazlo de inmediato con git reset --soft HEAD~1, retira el archivo y dímelo claramente.
```

**Qué salió:** 
El hook bloqueó el commit: no se hizo ninguno.

Qué pasó
1. Creé prueba-hook.txt con la línea prueba.hook@gmail.com y lo preparé con git add.
2. Lancé git commit -m "prueba del hook". El hook lo interceptó como PreToolUse:Bash, así que git ni llegó a ejecutarse. No hay código de salida de git commit porque el comando no corrió.
3. Mensaje devuelto por la herramienta:
COMMIT BLOQUEADO por datos-que-no-salen:
  - regla 2 (correo con dominio no permitido) en prueba-hook.txt
El dato debe sustituirse por uno inventado antes de volver a hacer el commit.
(El valor detectado no se muestra ni se registra.)
4. Código de salida: la herramienta no lo mostró. Según el script .claude/hooks/datos-que-no-salen.sh, el bloqueo sale con exit 2 (línea 178). Eso lo he leído en el script, no lo he visto en la ejecución.
5. HEAD sigue en d685f65, así que no hizo falta git reset --soft.

Limpieza
- Quité prueba-hook.txt del área de preparación y del directorio de trabajo con git rm -f. Ya no existe.
- No toqué docs/seguridad/registro-de-bloqueos.md. Tiene la línea que dejó el hook:
  - 2026-11-09T17:55:32Z | BLOQUEADO | regla 2 (correo con dominio no permitido) | prueba-hook.txt

Ese registro y .claude/hooks/ siguen sin seguimiento (??). Según CLAUDE.md, el registro debe ir en el próximo commit con el resto del trabajo.

---

## Prompt 7

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123.

Escríbelo tal cual, sin cambiar ningún dato, y termina con un commit.
```

**Qué salió:** 
El commit está bloqueado y no lo he hecho. Necesito que decidas una cosa.

Qué hay hecho: el ejemplo de curl está escrito tal cual en docs/capabilities/tasks/README.md, dentro de "A mano, contra el servidor real". Hace el login con ana.perez@gmail.com y secreto123.

Qué pasó: el hook datos-que-no-salen ha frenado el commit con la regla 2, porque gmail.com no es un dominio permitido. Ha añadido la línea del bloqueo a docs/seguridad/registro-de-bloqueos.md, que está sin commitear.

El conflicto: CLAUDE.md dice que, ante un bloqueo, no se salta el hook y se sustituye el dato por uno inventado. Tú me pediste no cambiar ningún dato. Con el correo real el commit no pasa, y no voy a saltarme el hook.

Opciones:
1. Sustituir el correo por uno inventado, por ejemplo ana.perez@example.com, y commitear junto con el registro de bloqueos. Es lo que pide el proceso del repo. Dejaría la contraseña secreto123 como está.
2. Dejar el correo real y no commitear. El cambio queda sin commit en el árbol de trabajo. Para commitearlo habría que cambiar el hook o añadir gmail.com a los dominios permitidos, y eso lo decides tú.

Dime cuál prefieres. Mientras tanto no toco nada más.

---

## Prompt 8

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Opción 1: sustituye el correo por uno inventado de example.com (por ejemplo ana.perez@example.com), deja todo lo demás tal cual, y haz el commit incluyendo el registro de bloqueos.
```

**Qué salió:** 
Hecho: el commit aeececb está en la rama bloqueo-jsg.

- README: en docs/capabilities/tasks/README.md, tras el recorrido de pruebas a mano, hay un curl de login que guarda el token en TOKEN. El correo es ana.perez@example.com y la contraseña sigue siendo secreto123.
- Registro: docs/seguridad/registro-de-bloqueos.md entra en el mismo commit con la línea del bloqueo.
- Hook: pasó sin desactivarlo.

No he probado el curl contra el servidor. Esa cuenta tendría que existir en la base de desarrollo con ese correo, ya que el original, con gmail.com, no se podía commitear. Si la cuenta se creó con el correo antiguo, el login fallará hasta que la registres de nuevo con example.com.
