# Prompts

**Modelo:** Claude Opus 5 · **Herramienta:** Claude Code (app de escritorio) para preparar el
entorno, decidir el método y redactar la entrega; **Claude Code en modo `--print`** para los cinco
intentos medidos, que es donde importa.

> Los cinco intentos se lanzaron con **el mismo prompt, carácter por carácter**, en **sesión nueva**
> cada uno, y **sin recordarle la regla al agente**. Por eso aquí solo hay un prompt de medición:
> repetirlo cinco veces es el ejercicio.

---

## Prompt 1 — el encargo medido, enviado cinco veces sin variar

**Modelo:** Claude Opus 5
**Herramienta:** Claude Code, modo `--print` (sesión nueva por intento)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

Comando exacto, desde la raíz del proyecto —donde está `CLAUDE.md`—, una vez por intento:

```bash
claude -p "$(cat encargo.txt)" --allowed-tools "Read,Write,Edit,Glob,Grep,Bash" --model opus
```

**Qué salió:** los cinco declararon la ruta y los cinco actualizaron el README. **5 de 5.**
Duraciones: 4m46s · 4m28s · 6m21s · 4m32s · 5m58s.

> ⚠️ **El encargo se guardó en un archivo fuera del repositorio y se leyó con `cat`.** No es
> cosmético: `git clean -fd` entre intentos **habría borrado el archivo** si lo hubiera dejado
> dentro, y a partir del segundo intento habría estado mandando una cadena vacía sin enterarme.

---

## Los prompts de la conversación que decidieron el ejercicio

**Modelo:** Claude Opus 5 · **Herramienta:** Claude Code (app de escritorio)

```
vamos por la siguiente lección
```

**Qué salió:** antes de abrir ninguna lección, el agente fue **primero al enunciado del ejercicio**
—hábito que viene de haber llegado tarde al del M2— y encontró que **el plazo era ese mismo día**.
Eso cambió el orden de todo lo demás.

```
sí, arranca el ejercicio
```

**Qué salió:** las dos lecciones que el propio enunciado marca como prioritarias *(«una regla
escrita no es una regla cumplida»* y *«sin línea base, un número no significa nada»)* se leyeron
**antes** de escribir la predicción. Las otras tres quedaron para después, como sugiere el
enunciado.

---

## Tres cosas que no fueron prompts y cambiaron el resultado

### 1 · Escribir la predicción con un fundamento, no con un número

Antes del primer intento anoté **2 de 5** y, con ella, **por qué**: la regla está en la línea
**134 de 135** de `CLAUDE.md`, es la cola de una frase larga y condicional, y el encargo está
redactado en clave de implementación pura.

> 🎯 **Sin el fundamento escrito, el fallo no habría enseñado nada.** Salió 5 de 5, y lo útil no es
> saber que fallé por tres: es saber **qué creencia falló** —que estar al final del archivo resta
> cumplimiento— y que esa creencia no tenía ningún dato detrás.

### 2 · Poner una guarda en el reset, en vez de confiar en los tres comandos

El enunciado avisa de que `git restore .` no basta. Monté el reset con una comprobación que
**aborta sin lanzar el intento** si el árbol no está limpio:

```bash
git checkout -f s8/start
git reset --hard espejo/s8/start
git clean -fd
ST=$(git status --porcelain); if [ -n "$ST" ]; then echo "ABORTADO"; exit 1; fi
```

No llegó a saltar ninguna vez, y por eso vale: **sé que los cinco partieron del mismo estado
porque lo comprobé, no porque ejecuté los comandos.** *(`espejo` es el remoto que apunta a
`LIDR-academy-temp`; el `upstream` de este clon apunta al repo original, que está caído.)*

### 3 · Leer los archivos en vez de creerle al agente

Los cinco intentos **afirmaron** haber actualizado el README. Eso no es el dato: el dato es el
`grep`. Comprobé las dos condiciones en los archivos, una por intento, antes de resetear.

> Es la misma lección que el M7, donde el agente dijo haber cargado unas reglas y los marcadores
> decían otra cosa. **Aquí coincidieron las cinco veces — pero eso solo se sabe mirando.**

---

## Lo que delató el archivo esta vez

En el M5 el hallazgo fue que **dos de mis cinco palabras estaban mal**. En el M6, que **el entorno
costó diez veces más que la tarea**. En el M7, que **recortar el alcance fue el prompt**. Este:

> ### El prompt no varió ni una coma, y los cinco resultados fueron distintos.

Mismo encargo, mismo modelo, mismo punto de partida: **cinco nombres de rama distintos, dos nombres
de archivo de test, de 3 a 5 menciones en el README, 42 % de diferencia entre el intento más rápido
y el más lento, y uno que contestó en inglés.**

Los cinco cuentan como «cumple» porque mi comprobación es binaria. **La comprobación binaria es lo
que hace medible la regla, y es también lo que tira a la basura todo lo demás que varió.**

Y lo que de verdad encontré no estaba en la tabla: **el enunciado dice que las ramas `feat/…` que
deja cada intento no interfieren, y el intento 2 escribió que ya le habían dicho lo del README,
citando la rama del intento 1.** El árbol estaba limpio las cinco veces. **`git branch` no se
limpia, y el contexto del agente no son solo los archivos.**
