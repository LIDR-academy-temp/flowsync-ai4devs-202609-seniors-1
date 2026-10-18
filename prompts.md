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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Haz una auditoría de las reglas de proceso de CLAUDE.md (la sección "Reglas de proceso": qué hacer antes de tocar código, cuándo commitear y qué hacer al cerrar la tarea). Contrástalas con los últimos 15 commits del repositorio (git log -15, git show cuando haga falta) y con el estado actual de los ficheros del proyecto.

Guarda el resultado en docs/auditoria/ach.md, no en el chat. Una fila por regla, con estas cinco columnas:
1. Qué pide la regla, resumida en una frase y con tus palabras.
2. Qué se revisó para comprobarla: el comando ejecutado o el fichero consultado.
3. Veredicto: solo "se cumple", "no se cumple" o "no se puede comprobar con la información disponible".
4. Evidencia en una línea. Si no se cumple, dónde se incumple (hash del commit). Si no se puede comprobar, qué información falta.
5. Qué harías con ella: dejarla, borrarla o convertirla en una comprobación automática.

Restricciones: esto es una auditoría, no una corrección. No modifiques ningún fichero salvo docs/auditoria/ach.md. No hagas commit. No inventes evidencia: si no puedes comprobar algo, dilo. Incluye solo reglas de proceso, no reglas de arquitectura o estilo.
```

**Qué salió:** La auditoría está en docs/auditoria/ach.md, con siete filas: separé las viñetas que mezclaban varias obligaciones. No toqué ningún otro fichero y no hice commit.

- Se cumple (1 de 7): la regla de OpenAPI y README en el mismo commit. Desde que se creó (160fbc7), el único commit que toca controladores es cbe9617, y actualiza docs/capabilities/tasks/README.md. No cambia .adonisjs/; no regeneré el registro para ver si debía, y la fila lo dice.
- No se puede comprobar (6 de 7):
  - Rama: el historial es lineal y un commit no guarda en qué rama se hizo.
  - No commitear en main ni en sN/*: ninguno de los 15 está en main, pero todos están en upstream/s4/end y upstream/s5/start, y eso encaja con un commit directo o con un fast-forward.
  - /commit: los 15 mensajes siguen el formato tipo(scope): descripción, pero nada prueba que se usara la skill ni dónde acababa cada petición.
  - PR único, revisión adversarial y «responder solo la URL»: no dejan rastro en el repo. gh pr list sobre el fork sale vacío, y sobre LIDR-academy/... falla con «Could not resolve to a Repository».
- Qué haría con cada regla: convertir en comprobaciones automáticas las de rama, commit en main/sN/*, formato del commit, README junto al código y rastro de la revisión. Dejar tal cual el PR único y lo de responder solo la URL, que son de juicio o sobre el chat.
- Dato extra: la skill /commit dice «al cerrar una tarea» y la regla dice «por petición». Lo anoto en la fila 3.

No cuento ningún incumplimiento en los commits anteriores a cada regla (0e56705 y 160fbc7), porque entonces la regla no existía.  

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
 de las reglas del claude.md anote estas repsuesta qeu cumpliria
  1-si
  2-no
  3-no se
  4-si
  5-si
```

**Qué salió:** Añadió mi expectativa (1 sí, 2 no, 3 no sé, 4 sí, 5 sí) encima de la tabla en docs/auditoria/ach.md, y corrigió que CLAUDE.md tiene cinco viñetas y no cuatro, con la correspondencia viñeta → filas. Las respuestas las había anotado antes en unas notas fuera del proyecto; pedí copiarlas a ach.md para que quedaran en el entregable.
