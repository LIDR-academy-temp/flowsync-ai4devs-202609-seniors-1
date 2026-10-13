# PARTE A, LA AUDITORIA

## Expectativas
- La rama es por unidad de trabajo, no por petición - Ni idea. No se cómo de complicado será en este proyecto diferenciar una unidad de trabajo de una petición y no crear ramas por peticiones. Dependera de lo claro que esto este en las specs
- El commit sí es por petición: al cerrar cada una, usar la skill `/commit` - Si. Parece menos probable que haya dudas aqui
- Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día - Ni idea. Me parece más compleja su descripcion y por tanto interpretable. Se hace mención explicita a la ubicacion del readme, pero no al documento OpenAPI
- `gh pr create` (con una descripción completa de los cambios en el cuerpo del PR) y el pase del subagente `adversarial-reviewer` sobre ese PR van **una sola vez, al terminar la unidad de trabajo**, no al cerrar cada petición - Ni idea. De nuevo la duda entre si el agente diferenciara claramente unidad de trabajo y petición
- Cuando abras el PR, no repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR - Si. Parece sencilla

## La tabla

| # | Qué pide la regla | Qué se miró | Veredicto | Evidencia | Qué haría |
|---|---|---|---|---|---|
| 1 | Cada unidad de trabajo va en una sola rama `feat/<slug>`, creada desde `main` o desde una `sN/*`, y se sigue en ella si ya existe. | `git log -15 --format='%h %p'`, `git branch -a --contains <sha>`, `git reflog` | No se puede comprobar | Git no guarda en qué rama nació un commit, y la historia es lineal y reescrita (autor Earvin, committer «LIDR Academy»): no queda ninguna `feat/*` ni merge. Haría falta conservar las ramas o hacer merges `--no-ff`. | bajarla |
| 2 | No se commitea directamente en `main` ni en una `sN/*`. | `git branch -a --contains <sha>` + `git log -15 --format='%h %an %cn'` | No se cumple | Los 15 commits solo están en `s5/start` / `upstream/s4/end` / `upstream/s5/start`. Ninguno pasó por merge ni por PR, y `afc4b74` y `a3bb962` (autor = committer = LIDR) se hicieron directamente sobre `s5/start`. | bajarla |
| 3 | Cada petición se cierra con su propio commit. | `git log -15` (mensajes y trailers) | No se puede comprobar | Las peticiones no dejan rastro: falta un registro de peticiones (ticket, prompt o id de sesión en el trailer) contra el que contar commits. | borrarla |
| 4 | Ese commit se hace con la skill `/commit`. | `.claude/skills/commit/SKILL.md` + `git log -15 --format=%s` contra `^(feat\|fix\|refactor\|docs\|test\|chore)(\(scope\))?: ` | No se puede comprobar | Los 15/15 tienen formato convencional, pero un mensaje escrito a mano es idéntico: la skill no deja marca propia en el commit. | bajarla |
| 5 | Un commit que toca rutas, controladores, validadores o transformers de una capability lleva también el diff regenerado de `.adonisjs/` y el `docs/capabilities/<nombre>/README.md` al día. | `git show --stat` de los commits posteriores a `160fbc7`; `backend/.adonisjs/server/controllers.ts` | Se cumple | `cbe9617` toca los 3 controladores de tasks e incluye `docs/capabilities/tasks/README.md`. No hay diff en `.adonisjs/` porque ni rutas ni controladores son nuevos (ya estaban en `controllers.ts`). Antes de existir la regla, `4e03d1f` cambió un transformer sin README. | bajarla |
| 6 | Al terminar la unidad de trabajo se abre un único PR con `gh pr create` y una descripción completa. | `gh api .../commits/<sha>/pulls` para los 15; `gh pr list -R LIDR-academy/... --state merged` | No se cumple | Ninguno de los 15 commits está asociado a un PR, y el repo no tiene ningún PR mergeado: todo entró en `s4/end`/`s5/start` sin PR. | bajarla |
| 7 | El último paso de la unidad, antes de darla por terminada, es pasar el subagente `adversarial-reviewer` sobre el PR. | `.claude/agents/adversarial-reviewer.md` (tools: Read, Grep, Glob) + lo mismo que en la fila 6 | No se puede comprobar | El agente es de solo lectura y no publica nada. Además no hubo PR (fila 6) donde dejar su resultado. Para comprobarlo haría falta que el review quedara como comentario en el PR o como check de CI. | bajarla |
| 8 | Después de abrir el PR, la respuesta en el chat es solo la URL, sin repetir el resumen. | Nada versionado: ni el repo ni GitHub guardan la conversación | No se puede comprobar | Solo quedaría rastro en la transcripción de la sesión, que no se conserva. Además, la regla 6 ya garantiza que el resumen está en el PR. | borrarla |


## Parte B: las tres líneas

La regla en la que más te equivocaste. Compara tu expectativa inicial con el veredicto final y elige la que más se alejó de lo que pensabas. Si acertaste todas, indícalo y explica en una frase en qué te apoyaste para acertar. Si solo era una impresión, también conviene dejarlo por escrito.

- Para empezar evalue 5 reglas (cada uno de los 5 puntos en CLAUDE.md) pero varios de ellos incluian mas de una regla
En las 1,3,4,7 y 8, no fui consciente de que no era posible verificar determinados puntos solo con la informacion disponible en los comits y en el estado actual del codigo

Una regla que no se puede comprobar con la información disponible. Explica en una frase qué tendría que cambiar para poder verificarla. Puede ser reformularla, convertirla en una comprobación automática o aceptar que no deja una evidencia clara.

- El último paso de la unidad, antes de darla por terminada, es pasar el subagente adversarial-reviewer sobre el PR. No se puede comprobar. Habria que incluir la llamada al adversarial reviewer en una fase del pipeline CI y dejar evidencia 

La regla que eliminarías y por qué. Hay dos casos habituales: una regla que ya garantiza otra herramienta o una que nadie sigue y que tampoco aporta valor. Elige una y explica a cuál de los dos casos pertenece.

- Después de abrir el PR, la respuesta en el chat es solo la URL, sin repetir el resumen -> Se podria eliminar ya que la escritura en el chat no afecta al repo o al resto de desarrolladores y la regla 6 ya garantiza que el resumen esta en el PR


