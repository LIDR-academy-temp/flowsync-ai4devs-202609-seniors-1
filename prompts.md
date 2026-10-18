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
fíjate en el archivo `prompts.md`. Quiero que guardes ahí cada prompt que te vaya pidiendo en esta sesión. También quiero que escribas el
  resultado de la petición que te haga cada vez. Incluye este prompt también. Tienes las instrucciones y un ejemplo de cómo hacer las anotaciones
```

**Qué salió:** funcionó a la primera: borré el ejemplo, registré este prompt tal cual y dejé el formato listo (un `## Prompt N` por petición, con modelo, herramienta y "Qué salió") para las siguientes.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
asegúrate que tienes acceso a los últimos commits
```

**Qué salió:** `git fetch origin` funciona y no hay nada nuevo que traer; `upstream` (LIDR-academy) falla por permisos SSH. La rama `auditoria-amj` no tiene upstream configurado y `origin/main` es un `Initial commit` sin ancestro común con HEAD.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
contrasta las reglas con los últimos 15 commits del repositorio y el estado actual de los archivos del proyecto. Guarda el resultado en `docs/auditoria/amj.md`, no en el chat.



Usa una fila por regla y completa estas cinco columnas:

Qué pide la regla. Resúmela en una frase y con tus propias palabras. Si necesitas varias frases, puede que estés mezclando más de una regla.

Qué se revisó para comprobarla. Indica el comando ejecutado o el archivo consultado. Sin esta información no hay forma de saber en qué se apoya el veredicto.

Veredicto. Solo puede ser se cumple, no se cumple o no se puede comprobar con la información disponible. Este último caso también es un resultado válido. Significa que la regla no deja suficiente evidencia para verificarla.

Evidencia. Escríbela en una línea. Si la regla no se cumple, indica dónde se incumple. Si no se puede comprobar, explica qué información falta.

Qué harías con ella. Elige una opción: dejarla, borrarla o convertirla en una comprobación automática.


No modifiques ningún archivo salvo `docs/auditoria/amj.md`. El objetivo es tener una auditoría. NO arreglar nada que no se haya cumplido creas que pueda estar mal.
```

**Qué salió:** `docs/auditoria/amj.md` con 42 reglas: 31 se cumplen, 4 no (tests de `tasks` sí existen, `logout` y `GET /` sin `serialize()`, tabla de rutas obsoleta, un import relativo) y 7 no comprobables. Commit `4326869`. No actualicé `prompts.md` en esa petición por la restricción de "no modifiques ningún archivo salvo"; el usuario pidió después añadirlos siempre.

---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
los prompts añadelos siempre. Mete todos los que no hayas metido incluyendo este
```

**Qué salió:** añadidos los Prompts 3 y 4 que faltaban. Desde ahora `prompts.md` se actualiza en cada petición, también cuando otra instrucción limita los archivos a tocar.

---

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
cómo aplicaría sobre main los cambios de este diff? ~/Downloads/main-s5..start.diff
```

**Qué salió:** respuesta explicando cómo aplicarlo, sin aplicar nada. El diff es `main` → `s5/start` (141 archivos) y ambas ramas no comparten ancestro. Sobre `main` solo falla `frontend/src/assets/hero.png` (parche binario sin `--binary`); el resto no llegó a confirmarse porque la segunda comprobación se interrumpió por el clasificador de seguridad. Propuse tres vías: `git apply --exclude` + checkout del binario, `read-tree -u --reset s5/start`, o merge con `--allow-unrelated-histories`.

---

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
sólo quiero saber cómo aplicarlo. No que me apliques nada
```

**Qué salió:** respuesta corta con los comandos, sin ejecutar nada sobre el diff. Había mezclado la explicación con comprobaciones y ofrecido ejecutar; aquí solo el "cómo".

---

## Prompt 7

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
genera un script para crear la barra de estado con todo lo que tenemos configurado. La idea es compartirlo y que al ejecutarlo se configure el cluade de quien lo ejecute
```

**Qué salió:** `scripts/install-statusline.sh`: embebe la barra de `~/.claude/statusline-command.sh` (modelo, contexto, esfuerzo, coste, nº de prompts, límites de uso, ruta y git) y fija `statusLine` en `settings.json` del que lo ejecute, con copia previa y sin tocar otras claves. Quité el reenvío a Orca por ser personal. Probado solo con un HOME falso (instala, rinde la barra, es idempotente); no lo he ejecutado sobre tu `~/.claude`.

---

## Prompt 8

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
dame el path completo del script
```

**Qué salió:** `/Users/amartin/orca/workspaces/flowsync-ai4devs/auditoria-amj/scripts/install-statusline.sh`
