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

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Actuando como experto de seguridad en desarrollo de software
Genera el imventario de lo que es dato personal o secreto en este proyecto, y de qué lee el agente para trabajar aquí. Tres listas:
1. - Datos personales: las tablas y columnas que guardan datos de una persona identificable (que lo lea en las migraciones, no que lo suponga) y los ficheros con ejemplos de correos o nombres
2. - Secretos: los ficheros que llevan o pueden llevar claves, tokens o contraseñas, estén o no en el repositorio
3. - Informacion que consulta el agente: que has leido o leeria por defecto cualquier agente ara hacer un cambio en el backend (el fichero de instrucciones del repositorio, la configuración del harness, los ficheros de entorno, la base de datos local), diciendo de cada uno si su contenido sale de tu máquina cuando trabaja contigo.
No camibies nada en el proyecto, salvo el fichero prompt.md, que es donde se escribe este prompt siguiendo el formato propuesto en el fichero
```

**Qué salió:** inventario en tres listas sacado de las migraciones y de los ficheros; leyó del `.env` solo los nombres de las variables y de la BD solo recuentos. El prompt dice `prompt.md`, pero el fichero es `prompts.md`.
