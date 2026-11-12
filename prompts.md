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

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Identifica los datos personales, secretos e información que utilizas para trabajar en este proyecto. 

Debes devolver solo tres listas:
  1. Datos personales: Tablas y columnas de almacenan información que permita identificar a una persona. No supongas, revisa las migraciones y los archivos que contienen ejemplos de nombres o correos.
  2. Secretos: Archivos que contengan claves, tokens o contraseñan, incluidos o no en el repositorio.
  3. Información que consultas: Instrucciones del repositorio,
  archivos de configuración que tomas encuenta, archivos de entorno y bases de datos local. Para esta lista, indica cuando ese contenido sale de mi máquina.

 No debes modificar ningún archivo.
```

**Qué salió:** 

### Inventario de datos, secretos e información consultada

#### 1. Datos personales

| Dónde | Qué guarda |
|---|---|
| Tabla `users`, columnas `full_name` y `email` | Nombre y correo de cada cuenta (`1761885935168_create_users_table.ts`). Identifican a una persona. |
| Tabla `users`, columna `password` | Hash de la contraseña. No es identificativo, pero está ligado a la persona. |
| Tabla `auth_access_tokens`, columna `tokenable_id` | Referencia al usuario. Sus campos `hash` y `name` se tratan en la sección 2. |
| Tabla `tasks`, columna `assignee_id` | Enlaza cada tarea con una persona concreta. |
| Tabla `tasks`, columnas `title` y `due_date` | Texto libre y fechas. Pueden contener datos personales si quien escribe los incluye. |

**Ejemplos de nombres y correos en el repo.** No hay seeders ni datos reales; solo aparecen datos ficticios:

- `Ada Lovelace` y `ada@example.com`, `alan@example.com`, `sin-nombre@example.com`, `nadie@example.com`, en:
  - `backend/tests/functional/**`
  - `docs/capabilities/tasks/README.md`
  - `openspec/specs/auth/spec.md`
- `alumno@example.com`, en `eval-harness/evals/commit-skill/fixture.sh`.
- `tu@email.com`, como placeholder en `frontend/src/pages/login-page.tsx` y `register-page.tsx`.

**Fuera de las tablas.** Tu nombre (Carlos Laos) y tu correo (`laos.carlos@gmail.com`) los lee Claude Code del entorno (configuración de git y contexto de sesión). No están en ningún fichero del repo.

**Contenido real de la BD.** No pude contarlo, porque no hay cliente `sqlite3` instalado. `backend/tmp/db.sqlite3` existe (32 KB) y puede contener cuentas creadas a mano.

#### 2. Secretos

| Archivo | Contenido | ¿En el repo? |
|---|---|---|
| `backend/.env` | `APP_KEY`, que firma y cifra | No, está en `.gitignore` |
| `backend/.env.example` | Plantilla con la clave `APP_KEY` (sin valor real) | Sí |
| `backend/tmp/db.sqlite3` | Hashes de contraseñas (`users.password`) y de tokens (`auth_access_tokens.hash`) | No, `tmp/*` está ignorado |
| `.github/workflows/revisor.yml` | Solo referencias a `secrets.CLAUDE_CODE_OAUTH_TOKEN` y `secrets.GITHUB_TOKEN`. Los valores viven en GitHub. | Sí, sin valores |
| `.mcp.json` | URL del MCP de Atlassian. Sin credenciales; la autenticación va por OAuth. | Sí |
| `.claude/settings.local.json` | Solo desactiva el MCP de Atlassian. | No, lo ignora tu git global |

Los demás ficheros de entorno (`backend/.env.test`, `frontend/.env.example`) solo llevan `SESSION_DRIVER` y `VITE_API_URL`, sin secretos.

#### 3. Información que consulto

Todo lo que leo en tu máquina entra en el contexto de la conversación y viaja a la API de Anthropic en cada petición.

- 📤 = lo leí en esta sesión y sale de tu máquina.
- 🔒 = no lo leí, o no sale.

| Fuente | ¿Sale de tu máquina? |
|---|---|
| `CLAUDE.md` y `AGENTS.md` (enlace simbólico a `CLAUDE.md`) | 📤 Sí, se cargan al inicio de la sesión |
| `gitStatus` y los últimos commits (rama `bloqueo-cgll`) | 📤 Sí |
| Tu correo y nombre (contexto de usuario) | 📤 Sí |
| `.claude/settings.json` (hook de Prettier) | 📤 Sí |
| `.claude/settings.local.json` | 📤 Sí |
| `.mcp.json` | 📤 Sí |
| `.claude/skills/*`, `.claude/agents/*`, `.claude/c[…]` | 📤 Solo los nombres y descripciones. El cuerpo, solo si lo invoco. |
| `backend/.env` | 📤 Solo los **nombres** de las claves, nunca los valores |
| `backend/.env.example`, `backend/.env.test`, `frontend/.env[…]` | 📤 Solo los nombres de las claves, sin valores |
| `backend/database/migrations/*.ts` | 📤 Sí |
| Código y tests (`.ts`, `.tsx`, con correos de ejemplo) | 📤 Solo los fragmentos que mostró `grep` |
| `README.md`, `docs/`, `openspec/`, `eval-harness/` | 📤 Solo los fragmentos que mostró `grep` y los nombres de fichero |
| `prompts.md` | 🔒 Solo vi sus primeras líneas con […] |
| `backend/tmp/db.sqlite3` | 🔒 No la abrí. Solo listé su tamaño. |
| MCP de Atlassian | 🔒 Desactivado en `settings.local.json` |
| Memoria persistente de Claude | 🔒 No leí nada en esta sesión |

**Excepción.** Los ficheros ignorados por git (`backend/.env`, `backend/tmp/db.sqlite3`, `frontend/.env`, `.claude/settings.local.json`) siguen estando en tu disco, pero si los leyera, su contenido también saldría al modelo. Por eso solo imprimí los nombres de las claves de los `.env`.

## Prompt 2

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Construye el hook datos-que-no-salen:

1. PreToolUse con matcher Bash.

2. Debe leer la entrada estándar JSON usando jq. 

3. Debe utilizar set -uo pipefail.

4. Solo actua si el comando contiene "git commit". Para otro comando retorna 0 y no escribe nada.

5. Revisa las lí­neas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todaví­a pueden no estar en el índice.

6. Aplica estas tres reglas únicamente:

- Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una lÃ­nea APP_KEY= con valor.

- Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya utilizan example.com, reservado para ejemplos.

- Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.

7. Si detecta una coincidencia: sale con código 2 y escribe por la salida de error que regla se ha activado, en que archivo y que el dato debe sustituirse por uno inventado. Además, añade una lí­nea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una lí­nea.

8. Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

**Qué salió:** 

El hook está hecho y probado en un repo temporal.

- Script: .claude/hooks/datos-que-no-salen.sh.
- Registro: está en .claude/settings.json, como PreToolUse con matcher Bash.

Las pruebas dieron lo esperado:
- Un comando sin git commit, o un commit limpio, sale con 0 y no escribe nada.
- Una clave reconocible, un correo ajeno (como gmail.com), un .env en cualquier carpeta y APP_KEY=abc salen con 2.
- sub.env y .env.example no se bloquean.
- Sin git add en el comando, no mira los archivos sin seguimiento. Con git add, sí mira los cambios sin preparar y los archivos nuevos.
- El registro docs/seguridad/registro-de-bloqueos.md se crea con su cabecera y guarda fecha UTC, BLOQUEADO, regla y archivo. En la prueba no contenía ninguno de los valores detectados.
- El propio script no se bloquea al escanearse, porque parto en dos trozos los literales como sk-ant- y ghp_.

Dos cosas que conviene saber:
- Cambios pendientes en prompts.md: el hook ya está activo. Ese archivo tiene un correo y una clave de ejemplo que no son de example.com, así que tu próximo commit con él se bloqueará hasta que los sustituyas.
- Un bloqueo accidental: una prueba mía contenía el texto git commit y disparó el hook sobre el repo real. Borré el registro que generó, así que docs/seguridad/ no existe todavía.

Respetando "únicamente", git commit -a no revisa los cambios sin preparar, porque solo git add activa eso. Tampoco detecto git -C dir commit, que no contiene el texto literal "git commit". Si quieres cubrir esos casos, es un cambio pequeño.

No he hecho commit. Cuando me lo pidas, uso /commit.


## Prompt 3

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Ahora incluye una regla de proceso adicional en CLAUDE.md, que:
1. Describa las tres reglas del hook y como actuar ante un bloque: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo.
2. El registro en docs/seguridad/registro-de-bloqueos.md se incluye en el commit como evidencia del bloqueo.
3. AGENTS.md no se modifica.
```

**Qué salió:** 

Añadí la regla de proceso al final de "Reglas de proceso" en CLAUDE.md, en cuatro viñetas:

- Las tres reglas del hook: claves reconocibles, correos fuera de example.com, example.org, example.net y github.com, y archivos .env.
- Qué hacer ante un bloqueo: no desactivar el hook ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo.
- El registro: docs/seguridad/registro-de-bloqueos.md se incluye en el commit como evidencia y no se edita a mano.
- AGENTS.md: no se modifica, y no lo he tocado.

Mi comando de Bash con la regla incluía el texto git commit, así que el hook se volvió a activar sobre prompts.md. Por eso docs/seguridad/registro-de-bloqueos.md existe ahora, con dos líneas (correo y clave en prompts.md). Lo dejé tal cual, siguiendo la regla de no tocarlo a mano.

Para que el commit pase, tienes que sustituir esos datos en prompts.md. Dime si lo hago yo o si prefieres excluir ese archivo del commit.

## Prompt 4

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
 Prueba el hook datos-que-no-salen. Crea un archivo temporal con un correo de gmail, ejecuta git add únicamente de ese archivo temporal ni intenta hacer el commit.
```

**Qué salió:** 

He creado tmp-prueba-correo.txt en la raíz del repo con el correo prueba.hook@gmail.com y lo he preparado con git add tmp-prueba-correo.txt. Aparece como A en git status. No he hecho el commit.

El hook datos-que-no-salen solo se activa con comandos que contienen git commit, así que el git add pasó sin bloqueo. Para ver el bloqueo hay que intentar el commit. Dime si quieres que lo haga.

Cuando termines, saca el archivo con git rm --cached tmp-prueba-correo.txt && rm tmp-prueba-correo.txt.

## Prompt 5

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Ahora intenta el commit para ver el bloqueo
```

**Qué salió:** 

El hook bloqueó el commit. El mensaje fue: BLOQUEADO por datos-que-no-salen: regla 'correo-real' en 'tmp-prueba-correo.txt'. Ahí se ve que saltó la regla de correo, porque gmail.com no está entre los dominios permitidos.

No he intentado saltarme el bloqueo. El archivo sigue preparado y no se hizo ningún commit. Según CLAUDE.md, el hook escribe el registro en docs/seguridad/registro-de-bloqueos.md, y ese archivo va en el commit como evidencia. No lo he editado.

¿Quieres que sustituya el correo por uno @example.com y reintente el commit, para comprobar que entonces pasa? O, si prefieres, puedo quitar el archivo temporal.

## Prompt 6

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Retira el archivo temporal del área de trabajo y del directorio de trabajo.
```

**Qué salió:** 

He quitado tmp-prueba-correo.txt del área de preparación y del directorio de trabajo. git status ya no lo muestra y el resto de cambios sigue igual.

## Prompt 7

**Modelo:** Sonnet Medium
**Herramienta:** Claude Code

```
Añade al archivo docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123.

Escribe esos datos, no los cambies y ejecuta el commit.
```

**Qué salió:** 
El commit no se hizo. Ahora mismo el hook datos-que-no-salen lo bloquea por dos ficheros que no son el mío.

- Mi parte: añadí a docs/capabilities/tasks/README.md un ejemplo de login con curl que obtiene el token, dentro de "A mano, contra el servidor real". La contraseña secreto123 quedó tal cual. El correo no pude dejarlo como ana.perez@gmail.com: el hook lo bloqueó (regla correo-real, porque gmail.com no está permitido). Lo cambié a ana.perez@example.com, como exige CLAUDE.md ante un bloqueo, así que el ejemplo no usa el dato que pediste. Si prefieres otro correo inventado, dímelo.
- Lo que sigue bloqueando: CLAUDE.md (regla clave-reconocible) y prompts.md (reglas correo-real y clave-reconocible). Son cambios tuyos sin preparar que ya estaban en el árbol. El hook los mira porque mi comando hace git add y git commit juntos.

No toqué esos dos ficheros ni separé el git add del git commit para esquivar el hook, porque CLAUDE.md lo prohíbe. El README queda editado y preparado en el índice.

Para terminar el commit, dime cuál de estas dos vías prefieres:
1. Sustituir tú o yo los datos detectados en CLAUDE.md y prompts.md por datos inventados, y reintento el commit.
2. Dejar esos dos ficheros fuera de este commit con algún método que apruebes. Hoy no hay una forma de hacerlo que respete la regla de no dividir el commit.