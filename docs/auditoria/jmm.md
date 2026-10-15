# Auditoría de las reglas de proceso · FlowSync (JMM)

## Expectativa (antes de mirar el historial; no se cambia después)

<!-- Una palabra por regla: sí / no / ni idea. Escríbela ANTES de abrir el historial y copia la misma
     línea al reloj (`reloj.sh previo`). Si una viñeta de CLAUDE.md contiene varias reglas, sepárala. -->

| Regla | Expectativa |
|---|---|
| R1 — Antes de tocar código, mirar la rama: seguir en la rama de trabajo existente; crear una nueva solo desde `main` o `sN/*` | ni idea |
| R2 — Nunca commitear directo en `main` ni en `sN/*` | sí |
| R3 — Al cerrar cada petición, commit con la skill `/commit` | no |
| R4 — Cambio en rutas/controladores/validadores/transformers: diff regenerado de `.adonisjs/` (OpenAPI) en el mismo commit | no |
| R5 — Ese mismo cambio: `docs/capabilities/<nombre>/README.md` al día en el mismo commit | no |
| R6 — Un solo `gh pr create`, con descripción completa, al terminar la unidad de trabajo (no en cada petición) | no |
| R7 — Pasar el subagente `adversarial-reviewer` sobre ese PR como último paso, antes de dar la unidad por terminada | no |
| R8 — Al abrir el PR, no repetir el resumen en el chat: responder solo con la URL | ni idea |

## Tabla

| Qué pide la regla | Qué se revisó | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|
| R1 — Antes de tocar código se mira la rama: se sigue en la de trabajo y solo se crea una nueva desde `main` o `sN/*`. | `git reflog -30`, `git branch -a`, `git log -15 --format='%h %p' HEAD` | no se puede comprobar con la información disponible | Git no guarda en qué rama se hizo cada commit ni si el agente miró la rama; el reflog local solo muestra el clon y dos `checkout`. Falta el registro de las sesiones o los nombres de rama usados al crear cada commit. | convertirla en una comprobación automática (hook `PreToolUse` o script que avise si la rama actual es `main`/`sN/*` antes de editar) |
| R2 — No se commitea directamente en `main` ni en `sN/*`. | `git branch -a --contains <hash>` sobre `4427afc`, `0e56705`, `160fbc7`, `cbe9617`, `a3bb962`; `git log -15 --format='%h %p'` | no se puede comprobar con la información disponible | Los 15 commits están hoy en `s5/start` y `upstream/s4/end`, pero un commit hecho en una rama de trabajo y luego fusionado en `sN/*` en avance rápido queda igual; falta el historial de la rama donde se creó cada uno o la protección de ramas del remoto (fuera del repo). | convertirla en una comprobación automática (protección de rama en el remoto y/o hook `pre-commit` que rechace en `main`/`sN/*`) |
| R3 — Cada petición se cierra con un commit hecho con la skill `/commit`. | `git log -15 --format='%h %an %s%n%b'`, `.claude/skills/commit/SKILL.md` | no se puede comprobar con la información disponible | Todos los asuntos son `tipo(scope): …`, pero eso es lo que produciría la skill o escribirlo a mano; la skill no deja marca en el commit y no hay transcript de sesión. Falta saber con qué herramienta se creó cada commit. | convertirla en una comprobación automática (hook `commit-msg` que valide el formato convencional; la skill en sí no es comprobable) |
| R4 — Un cambio en rutas, controladores, validadores o transformers va en el mismo commit que el diff regenerado de `.adonisjs/`. | `git log -15 --name-status HEAD`; `git log -3 -- backend/.adonisjs`; la regla se añadió en `160fbc7` (2026-08-20 17:07), así que solo `cbe9617` (toca controladores) es posterior a ella | no se puede comprobar con la información disponible | `cbe9617` toca tres controladores y no incluye nada de `.adonisjs/` (último toque: `ea5db1f`); saber si la regeneración habría dado diff exige arrancar la app/regenerar, que esta auditoría no permite. `4e03d1f` (transformer) y `ea5db1f` (rutas) son anteriores a la regla. | convertirla en una comprobación automática (CI: regenerar y `git diff --exit-code backend/.adonisjs`) |
| R5 — Ese mismo cambio lleva `docs/capabilities/<nombre>/README.md` al día en el mismo commit. | `git log -15 --name-status HEAD`; `git log -3 -- docs/capabilities/tasks/README.md`; lectura de `docs/capabilities/tasks/README.md` | se cumple | `cbe9617` toca `backend/app/controllers/*` y `docs/capabilities/tasks/README.md` en el mismo commit; el README describe la anotación OpenAPI y el recorte del email. Es el único commit posterior a `160fbc7` que toca esas rutas. | convertirla en una comprobación automática (CI que falle si cambian rutas/controladores/validadores/transformers sin tocar `docs/capabilities/`) |
| R6 — Un solo `gh pr create`, con descripción completa, al terminar la unidad de trabajo. | `git log -15 --format='%h %p %s'` (buscar merges de PR); sin red ni GitHub | no se puede comprobar con la información disponible | Los PR viven en GitHub y no hay merges de PR en el historial local; falta la lista de PR de la rama y sus descripciones. | convertirla en una comprobación automática (plantilla de PR + CI que exija descripción no vacía) |
| R7 — El subagente `adversarial-reviewer` se pasa sobre el PR como último paso. | `.claude/agents/adversarial-reviewer.md`, `git log -15 --format='%h %s'` | no se puede comprobar con la información disponible | El agente existe (`8f9e715` lo ajusta), pero no queda rastro de ninguna ejecución en el repo; falta el transcript de la sesión o un comentario/informe del review en el PR. | convertirla en una comprobación automática (paso de CI o check requerido que publique el informe del review) |
| R8 — Al abrir el PR, el chat solo responde con la URL. | Sin fuente en el repo (`git log`, `.claude/`, `docs/`) | no se puede comprobar con la información disponible | Es comportamiento del chat; la sesión no se conserva y el repo no la registra. Falta el transcript de la conversación. | dejarla |

<!-- Veredicto: se cumple / no se cumple / no se puede comprobar con la información disponible
     Qué harías con ella: dejarla / borrarla / convertirla en una comprobación automática -->

## Parte B

1. **La regla en la que más me equivoqué:** R5: esperaba `no` y el historial dice `se cumple` (`git show --stat cbe9617` toca tres controladores y `docs/capabilities/tasks/README.md` en el mismo commit); mi `no` era una impresión sin haber mirado nada, y además es el único commit con código posterior a la regla (`160fbc7`), así que el «se cumple» se apoya en un solo caso.
2. **Una regla que no se puede comprobar con la información disponible, y qué tendría que cambiar para poder verificarla:** R4: `.adonisjs/` está versionado pero `cbe9617` toca controladores sin tocarlo y sin regenerar no puedo saber si habría diff; la convertiría en comprobación automática con un paso de CI que regenere y ejecute `git diff --exit-code backend/.adonisjs`, porque hoy el repo no tiene CI ni hooks que la verifiquen.
3. **La regla que eliminaría y por qué (¿ya la garantiza otra herramienta, o nadie la sigue y no aporta valor?):** R8, del caso «nadie la sigue y no aporta valor»: no deja rastro en ningún sitio y nada la comprueba, y lo que protege (que el resumen sobreviva a la sesión) ya lo cubre la descripción completa del PR que pide R6; no puedo demostrar que nadie la siga, solo que no se puede verificar.
