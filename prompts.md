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

**Modelo:** Sonet Medium
**Herramienta:** Claude Code

```
# 1. CONTEXTO / ROLE

Actúa como auditor técnico de repositorios y evaluador adversarial de reglas de desarrollo.

Tu responsabilidad es contrastar exclusivamente cuatro reglas de `CLAUDE.md` con evidencia verificable, preservando íntegramente el estado del repositorio durante la auditoría.

# 2. OBJETIVO / TAREA

Audita exclusivamente las siguientes reglas de `CLAUDE.md`:

1. **Ramas por unidad de trabajo:** La rama es por unidad de trabajo, no por petición. Si ya se está en una rama de trabajo distinta de `main` o `sN/*`, se reutiliza. Solo desde `main` o `sN/*` se crea una nueva rama `feat/<slug>`. Nunca se realizan commits directamente en `main` ni en `sN/*`.

2. **Commits por petición:** Al cerrar cada petición se realiza un commit utilizando la skill `/commit`.

3. **PR y revisión adversarial por unidad de trabajo:** `gh pr create`, con una descripción completa de los cambios, se ejecuta una sola vez al finalizar la unidad de trabajo. El subagente `adversarial-reviewer` revisa ese PR una sola vez, como última actividad antes de cerrar la unidad.

4. **Respuesta posterior al PR:** Después de abrir el PR, la respuesta en el chat contiene exclusivamente la URL del PR, sin repetir su descripción.

Contrasta estas reglas con:

- Los últimos 15 commits del repositorio.
- El estado actual de los archivos del proyecto.

Guarda el resultado exclusivamente en:

`docs/auditoria/cgll.md`

# 3. CRITERIOS DE ÉXITO EXPLÍCITOS

1. **Cobertura:** Las cuatro reglas indicadas tienen exactamente una fila cada una. No se auditan otras reglas de `CLAUDE.md`.

2. **Trazabilidad:** Cada veredicto está sustentado en evidencia verificable. Se identifica el comando ejecutado o archivo consultado.

3. **Estructura:** El Markdown contiene una tabla con exactamente estas cinco columnas:
   - **Qué pide la regla:** Una frase breve..
   - **Qué se revisó para comprobarla:** Comando ejecutado o archivo consultado.
   - **Veredicto:** Exclusivamente `se cumple`, `no se cumple` o `no se puede comprobar con la información disponible`.
   - **Evidencia:** Una línea que sustente el veredicto, localice el incumplimiento o identifique la información faltante.
   - **Qué harías con ella:** Exclusivamente `dejarla`, `borrarla` o `convertirla en una comprobación automática`.

5. **Integridad:** La auditoría no altera el estado del proyecto analizado. El único archivo que puede crearse o modificarse es el entregable solicitado.

# 4. RESTRICCIONES / ANTIPATTERNS

- No auditar reglas distintas de las cuatro indicadas.
- No corregir incumplimientos ni refactorizar código.
- No crear ni cambiar ramas, realizar commits, abrir PR ni ejecutar revisiones adversariales como parte de la auditoría.
- No modificar `CLAUDE.md`, configuraciones, pruebas ni otros archivos del proyecto.
- No ejecutar comandos con efectos modificadores sobre el repositorio o su entorno.
- No emitir veredictos basados en suposiciones o inferencias no sustentadas.
- No confundir ausencia de evidencia con cumplimiento.
- No asumir que un commit demuestra la utilización de `/commit`, ni que la existencia de un PR demuestra la ejecución de `adversarial-reviewer`.
- No recomendar automatización sin considerar si la regla es objetivamente verificable.
- No reconstruir evidencia de memoria ni presentar comprobaciones no ejecutadas.
- No publicar la tabla ni su contenido en el chat.

# 5. RECURSOS

Consulta directamente:

- `CLAUDE.md`, exclusivamente las cuatro reglas señaladas.
- Los últimos 15 commits del repositorio.
- El estado actual de las ramas y archivos del proyecto.
- Metadatos e historial de PR disponibles.

Utiliza herramientas de inspección de solo lectura.

El directorio `docs/auditoria/` es exclusivamente el destino del entregable.

# 6. CLARIFICACIÓN

Resuelve autónomamente las decisiones de inspección, interpretación y clasificación que puedan sustentarse en las fuentes.

No solicites información adicional cuando la falta de evidencia pueda registrarse mediante el veredicto `no se puede comprobar con la información disponible`.

Solicita aclaración únicamente si una ambigüedad material impide identificar las reglas o ejecutar la auditoría.

La respuesta final en el chat debe limitarse a indicar la ubicación del archivo generado y cualquier impedimento material para su creación.
```

**Qué salió:** La auditoría está en docs/auditoria/cgll.md. No hubo ningún impedimento material para crearla.
