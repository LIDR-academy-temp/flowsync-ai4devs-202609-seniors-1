# Revisor de código en CI (`.github/workflows/claude-code-review.yml`)

Lanza la [acción oficial de Claude Code para GitHub Actions](https://github.com/anthropics/claude-code-action)
sobre cada PR abierto, actualizado o reabierto. Claude actúa como el revisor definido en
[`.claude/agents/adversarial-reviewer.md`](../.claude/agents/adversarial-reviewer.md) (mismo
objetivo, misma calibración), con `Read`, `Grep` y `Glob` como únicas herramientas permitidas —sin
Bash, no puede escribir nada ni ejecutar `git diff`/`gh pr diff`; la lista de ficheros cambiados se
la pasa un paso previo del propio workflow—, y los hallazgos se publican como comentario en el PR
en un paso separado (`gh pr comment`), no solo en el log del job.

## Qué queda pendiente a mano

1. **Crear el secreto del repositorio.** El workflow no funciona hasta que exista el secreto que
   referencia (ver [Credencial](#credencial-dos-caminos-no-intercambiables) abajo). Sin él, el job
   falla en el primer paso que llama a la acción.
2. **Decidir si el check es obligatorio.** El workflow comenta en el PR pero no bloquea el merge
   por sí solo. Si quieres que sí lo haga, añade el job `review` a los *required status checks* de
   la protección de la rama `main` (Settings → Branches → Branch protection rules).
3. **Revisar el límite de gasto de la organización/cuenta**, no solo el modelo del workflow (ver
   siguiente sección) — un `--max-turns 40` acota el trabajo de una sesión, no el gasto agregado de
   todas las que se disparen en un día con mucha actividad de PRs.
4. **Decidir qué pasa con los forks** (ver [sección dedicada](#prs-desde-un-fork-en-un-repositorio-público)
   más abajo) — con la configuración actual, un PR desde un fork no dispara una revisión.

## En qué se va el dinero

El workflow pide `--model sonnet --effort medium`: el alias `sonnet` resuelve al Sonnet vigente en
el momento de la ejecución (hoy, Sonnet 5), y `medium` es el nivel de esfuerzo de razonamiento, ni el
más barato (`low`) ni el más caro (`high`/`xhigh`/`max`). Es la combinación por defecto razonable
para una revisión de PR: más barata que Opus, y con más capacidad de razonamiento que Haiku para
contrastar código contra los requisitos de `openspec/specs/`.

**Para cambiarlo**, edita la línea `--model` / `--effort` dentro de `claude_args` en
`.github/workflows/claude-code-review.yml`:

- Más barato: `--model haiku --effort low` (peor seguimiento de requisitos largos, más falsos
  negativos probables).
- Más exhaustivo: `--model opus --effort high` (más caro y más lento; con `timeout-minutes: 10` y
  `--max-turns 40` fijos, puede no llegar a terminar en PRs grandes).

**Precio**: no lo cito aquí a propósito —cambia, y una cifra escrita en este documento envejece sin
que nadie se entere—. La página oficial y vigente es
**https://www.anthropic.com/pricing#api**. El coste real de cada ejecución depende también de
cuántos tokens lea Claude (tamaño del PR, cuántos ficheros de `openspec/specs/` tenga que abrir),
no solo del modelo.

## Credencial: dos caminos, no intercambiables

### Camino 1 — token de suscripción (`claude setup-token`)

Se genera en local, en una máquina donde ya tengas sesión iniciada con una suscripción de Claude:

```bash
claude setup-token
```

Imprime el token por terminal (no lo guarda). Cópialo tal cual a un secreto del repositorio llamado
**`CLAUDE_CODE_OAUTH_TOKEN`** (Settings → Secrets and variables → Actions → New repository secret).
El workflow lo consume en el input **`claude_code_oauth_token`**:

```yaml
claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

Es el camino que usa este workflow por defecto.

### Camino 2 — clave de API de la consola

Se genera en [console.anthropic.com](https://console.anthropic.com), bajo un proyecto con
facturación propia (independiente de cualquier suscripción de Claude). Se guarda en un secreto
llamado **`ANTHROPIC_API_KEY`**, consumido en el input **`anthropic_api_key`**:

```yaml
anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

En `claude-code-review.yml` esta línea está comentada, lista para descomentar (y comentar la del
token de suscripción) si se prefiere este camino.

### No son intercambiables

Cada input espera un formato de credencial distinto y la acción no los valida de forma cruzada:
pegar la clave de la consola en `claude_code_oauth_token`, o el token de `claude setup-token` en
`anthropic_api_key`, **no da un error de configuración claro** — el job arranca, y falla en la
**primera llamada** a la API con un error de autenticación que no dice "input equivocado", así que
cuesta más de lo que parece darse cuenta de qué se cruzó. Si el workflow falla ahí, lo primero que
hay que mirar es que el secreto puesto en el input correcto sea del tipo que ese input espera.

## PRs desde un fork en un repositorio público

El trigger es `pull_request` (no `pull_request_target`), que es la opción segura por defecto: para
un PR que viene de un fork, GitHub **no expone los secretos del repositorio** a esa ejecución. Esto
significa que, con la configuración actual, un PR externo llega al paso de la acción sin credencial
disponible y ese paso falla por falta de `claude_code_oauth_token`/`anthropic_api_key` — no hay
revisión automática para contribuciones externas.

La alternativa sería `pull_request_target`, que sí expone los secretos de la rama base incluso para
PRs de fork — pero entonces el job corre con los permisos y secretos del repositorio base mientras
potencialmente ejecuta o lee contenido que no has revisado todavía (lo que la documentación de la
acción llama un *pwn request*). No se ha adoptado aquí: si en algún momento se necesita revisar PRs
de fork automáticamente, la propia documentación de la acción
([Security](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md#using-this-action-with-pull_request_target-or-workflow_run))
explica cómo hacerlo sin exponer el checkout del fork al runner con permisos de la rama base.
Mientras tanto, un PR de fork necesita una revisión manual o un re-disparo del workflow por un
mantenedor con acceso de escritura.
