# Prompts

Todos los prompts lanzados en el ejercicio del Módulo 8 (medición de la regla de documentación de `tasks`), en el orden
en que se lanzaron, copiados de los transcripts de las sesiones. Cada prompt abre una sesión nueva de Claude Code
desde `s8/start` limpio, en el repositorio `flowsync-m8`.

- Horas: hora local (UTC-5), del 3 de noviembre de 2026.
- Modo de permisos: `auto` en todas las sesiones.
- Versión de Claude Code: 2.1.312 en el Prompt 1 y 2.1.318 en el resto.
- Intentos que cuentan en la medición: los Prompts 1, 2, 6, 7 y 8 (Claude Sonnet 5.5). Los Prompts 3, 4 y 5 se lanzaron con
  un modelo distinto por error y quedan fuera del recuento. El detalle está en `docs/evals/rm.md`.
- Los Prompts 6, 7 y 8 se lanzaron con `claude --model claude-sonnet-5-5 "<contenido de encargo.txt>"`, para que el
  modelo y el texto fueran idénticos.
- Algunos mensajes posteriores (comprobaciones y reset de la lección) se pegaron por error dentro de la sesión del agente en
  lugar de en la terminal. Van como «Mensajes posteriores en la misma sesión», porque también se enviaron a Claude.

---

## Prompt 1

**Hora:** 21:53:24
**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** cuenta como intento 1. Control SÍ, Resultado SÍ.

Mensajes posteriores en la misma sesión (pegados después de que el agente ya había commiteado):

21:56:52

```
grep -n -i "DELETE" \
docs/capabilities/tasks/README.md

grep -n -i "delete" \
backend/start/routes.ts
```

21:57:18

```
git status -sb
git log -1 --oneline
```

21:57:42

```
git checkout -f s8/start
git reset --hard upstream/s8/start
git clean -fd
git status -sb
```

22:03:33

```
git status -sb
git branch --show-current
```

---

## Prompt 2

**Hora:** 22:05:14
**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** cuenta como intento 2. Control SÍ, Resultado SÍ.

Mensajes posteriores en la misma sesión (pegados después de que el agente ya había commiteado):

22:08:27

```
grep -n -i "DELETE" docs/capabilities/tasks/README.md

grep -n "router.delete" backend/start/routes.ts

git status -sb

git log -1 --oneline
```

22:09:14

```
grep -n -i "DELETE" docs/capabilities/tasks/README.md
grep -n "router.delete" backend/start/routes.ts
git status -sb
git log -1 --oneline
```

22:10:33

```
git checkout -f s8/start
git reset --hard upstream/s8/start
git clean -fd
git status -sb
```

---

## Prompt 3

**Hora:** 22:15:41
**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** fuera del recuento: la sesión se lanzó sin fijar el modelo (Opus 5.5 en lugar de Sonnet 5.5) y el prompt llegó sin las comillas invertidas. Control SÍ, Resultado SÍ.

---

## Prompt 4

**Hora:** 22:30:29
**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** fuera del recuento, por el mismo motivo que el Prompt 3. Control SÍ, Resultado SÍ.

Mensaje posterior en la misma sesión (pegado después de que el agente ya había commiteado):

22:37:11

```
grep -n -i "DELETE" docs/capabilities/tasks/README.md
grep -n "router.delete" backend/start/routes.ts
git status -sb
git log -1 --oneline
git branch --show-current
```

---

## Prompt 5

**Hora:** 22:51:32
**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
 una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya
  existe y declara su ruta junto a las demás de tasks.Añade a la capability
  tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve
  204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su
  ruta junto a las demás de tasks.
```

**Qué salió:** fuera del recuento: modelo equivocado (Opus 5.5) y el texto se pegó desordenado, con un fragmento duplicado al principio. Control SÍ, Resultado SÍ.

Mensaje posterior en la misma sesión (pegado después de que el agente ya había commiteado):

23:09:26

```
grep -n "router.delete" backend/start/routes.ts
grep -n -i "DELETE" docs/capabilities/tasks/README.md
git status -sb
git log -1 --oneline
git branch --show-current
```

---

## Prompt 6

**Hora:** 23:17:47
**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** cuenta como intento 3 (repetición de los Prompts 3 a 5 con el modelo correcto). Control SÍ, Resultado SÍ.

---

## Prompt 7

**Hora:** 23:21:25
**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** cuenta como intento 4. Control SÍ, Resultado SÍ.

---

## Prompt 8

**Hora:** 23:26:43
**Modelo:** Claude Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** cuenta como intento 5. Control SÍ, Resultado SÍ.
