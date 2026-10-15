# Prompts

**Modelo:** Claude Opus 5 · **Herramienta:** Claude Code (app de escritorio) en todos.

> Trabajo en una conversación continua, así que los prompts son cortos porque el contexto ya está
> puesto. Los pego tal cual, incluidos los que obligaron a rehacer el trabajo.

---

## Prompt 1

```
vamos con el modulo 5
```

**Qué salió:** el agente fue **primero a la lección del ejercicio**, no a la teoría — hábito que
viene de haber llegado tarde al del M2. Encontró que **el plazo era ese mismo día**, y de paso que
**el repositorio del curso había dejado de resolver** (404 por nombre, por ID, autenticado y sin
autenticar).

---

## Prompt 2

```
primero lee los demas y luego el ejercicio
```

---

## Prompt 3 — **el que corrigió al agente**

```
no los veo marcados como completados
```

**Qué salió:** había leído las cuatro lecciones **sin marcarlas en la plataforma** y **sin añadir el
módulo a mi índice** — dos cosas que venía haciendo en los módulos anteriores.

> 🔑 **Cinco palabras que destaparon un incumplimiento de proceso**, que es exactamente de lo que va
> el ejercicio de hoy. **La diferencia es que aquí había un humano mirando la pantalla.** Si nadie
> abre la plataforma, el estado habría quedado mal sin que saltara nada: **el fallo silencioso de
> la lección 1, ocurriéndome mientras la leía.**

---

## Prompt 4 — la expectativa

```
sí, sí, no, ni idea
```

Mi expectativa sobre las **cuatro reglas de `s4/start`**, anotada antes de mirar el historial.

---

## Prompt 5 — *(no es un prompt mío: es el aviso del curso)*

```
Hemos creado un repo espejo para que podaís hacer la entrega y ver la solución de este modulo
https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1/tree/s4/start
```

**Qué salió, y es lo que rompió el ejercicio:** al comparar el `CLAUDE.md` del espejo, el agente
descubrió que **`s5/start` no trae las 4 reglas de `s4/start`, sino 5 reescritas** — las que el
mentor editó en vivo durante la S4, más una nueva sobre el OpenAPI.

**La auditoría entera estaba hecha contra las reglas equivocadas.** Hubo que rehacerla.

---

## Prompt 6 — la expectativa que faltaba

```
ni idea
```

Sobre la regla 3, la única nueva. Las otras cuatro palabras del prompt 4 se remapearon a las reglas
nuevas, **y el mapeo quedó escrito en el entregable** para que se vea de dónde sale cada una.

---

## Lo que delató el archivo esta vez

**Tres entregas, tres hallazgos distintos sobre mis propios prompts:**
en el M3, que **el prompt que hacía el trabajo era el enunciado**; en el M4, que **el orden en que
pedí las cosas valió más que lo que pedí**. Este:

> ### Mi aportación fueron cinco palabras repartidas en dos prompts, y dos de ellas estaban mal.

«sí» a la regla 1 y «no» a la regla 4. **Las dos resultaron ser «no se puede comprobar»** — tuve una
opinión donde no había evidencia, en las dos direcciones. **Las únicas dos que acerté son las dos
en las que dije «ni idea».**

Y eso **no es un problema del prompt: es el ejercicio funcionando.** La parte B pide la distancia
entre lo que creías y lo que hay. **Un prompt mejor habría producido la misma tabla y habría
destruido el dato**, porque el dato es mi error.

**El prompt 5 merece su propia nota** porque no lo escribí yo y es el que más cambió el resultado:
un mensaje del curso con un enlace. Sin abrirlo y comparar los dos `CLAUDE.md`, habría entregado
una auditoría impecable **de unas reglas que ya no existen en la rama del ejercicio**.
