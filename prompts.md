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

**Modelo:** Sonet 5.5 Medium
**Herramienta:** Claude Code

```
Necesito que me resumas los últimos 15 commits para revisar si cumplen las reglas.
```

**Qué salió:** funcionó a la primera

```
Resumen de los últimos 15 commits (más reciente primero)

Todos usan el formato convencional tipo(scope): mensaje.

┌─────────┬────────────────────┬───────────────────────────────────────────────────────────────────────────┐
│ Commit  │        Tipo        │                                 Qué hace                                  │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ a3bb962 │ docs               │ El README apunta a los repos del cohorte 202609-seniors-1. Autor:         │
│         │                    │ LIDR-AI4Devs.                                                             │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 21ce54d │ docs(s5)           │ README reescrito como lección de ejercicio (+173/−73).                    │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ afc4b74 │ docs(s5)           │ Enunciado y plantilla de prompts en la rama de partida. Autor: LIDR       │
│         │                    │ Academy.                                                                  │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│         │                    │ El OpenAPI recoge el contrato de la spec. Añade openapi/schemas.ts, dos   │
│ cbe9617 │ docs(tasks)        │ controladores nuevos (task_due_dates, task_statuses) y cambios en         │
│         │                    │ tasks_controller, config/openapi.ts, package.json y el README de tasks.   │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 8f9e715 │ chore(harness)     │ El revisor adversarial contrasta contra la spec viva.                     │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 160fbc7 │ docs(process)      │ CLAUDE.md: el contrato de una capability se actualiza en el mismo commit. │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 7662fb1 │ docs(tasks)        │ README de la capability tasks, enlazando la spec.                         │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ c2fa70b │ docs(adr)          │ ADR 0002: los tests de integración son la fuente de verdad ejecutable.    │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ d789d5c │ docs(adr)          │ ADR 0001: las delta-specs de OpenSpec son la fuente de verdad.            │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│         │                    │ Registra las rutas del documento OpenAPI. Toca start/routes.ts,           │
│ ea5db1f │ feat(openapi)      │ adonisrc.ts, config/openapi.ts, package.json y el lock, y regenera        │
│         │                    │ .adonisjs/.                                                               │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 190c80c │ docs(architecture) │ Diagrama de contenedores C4.                                              │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 4e03d1f │ fix(tasks)         │ Deja de publicar el email del responsable en la lista                     │
│         │                    │ (task_transformer.ts).                                                    │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 0e56705 │ docs(process)      │ CLAUDE.md: la rama es por unidad de trabajo y el PR va una sola vez.      │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 4427afc │ test(tasks)        │ Tests del responsable que muestra cada tarea.                             │
├─────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ b955a72 │ docs(s4)           │ Enunciado y plantilla de prompts del ejercicio s4. Autor: LIDR Academy.   │
└─────────┴────────────────────┴───────────────────────────────────────────────────────────────────────────┘

Cinco de estos commits (a3bb962, 21ce54d, afc4b74, b955a72 y 8f9e715) son del material del curso o del harness, no de funcionalidad. a3bb962 y 21ce54d solo tocan el README.

Posibles incumplimientos de las reglas

Solo he mirado mensajes y ficheros tocados, no el contenido de los diffs.

1. cbe9617: puede faltar el diff de .adonisjs/.
   - La regla pide cerrar los cambios de controladores con el OpenAPI y el README al día. Eso cumple en parte: el README de tasks está actualizado.
   - Lo que se commitea como OpenAPI es el diff regenerado de .adonisjs/, y ese diff no aparece. Añade dos controladores nuevos, y .adonisjs/server/controllers.ts debería haber cambiado.
   - Además el tipo es docs, pero el commit toca controladores y package.json.
2. 4e03d1f: toca un transformer sin README ni OpenAPI.
   - Cambia task_transformer.ts y no actualiza docs/capabilities/tasks/README.md ni .adonisjs/.
   - Este commit es anterior a la regla, que se añadió en 160fbc7, así que es un incumplimiento retroactivo, no un fallo del proceso.
3. ea5db1f: toca rutas sin README de capability.
   - Regenera .adonisjs/, pero no hay README de capability para openapi. También es anterior a la regla.
4. Atribución: no he comprobado los trailers Co-Authored-By, porque --stat no muestra el cuerpo de los mensajes. Puedo revisarlos si te interesa.
5. Ramas: el log no dice en qué rama se hizo cada commit. Hoy estás en auditoria-mtg, que no es main ni una sN/*, así que es correcto. Los commits a3bb962, 21ce54d y afc4b74 están en s5/start, lo que cuadra con su origen del curso.

Fuera de los commits, backend/package.json está modificado sin commitear. Puedo mirar ese diff y los de cbe9617 y 4e03d1f para confirmar los puntos 1 y 2, si quieres.
```

---

## Prompt 2

**Modelo:** Sonet 5.5 Medium
**Herramienta:** Claude Code

```
A partir de ahora, para esta sesión, me incluirás toda la conversación que tenemos en el fichero prompts.md con el formato que ves en la plantilla. Deja el Prompt 1 y toma el Prompt n como ejemplo, pero eliminálo. Puedes empezar incluyendo este mismo. Sólo saca la salida textual no el detalla de la ejecución de las herramientas.
```

**Qué salió:** funcionó a la primera

```
He añadido este prompt como Prompt 2 en prompts.md, he dejado el Prompt 1 intacto y he eliminado el Prompt n de ejemplo. Desde ahora iré añadiendo cada prompt y su salida textual, sin el detalle de las herramientas. No hago commit del fichero; dime si quieres que lo haga.
```

---

## Prompt 3

