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

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
give me a summary of the last 5 commits
```

**Qué salió:** funcionó a la primera: resumen de los 5 commits (4 de documentación y 1 del harness), sacado de `git log` y de los diffs.

## Prompt 2

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
checkout to a branch auditoria-rl; you need to create it
commit nothing
```

**Qué salió:** funcionó a la primera: rama `auditoria-rl` creada desde `s5/start` (`a3bb962`, igual que `upstream/s5/start`) sin commitear nada; `prompts.md` sigue como cambio sin commitear.

## Prompt 3

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
Create a table, in an rules-audit.md file
a row for each rule within CLAUDE.md/Reglas de proceso; i'll provide the one line desc for each later down below
first column: what the rule asks for 
second column: how was it verified (command, file...)
third column: verdict (se cumple, no se cumple, no se puede comprobar con la info disponible)
fourth column: one line evidence; if not fulfilled indicate where, if not possible to verify indicate what info is missing in order to
fifth column: what would i do with the rule (dejarla, borrarla, make it an automatic verification)


rules desc:

1. No crear una rama a menos que esté en `main` o `sN/*` ni committear directamente en ninguna de estas; rama por unidad de trabajo, no por petición
2. Commit por petición y usando la skill "/commit"
3. Un cambio que toque rutas, controladores, validadores o transformers debe cerrarse con la correspondiente doc actualizada
4. Una unidad de trabajo se da por terminada al crear la PR y hacer una sola pasada del subagente `adversarial-review`
5. Luego de crear la PR devuelve la URL de la misma
```

**Qué salió:** tabla en `rules-audit.md` (raíz) contra los 15 últimos commits: la 3 se cumple, la 4 no, y la 1, la 2 y la 5 no se pueden comprobar. Se apoyó en `git`, `gh` y en regenerar `.adonisjs/` en una copia aparte. No se tocó ningún otro archivo, aunque el prompt no lo prohibía. El README pide `docs/auditoria/rl.md`.

## Prompt 4

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
* move it to docs/auditoria/rl.md
* rename the agent to `adversarial-reviewer`
* keep the CLAUDE.md changes off the commit


let's go with the 3 lines part of the exercise:

1. De primeras sólo tenía una impresión en base a cómo hemos ido trabajando y cómo he visto trabajar el modelo. Las reglas 1 y 3 fueron en las que más me equivoqué, en ambas por igual. Creo que debido a la falta de trazabilidad en el repo al no ser esto un repositorio "real"
2. La primera regla. Debido a las características del repo en el que estamos trabajando creo que es difícil dejar evidencia sobre de dónde salen las ramas, cuándo y a dónde se mergean... el típico historial de Git normal
3. Eliminaría la regla 5. Creo que no aporta demasiado, más allá de un ahorro de tokens, y al ser simplemente un resumen de la PR, consideraría el ahorro incluso despreciable versus el costo de tener una regla generando ruido y aumentando contexto en CADA nueva sesión
```

**Qué salió:** archivo movido a `docs/auditoria/rl.md`, agente renombrado a `adversarial-reviewer` y las tres líneas añadidas tal cual bajo la tabla. Todavía sin commit, y `CLAUDE.md` queda fuera. Claude señaló que a la línea 2 le falta qué tendría que cambiar y a la 3, a qué grupo pertenece la regla.

## Prompt 5

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
line 2: aceptamos que debido a las características del repo no deja una evidencia clara
line 3: add rules nobody follows and nobody misses 
line 1: for rule 1 i thought it would fulfill, for 3 i had no clue. Add that too
```

**Qué salió:** funcionó a la primera: se añadió a la línea 1 la apuesta de las reglas 1 y 3, a la 2 que se acepta que no deja evidencia clara y a la 3 el grupo («nadie la cumple y nadie la echa de menos»). Todavía sin commit.

## Prompt 6

**Modelo:** Opus 5.5 Max
**Herramienta:** Claude Code

```
add this last prompt to prompts.md
commit, push and open the PR against upstream; undo changes in CLAUDE.md
that's it for this exercise
```

**Qué salió:** se restauró `CLAUDE.md` y se hizo commit con `/commit` solo de `docs/auditoria/rl.md` y `prompts.md`. Push a `origin/auditoria-rl` y PR contra `s5/start` del repo del curso.
