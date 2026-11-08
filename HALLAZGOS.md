# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó
```
PreToolUse:Bash hook error: [command hook]: Commit bloqueado por .claude/hooks/datos-que-no-salen.sh:
  
  - regla 2 (correo de un dominio que no es de ejemplo) en docs/capabilities/tasks/README.md

Sustituye el dato señalado por uno inventado (un .env, déjalo fuera del commit) y vuelve a intentarlo.
```

El agente negó antes del commit pero fue a raíz del hook; no por left overs de la parte B.

-

## 2. Lo que el hook no puede cazar

El nombre completo de una persona (columna `users.full_name` de la tabla users): si un nombre real entra en un test, un ejemplo de la documentación o el título de una tarea, el hook no lo para, porque ninguna de sus tres reglas busca nombres. Solo detecta claves con forma conocida, correos de dominios que no son de ejemplo y ficheros .env, y un nombre no tiene una forma que se pueda reconocer mirando solo el texto.

-

## 3. Tu duda

Dudé de cómo funcionan las sesiones, no del hook: hice la prueba en la misma sesión en la que lo creé, pensando que haría falta abrir una nueva para que se cargara, y se cargó y funcionó a la primera. El propio agente esperaba lo mismo que yo y también se equivocó. No comprobé por qué se recargó sin reiniciar.

-