**Modelo:** Sonet 5.5 Medium
**Herramienta:** Claude Code

```
el commit de este fichero no lo hagas nunca, ya lo haré yo manualmente después de revisarlo
```

**Qué salió:** funcionó a la primera

```
Anotado: no haré nunca el commit de prompts.md; lo harás tú manualmente tras revisarlo. He añadido este prompt como Prompt 3 y he guardado la regla en la memoria.
```

---

## Prompt 4

**Modelo:** Sonet 5 Medium
**Herramienta:** Claude Code

```
Contrasta las *reglas de proceso* con los últimos 15 commits del repositorio y el estado actual de los archivos del proyecto. Guarda el resultado en docs/auditoria/mtg.md, no en el chat.

Usa una fila por regla y completa estas cinco columnas:

*Qué pide la regla*. Resúmela en una frase y con tus propias palabras. Si necesitas varias frases, puede que estés mezclando más de una regla.

*Qué se revisó para comprobarla*. Indica el comando ejecutado o el archivo consultado. Sin esta información no hay forma de saber en qué se apoya el veredicto.

*Veredicto*. Solo puede ser se cumple, no se cumple o no se puede comprobar con la información disponible. Este último caso también es un resultado válido. Significa que la regla no deja suficiente evidencia para verificarla.

*Evidencia*. Escríbela en una línea. Si la regla no se cumple, indica dónde se incumple. Si no se puede comprobar, explica qué información falta.

*Qué harías con ella*. Elige entre: dejarla, borrarla o convertirla en una comprobación automática.

* NO modifiques ningún archivo.
```

**Qué salió:** tuve que insistir porque falló por un tema de seguridad, pero he perdido los prompts intermedios al ir atrás en el historial. Al final cambié el modelo a Sonnet 5 porqué me sugirió cambiar el modelo y esta es la respuesta:

```

Write(docs/auditoria/mtg.md)
Wrote 48 lines to docs/auditoria/mtg.md
# Auditoría de reglas de proceso

Contraste de las *reglas de proceso* de `CLAUDE.md` contra los últimos 15 commits del
repositorio (`b955a72`..`a3bb962`, rama `auditoria-mtg`, creada desde `s5/start`) y el estado
actual del árbol de trabajo. Auditoría de solo lectura: no se ha modificado ningún archivo del
proyecto para producirla.

Commits auditados (de más antiguo a más reciente):

… +82 lines

He guardado la auditoría en docs/auditoria/mtg.md. Resumen de veredictos:

- R1 (rama por unidad de trabajo): no se puede comprobar para los 10 commits de trabajo real (llegaron ya empaquetados vía upstream/s5/start, sin merge visible que delate en qué rama se hicieron); se cumple para la sesión actual.
- R2 (commit por petición): no se puede comprobar — esa correspondencia solo vive en el chat, no en git.
- R3 (contrato de capability al día): se cumple — revisé cbe9617 y ea5db1f, los únicos que tocan código de tasks desde que la regla existe (160fbc7), y ambos cierran README/.adonisjs/ correctamente (o no necesitan .adonisjs/ porque son solo decoradores sin cambio de rutas).
- R4 (PR + review adversarial una sola vez): no se puede comprobar — gh no está disponible en este entorno y el repo no deja rastro local de PRs ni de pases del revisor.
- R5 (no repetir el resumen en chat): no se puede comprobar — es una regla sobre el contenido del chat, sin rastro en el repositorio.

No he modificado ningún otro archivo; solo creé el directorio docs/auditoria/ y el fichero pedido.

```

---

## Prompt 5

**Modelo:** Sonet 5.5 Medium
**Herramienta:** Claude Code

```
¿puedes volver a comprobar la R4? Déjala en el chat, no modifiques el archivo.

```

**Qué salió:** he vuelto a Sonet 5.5 y me ha vuelto a dar el siguiente error

```

API Error: Sonnet 5.5's safeguards flagged this message (https://www.anthropic.com/legal/aup). This sometimes happens with safe, normal conversations. Claude Code can't respond to this message with Sonnet 5.5.

  Double press esc to edit your last message, or try a different model with /model.

  Send feedback with /feedback or learn more: https://support.claude.com/en/articles/8106465

  Details: `[reasoning_extraction]`

  Request ID: req_011Cg7bvtpWRZBbpnod4Ez1f

  Message ID: msg_011Cg7bvu9r3wdDJmSTshDSd

```


---

## Prompt 6

**Modelo:** Sonet 5 Medium
**Herramienta:** Claude Code

```
¿puedes volver a comprobar la R4? Déjala en el chat, no modifiques el archivo.
```

**Qué salió:** he vuelto a Sonet 5

```
Entendido, no repito eso. Me quedé a medio camino comprobando R4 (listado de PRs vía la API pública de GitHub).

Lo que encontré: el repo upstream tiene 7 PRs abiertos contra s5/start, todos de otros alumnos auditando sus propias ramas (auditoria-<nombre>), ninguno es de este usuario ni de esta rama (auditoria-mtg). No hay ningún PR propio que comprobar todavía.

Dado eso, el veredicto de R4 para esta unidad de trabajo es: no se puede comprobar con la información disponible — porque aún no se ha abierto ningún PR desde auditoria-mtg, así que no hay nada que contrastar sobre si el gh pr create y el pase del adversarial-reviewer ocurrieron una sola vez al final. No voy a tocar docs/auditoria/mtg.md; te dejo esto aquí en el chat como pediste.

¿Quieres que guarde algo de esto (p. ej. que existen PRs de otros compañeros en el mismo repo) en la memoria, o lo dejamos solo como respuesta puntual?
```
