# Calibración de revisión (FlowSync)

Instrucciones solo para quien revisa código aquí — el subagente `adversarial-reviewer`,
el workflow `.github/workflows/claude-code-review.yml`, o cualquier otro revisor que se
añada después. No sustituyen a `CLAUDE.md`: calibran qué vale la pena señalar.

## Qué es grave y qué es solo sugerencia

**Grave** (crítico/alto): rompe un requisito `SHALL`/`NO SHALL` de
`openspec/specs/<capability>/spec.md` o uno de sus scenarios, filtra un dato que un
transformer debería ocultar, o permite algo que la spec prohíbe explícitamente. Si no
puedes citar el requisito o scenario exacto que se rompe, no es grave.

**Sugerencia**: todo lo demás — estilo, nombres, una abstracción posible, un refactor
que no cambia comportamiento observable, un test que faltaría pero que ningún
requisito exige por escrito. Nunca "crítico" solo porque suena mal.

## Tope de sugerencias menores

Como mucho 5 sugerencias menores detalladas una a una por revisión. A partir de la
sexta, no las listes: resume cuántas quedaron fuera y de qué tipo (p. ej. "+3 de
nombrado, +2 de duplicación").

## Dónde no reportar

- Formato (Prettier/oxlint) y tipos (`tsc --noEmit`) — los corre `npm run
  lint`/`format`/`typecheck`, también en CI.
- Que `docs/api/openapi.json` esté desactualizado — lo vigila `npm run openapi:check`
  (`.github/workflows/openapi-check.yml`).
- Un test que ya falla en `node ace test` — repetirlo aquí no añade nada.
- Reglas de proceso de `CLAUDE.md` (rama, commit, PR) — no son parte de una revisión
  de código.

## Cita archivo y línea, no el nombre

No afirmes cómo se comporta algo porque el nombre de la función, variable o endpoint
lo sugiere. Cita `archivo:línea` del sitio exacto donde lo has leído —la
implementación, no la firma— antes de afirmar cualquier comportamiento. Si no lo has
leído, no lo afirmes.
