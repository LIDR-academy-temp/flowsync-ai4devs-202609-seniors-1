# PARTE A

## Auditoría de reglas de proceso de CLAUDE.md

| Qué pide la regla | Qué se revisó para comprobarla | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|
| Ramas por unidad de trabajo: reutilizar la rama de trabajo, crear `feat/<slug>` solo desde `main` o `sN/*`, y nunca commitear directo en `main` ni en `sN/*`. | `git log -15 --format='%h %p'`, `git branch -a --contains <sha>` sobre los commits del rango, `git reflog` | no se puede comprobar con la información disponible | El historial es lineal y los 15 commits están contenidos en `s5/start`, `upstream/s4/end` y `upstream/s5/start` (la punta `a3bb962` es un commit directo sobre una `sN/*`), pero git no guarda en qué rama se creó cada commit, y el reflog local solo tiene `clone` y `checkout main → s5/start`. | convertirla en una comprobación automática |
| Al cerrar cada petición se hace un commit con la skill `/commit`. | `git log -15` (mensajes y trailers), `.claude/skills/commit/SKILL.md` | no se puede comprobar con la información disponible | Los mensajes siguen `tipo(scope): descripción` y varios llevan `Co-Authored-By: Claude`, pero la skill no deja marca propia en el commit y el formato también lo produce un commit manual. | dejarla |
| `gh pr create` con descripción completa una sola vez al terminar la unidad, y `adversarial-reviewer` revisa ese PR una sola vez, como última actividad. | `gh pr list --state all`, `gh pr list --state merged`, `gh pr list --search <sha>` sobre los commits del rango, `gh pr view 113`, `.claude/agents/adversarial-reviewer.md` | no se puede comprobar con la información disponible | Ninguno de los 15 commits tiene PR propio (la búsqueda por sha solo devuelve el PR #118, ajeno, abierto por otra persona), el PR #113 de `claos` llegó cerrado con cuerpo vacío, y el agente es solo lectura (`Read, Grep, Glob`), así que no deja rastro de haberse ejecutado. | dejarla |
| Tras abrir el PR, la respuesta en el chat contiene solo la URL del PR. | `git log -15`, `gh pr view 113` (cuerpo y comentarios), `git status` | no se puede comprobar con la información disponible | La respuesta del chat vive en la sesión y no queda en el repositorio ni en los metadatos del PR, así que no hay fuente que contrastar. | dejarla |

# PARTE B

## 1. La regla en la que más te equivocaste
Pensé que todas se cumplirian, pero no hay suficiente evidencia en la historia de commits/PRs, ni se tiene el historial de chat completo de claude que los generaron para determinarlo. No se si me he equivocado con respecto a mis expectativas, falta más evidencia.

## 2. Una regla que no se puede comprobar con la información disponible.
La regla "Ramas por unidad de trabajo: reutilizar la rama de trabajo, crear feat/<slug> solo desde main o sN/*, y nunca commitear directo en main ni en sN/*.". Parte de ella se puede automatizar para que no sea una petición al modelo sino determinístico: evitar que se haga commit sobre main o en sN/*, con hooks de Claude Code y Git.

## 3. La regla que eliminarías y por qué. 
Eliminaría la regla "El commit sí es por petición: al cerrar cada una, usar la skill /commit." El agente no puede saber cuando terminar la unidad del trabajo, solo el humano, quien lo ejecuta explícitamente.