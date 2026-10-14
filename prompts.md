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
Quiero realizar la auditoría de las reglas de proceso de CLAUDE.md requerida por el ejercicio del módulo 5.

Analiza exclusivamente las reglas de la sección "Reglas de proceso" de CLAUDE.md y contrástalas con:

- los últimos 15 commits del repositorio;
- el estado actual de los archivos cuando sea necesario.

Esto es una auditoría, no una tarea de corrección.

No modifiques ningún archivo.
No hagas commits.
No crees ramas.
No corrijas ningún incumplimiento que encuentres.

Trata cada uno de los cinco puntos de "Reglas de proceso" como una regla independiente.

Para cada regla necesito:

1. Qué exige, resumido en una sola frase.
2. Qué comandos Git o archivos concretos has revisado para comprobarla.
3. Uno y solo uno de estos veredictos:
   - se cumple
   - no se cumple
   - no se puede comprobar con la información disponible
4. Una línea de evidencia que justifique el veredicto.
   - Si no se cumple, indica exactamente dónde observas el incumplimiento.
   - Si no se puede comprobar, indica qué información falta.
5. Qué harías con la regla, eligiendo únicamente:
   - dejarla
   - borrarla
   - convertirla en una comprobación automática

No infieras como hecho algo que Git o los archivos no permitan demostrar.

Es especialmente importante distinguir entre:
- que una regla no sea determinista;
- y que exista evidencia de que se ha incumplido.

Que una regla sea frágil o dependa del modelo no implica por sí mismo que "no se cumple".

No escribas todavía el resultado en ningún archivo. Muéstrame primero el análisis y los comandos/evidencias utilizados para que pueda verificarlos manualmente.
```

**Qué salió:** funcionó a la primera, aunque voy a verificar manualmente la regla 3 porque el agente concluyó que se cumple pese a que el commit analizado no incluye cambios en .adonisjs/.


---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
XXX
```

**Qué salió:** refinó las decisiones sin cambiar los veredictos y separó, para cada regla, la parte automatizable de la que sigue requiriendo criterio. Lo único que ha faltado ha sido que lo plasme tras su revisión bajo la tabla Parte A.2.


---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
De acuerdo. Aplica exactamente esas cinco redacciones a la columna `Qué harías con ella` de `docs/auditoria/fr.md`.

No modifiques ninguna otra parte del archivo ni ningún otro archivo del repositorio.

Después muéstrame el diff resultante.
```

**Qué salió:** actualizó únicamente la columna Qué harías con ella y mostró el diff para verificar que no había alterado el resto de la auditoría
