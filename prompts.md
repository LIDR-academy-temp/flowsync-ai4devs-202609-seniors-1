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

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
* Identify personal data and project secrets; explain what info is consulted to work on it. Modify no file.
* Prepare 3 lists:
   * Personal data - tables and columns that store that could allow identify a person, verified in migrations and no assumptions, and files that contain names or e-mails examples.
   * Secrets - files that contain or may contain keys, tokens or passwords, included or not in the repo (check also what Git is ignoring).
   * Info the agent checks - what has and could read while doing a backend change: repo instructions, used tool config, env files and local ddbb. For each element, must indicate if its content leaves this machine when working with me
```

**Qué salió:** Inventario hecho sin tocar ficheros del proyecto (columnas leídas en migraciones y confirmadas en la BD local, vacía; .env y config enmascarados); fallo propio: al listar autores con git log mandé al modelo los correos reales de 4 personas.

## Prompt 2

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
Create the following hook within the project, in .claude/hooks/datos-que-no-salen.sh, registered in .claude/settings.json, as `PreToolUse`, matchter `Bash`, next to the already existing hook.
It must read the JSON from the standard input using `jq`. The command is in `.tool_input.command`, like in the Prettier hook. It must use `set -uo pipefail`.

* It will only act if the command contains `git commit`; any other commands it exits with code 0 and writes nothing.
* It checks the added lines from the prepared diff `git diff --cached`. It will review all the modified files, not just those added with `git add`.
* Apply only these 3 rules:
   * A key with recognizable form: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
   * An e-mail whose domain IS NOT `example.com`, `example.org`, `example.net` nor `github.com`.
   * A file named exactly `.env` in any folder within the files to be committed. `.env.example` files does not count.
   *  


If it finds any coincidence, it exits with code 2 with an exit error message stating which rules was activated, on which file and that the flagged data must be substituted by made up one. Plus, add a line to `docs/seguridad/registro-de-bloques.md` with date and time (UTC), ISO 8601 format, "BLOCKED" word, rule and file. Never add the detected value, that would duplicate it. If the record doesnt exist, create it with a one line header.

If no coincidence detected, exits with code 0 and writes nothing
```

**Qué salió:** Hook creado y registrado tal como se pidió (nombre registro-de-bloques.md y palabra BLOCKED literales, revisa siempre también lo no preparado); 14 casos y cada patrón probados en repos desechables, sin probarlo aún en vivo desde Claude Code ni commitear; señalé que difiere del README en nombre y alcance.

## Prompt 3

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
Yes, match README
```

**Qué salió:** Renombré el registro a registro-de-bloqueos.md y la palabra a BLOQUEADO como dice el README; los 14 casos vuelven a pasar. La rama bloque-rl y el alcance (revisar siempre lo no preparado) siguen como estaban.

## Prompt 4

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
Add a small section to the "reglas de proceso" section in repo's CLAUDE.md file. It must explain the hook exists, what three things it blocks and how to act when a blockage happens: not deactivate it nor go around it, substitute the real info for made up one that follows the rules and try again. It must also indicate that the record its included in the commit alongside the rest of the work, because it's the blockage evidence. AGENTS.md file must not be modified.
```

**Qué salió:** Añadí la subsección del hook en Reglas de proceso de CLAUDE.md; AGENTS.md resultó ser un enlace simbólico a CLAUDE.md (en el prompt 1 dije, mal, que era una copia), así que el enlace no cambia en git pero muestra el bloque nuevo. El hook pasa sobre los cambios actuales.

## Prompt 5

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
let's run a test: create a temp file with a `gmail.com` mail, try to execute `git add` and do a commit. 
Expected outcome is that hook must come out with code 2, prevent the commit and add the line to the record.

When done, discard the temp file completely but keep the change in the record, it would be the first evidence of the hook working.
Before doing this, add this commit to promp.md, then stash it, otherwise it may block the hook instead of the actual temp file. When the test is done, apply the stash and fill the prompt accordingly
```

**Qué salió:** Funcionó a la primera: con prompts.md en el stash, creé el fichero temporal con un correo de gmail.com, git add y el intento de commit; el hook lo bloqueó (regla 2, sin commit nuevo) y dejó una línea con BLOQUEADO sin el correo en docs/seguridad/registro-de-bloqueos.md. Borré el temporal, conservé el registro y saqué prompts.md del stash.

## Prompt 6

**Modelo:** Opus 5.5 Extra
**Herramienta:** Claude Code

```
Add a `docs/capabilities/tasks/README.md`, in the manual testing section against the real server, a cURL example that obtains the token with user credentials:

* Ana Pérez
* ana.perez@gmail.com
* Password: secreto123


Use it as it is, dont modify any of it, and finish with a commit.
```

**Qué salió:** Escribí el ejemplo de curl tal cual (login con el correo de gmail.com) y lo intenté commitear con /commit; el hook lo bloqueó por la regla 2 en el README y también en prompts.md, que guarda este prompt literal. No hay commit: no salté el hook ni cambié el dato sin permiso, y pregunté cómo seguir.
