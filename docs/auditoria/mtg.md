# Auditoría de reglas de proceso

Contraste de las *reglas de proceso* de `CLAUDE.md` contra los últimos 15 commits del
repositorio (`b955a72`..`a3bb962`, rama `auditoria-mtg`, creada desde `s5/start`) y el estado
actual del árbol de trabajo. Auditoría de solo lectura: no se ha modificado ningún archivo del
proyecto para producirla.

Commits auditados (de más antiguo a más reciente):

```
b955a72 docs(s4)            LIDR Academy
4427afc test(tasks)         Earvin Saúl Pérez Ramos
0e56705 docs(process)       Earvin Saúl Pérez Ramos
4e03d1f fix(tasks)          Earvin Saúl Pérez Ramos
190c80c docs(architecture)  Earvin Saúl Pérez Ramos
ea5db1f feat(openapi)       Earvin Saúl Pérez Ramos
d789d5c docs(adr)           Earvin Saúl Pérez Ramos
c2fa70b docs(adr)           Earvin Saúl Pérez Ramos
7662fb1 docs(tasks)         Earvin Saúl Pérez Ramos
160fbc7 docs(process)       Earvin Saúl Pérez Ramos
8f9e715 chore(harness)      Earvin Saúl Pérez Ramos
cbe9617 docs(tasks)         Earvin Saúl Pérez Ramos
afc4b74 docs(s5)            LIDR Academy
21ce54d docs(s5)            Earvin Saúl Pérez Ramos
a3bb962 docs                LIDR-AI4Devs
```

Los cuatro commits de `LIDR Academy` / `LIDR-AI4Devs` son material del curso (enunciados y
README de ejercicio), no unidades de trabajo del alumno; se citan como contexto pero las reglas
de proceso no están pensadas para ellos.

## Tabla

