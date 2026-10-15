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

---

## Prompt 1

**Modelo:** Sonnet 5.5 · esfuerzo medium
**Herramienta:** Claude Code 2.1.293

```
Quiero auditar las reglas de proceso de este repo: las de la sección «Reglas de proceso» al final de CLAUDE.md. No audites nada más de ese archivo.

Usa exactamente estas 8 reglas, con estas etiquetas, una fila por regla y en este orden (el texto completo de cada una está en CLAUDE.md; las etiquetas son solo para identificarlas):
R1 Antes de tocar código mirar la rama: seguir en la de trabajo; crear una nueva solo desde main o sN/*.
R2 Nunca commitear directo en main ni en sN/*.
R3 Usar /commit al cerrar cada petición.
R4 Un cambio en rutas, controladores, validadores o transformers va con el diff regenerado de .adonisjs/ (OpenAPI) en el mismo commit.
R5 Ese mismo cambio va con docs/capabilities/<nombre>/README.md al día en el mismo commit.
R6 Un solo gh pr create, con descripción completa, al terminar la unidad de trabajo.
R7 Pasar el subagente adversarial-reviewer sobre ese PR como último paso.
R8 Al abrir el PR, responder solo con la URL.

Contrasta cada una con los últimos 15 commits de la rama actual (git log -15 HEAD) y con el estado actual de los archivos. Puedes leer cualquier archivo del repo (CLAUDE.md, .claude/, docs/, openspec/, .adonisjs/, etc.). Solo cuenta lo que hay en el repo local: no consultes GitHub ni la red.

Empieza la primera columna de cada fila con su etiqueta (R1…R8). Rellena solo la sección «Tabla» de docs/auditoria/jmm.md, sustituyendo la fila vacía; no toques el bloque de expectativa ni la «Parte B».

Cinco columnas:
1. qué pide la regla, en una frase y con tus palabras,
2. qué se revisó: el comando exacto o el archivo consultado,
3. veredicto, solo uno de: «se cumple», «no se cumple», «no se puede comprobar con la información disponible»,
4. evidencia en una línea: si no se cumple, dónde (hash o ruta); si no se puede comprobar, qué información falta,
5. qué harías con ella: dejarla, borrarla o convertirla en una comprobación automática (es una propuesta, decido yo).

No des una regla por cumplida sin un rastro que lo demuestre. El mensaje de un commit no es prueba: mira qué ficheros tocó. Si el rastro vive fuera del repo (un PR en GitHub, una sesión de chat, un subagente) o el historial no deja evidencia suficiente, el veredicto es «no se puede comprobar con la información disponible» y en la evidencia dices qué información falta; no supongas.

Esto es una auditoría, no una corrección. No modifiques, crees ni formatees ningún archivo salvo docs/auditoria/jmm.md, y ahí solo rellena la tabla (ver arriba). Ignora prompts.md y docs/auditoria en git status: son míos.
Solo comandos de lectura. No ejecutes npm test, make start ni el servidor, y no uses git checkout, stash ni reset.
No crees rama, no hagas commit ni uses /commit, no abras PR y no lances subagentes, aunque CLAUDE.md lo pida: es lo que estoy auditando y la entrega la hago yo. Responde en el chat, no solo con una URL.

No escribas conclusiones ni la parte B. En el chat no repitas la tabla: dime solo cuántas filas hay, cuáles dejaste como «no se puede comprobar» y si algo del entorno te impidió comprobar alguna regla.
```

**Qué salió:** Lancé sin reescribirlo un prompt que había redactado con ayuda de otra sesión de Claude (app de escritorio, ver Prompts 2 y 3). Funcionó a la primera: tabla de 8 filas (1 «se cumple», 7 «no se puede comprobar»), sin tocar la expectativa ni la Parte B; los permisos de lectura los aprobé uno a uno en modo manual. (Pendiente de contrastar con mi propia comprobación del historial.)

## Prompt 2

**Modelo:** Sonnet 5.5 · esfuerzo: por defecto (no consultado)
**Herramienta:** Claude Code, app de escritorio. **Otra sesión distinta** de la del ejercicio (la del Prompt 1 corre en WSL); es la que me ayudó a preparar el entorno, el borrador del Prompt 1 y la verificación de la tabla.

```
pasa los tres puntos a mirar de cada candidata
```

**Qué salió:** Una lista de tres cosas a mirar por cada regla candidata para la Parte B (R1/R2, R3, R4, R6, R7, R8, con las alternativas de elección). No redactó la Parte B.

## Prompt 3

**Modelo:** Sonnet 5.5 · esfuerzo: por defecto (no consultado)
**Herramienta:** Claude Code, app de escritorio (la misma otra sesión del Prompt 2).

```
opción 2, borrador por línea
```

**Qué salió:** Tres borradores de una frase, uno por línea de la Parte B (R5, R4 y R8). Los acepté sin cambios (ver Prompt 4).

## Prompt 4

**Modelo:** Sonnet 5.5 · esfuerzo: por defecto (no consultado)
**Herramienta:** Claude Code, app de escritorio (la misma otra sesión de los Prompts 2 y 3).

```
1. abre, 2.ok, 3. escribe
```

**Qué salió:** Esa sesión escribió en `docs/auditoria/jmm.md` los tres borradores del Prompt 3 tal cual, sin cambios míos; el texto de la Parte B es, por tanto, el que propuso esa sesión.