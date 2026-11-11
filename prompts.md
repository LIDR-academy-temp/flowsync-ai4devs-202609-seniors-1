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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Identifica los datos personales de este repo. SOLO LEE, NO MODIFIQUES NINGUNA ARCHIVO.
Saca estas tres listas:
1. Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.
2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).
3. Información que consulta el agente. Lo que ha leído y lo que podría leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debe indicar si su contenido sale de tu máquina cuando trabaja contigo.
```

**Qué salió:** funcionó a la primera, sin modificar nada. Datos personales: `users.full_name`, `email`, `password` y fechas; `auth_access_tokens` (de quién es cada token y su uso); `tasks.assignee_id` y `title`. Ejemplos en los tests, las docs y la spec (Ada Lovelace, `@example.com`), y en `README.md:143` (Ana Pérez, `@gmail.com`, `secreto123`). Secretos: `backend/.env` (ignorado, con `APP_KEY` relleno), `db.sqlite3` (vacía), contraseñas de prueba escritas tal cual, y un `.env.production` que Git no ignoraría. De los `.env` solo leyó nombres de clave y de la BD solo recuentos, así que sus valores no salieron de la máquina; lo demás que leyó (`CLAUDE.md`, migraciones, settings, resultados de `grep`) sí.