| Qué pide la regla | Qué se revisó para comprobarla | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|
| **R1 — Rama por unidad de trabajo.** Antes de tocar código, mirar en qué rama se está; si ya es una rama de trabajo (ni `main` ni `sN/*`), seguir en ella; solo desde `main` o `sN/*` se crea una rama nueva; nunca commitear directo en `main` ni en una `sN/*`. | `git branch -a -v`, `git reflog` (completo) y `git reflog show s5/start` / `show auditoria-mtg` para ver desde dónde se creó cada rama y qué checkouts preceden a cada tramo de commits. | No se puede comprobar con la información disponible (para los 10 commits de trabajo real) / Se cumple (para esta sesión) | El reflog muestra que `s5/start` se creó "from upstream/s5/start" ya en `a3bb962`: los 10 commits de Earvin (`4427afc`…`cbe9617`) llegaron ya empaquetados por ese merge/fast-forward del remoto `upstream`, no hay en este clon un checkout local a `main` o a `s4/start`/`s5/start` inmediatamente antes de ninguno de ellos — el reflog local solo muestra saltos entre ramas `feat/*` y `trazabilidad-mtg`, consistentes con la regla —, pero no hay manera de confirmar desde este repo en qué rama estaban realmente HEAD cuando se hicieron, porque no hay commits de merge (historia lineal) que lo delaten. Para la sesión actual sí hay evidencia directa: `auditoria-mtg` se creó desde `s5/start` (`git reflog show auditoria-mtg` → "Created from HEAD" estando en `s5/start`), y no hay commits nuevos en `main` ni en ninguna `sN/*` en lo que va de esta unidad de trabajo. | Dejarla. Es la regla con más intención real (evita ramas por petición) pero, tal como está, no deja rastro verificable sobre dónde se hizo cada commit pasado; no vale la pena convertirla en comprobación automática porque un hook de `pre-commit` que bloquee commits en `main`/`sN/*` ya cubriría el riesgo real sin necesitar auditarla a posteriori. |
| **R2 — Commit por petición.** Al cerrar cada petición se usa la skill `/commit` para generar el commit. | Mensajes y `--stat` de los 15 commits (no hay forma de ver qué petición de chat originó cada uno). | No se puede comprobar con la información disponible | La correspondencia 1:1 entre "petición" y commit solo existe en las transcripciones de las sesiones de chat, que no están en el repositorio; el repositorio solo registra el resultado (un commit), no la petición que lo originó. Indicios a favor: los commits están muy acotados (uno por fix, uno por test, uno por ADR…), compatible con "un commit por petición", pero es circunstancial. | Convertirla en comprobación automática parcial: no se puede verificar la correspondencia con la petición, pero sí se puede forzar con un hook que impida continuar sin staged changes limpios entre invocaciones de `/commit`, o loguear qué prompt disparó cada commit (p. ej. en el propio cuerpo del commit) si se quiere que quede auditable. Mientras tanto, dejarla. |
| **R3 — Contrato de capability al día en el mismo commit.** Un cambio que toque rutas, controladores, validadores o transformers de una capability cierra, en el mismo commit, el documento OpenAPI (el diff regenerado de `.adonisjs/`) y el README de `docs/capabilities/<nombre>/`. | `git show --stat` de cada uno de los 15 commits para ver qué ficheros tocan; cruce manual con `docs/capabilities/tasks/README.md` y con si `backend/.adonisjs/` aparece en el mismo commit. | Se cumple | Solo dos commits del lote tocan código de la capability `tasks` después de que la regla existiera (se añadió en `160fbc7`): `cbe9617` (anota `tasks_controller.ts`, `task_due_dates_controller.ts` y `task_statuses_controller.ts` con decoradores `@foadonis/openapi`, sin tocar rutas) actualiza `docs/capabilities/tasks/README.md` en el mismo commit, y no toca `.adonisjs/` porque los decoradores no cambian ninguna ruta ni firma —no hay diff que regenerar—. `ea5db1f` sí añade rutas nuevas (`/api`, `/api.json`, `/api.yaml`) y en ese mismo commit trae el diff de `backend/.adonisjs/client/...` y `backend/.adonisjs/server/routes.d.ts`. Antes de `160fbc7` la regla no existía: `4e03d1f` (fix del transformer de tasks) y `ea5db1f`-previo no se les puede exigir retroactivamente. | Dejarla. Es la regla más verificable de las cinco (dos ficheros concretos a cruzar) y de momento se respeta; convertirla en comprobación automática (un check de CI que, si el diff toca `app/controllers`, `app/validators` o `app/transformers` de una capability, exija que el mismo commit toque su README y, cuando corresponda, `.adonisjs/`) sería razonable si el equipo crece, pero hoy el coste de un script así no compensa frente a revisarlo a mano en cada PR. |
| **R4 — PR y revisión adversarial una sola vez, al final de la unidad de trabajo.** `gh pr create` (con descripción completa) y el pase del subagente `adversarial-reviewer` van una sola vez, al terminar la unidad de trabajo, no al cerrar cada petición; el review adversarial es lo último. | Se intentó `gh pr list --state all` (y con `--json`) para ver PRs abiertos/cerrados contra `cbe9617`..`a3bb962`; se buscaron artefactos de review adversarial en el repo (`find . -iname "*pr*"`). | No se puede comprobar con la información disponible | El binario `gh` no está disponible en este entorno (`gh: command not found`), así que no hay acceso a la lista de PRs, sus descripciones ni a si se ejecutó el subagente `adversarial-reviewer` sobre alguno de ellos. El repositorio local no guarda esa información (no hay ficheros de review ni referencias `refs/pull/*` fetcheadas). No se puede saber si esta unidad de trabajo ya cerró con un PR, ni cuántas veces se invocó el revisor. | Convertirla en comprobación automática débil: no hay forma de que un check de repo la fuerce (vive en el proceso de chat/CLI, no en el código), pero sí se puede dejar rastro verificable commiteando el número de PR o un enlace en el último commit de la unidad, para que una auditoría futura no dependa de tener `gh` a mano. Mientras no se haga eso, dejarla tal cual. |
| **R5 — No repetir el resumen del PR en el chat.** Al abrir el PR, responder solo con la URL del PR; el resumen vive en el PR, no en la sesión. | No hay rastro de esto en el repositorio: es una regla sobre el contenido de la respuesta en el chat, no sobre ningún archivo o commit. | No se puede comprobar con la información disponible | El repositorio no registra las respuestas de chat; solo se podría comprobar leyendo la transcripción de la sesión en la que se abrió cada PR, que no está versionada aquí. | Dejarla, pero fuera del alcance de esta auditoría basada en git: si se quiere hacer verificable, habría que versionar o loguear las transcripciones de sesión, lo que probablemente no compensa el coste frente al beneficio de la regla (evitar ruido en el chat). |


# Expectativa prévia (mtg)

- R1: No se puede saber
- R2: Sí (no verificable)
- R3: No se puede saber
- R4: Sí (parte adversarial)
- R5: No se puede saber


# Parte B

## 1. La regla en la que más te equivocaste.

Yo me temía que todas las rules excepto la R4 eran imposibles de verificar a posteriori porque no dejan traza, pero he visto que la R3 si que se ha podido comprobar y la R4 parcialmente (porque entiendo que el `adversarial-reviewer` deja notas en el PR), justamente no, pero porque no tengo el cli `gh` activado. Ya lo he instalado pero no he modificado el documento para que se vea el problema original. Y igualmente me ha dicho que con la información disponible no puede hacerlo.

## 2. Una regla que no se puede comprobar con la información disponible.

 La R2 (commit por petición) no se puede comprobar porque el repositorio no registra qué petición de chat originó cada commit; para verificarla habría que loguear el prompt en el propio cuerpo del commit, o aceptar que es una regla de proceso sin evidencia objetiva y forzarla solo con un hook que impida encadenar invocaciones de /commit sin staged changes limpios entre medias.

 
## 3. La regla que eliminarías y por qué.

Eliminaría la R5 (no repetir el resumen del PR en el chat): es una norma de estilo de respuesta, no de proceso de desarrollo — no protege nada que el propio PR no garantice ya como fuente de verdad, y su incumplimiento no deja ninguna consecuencia verificable.
