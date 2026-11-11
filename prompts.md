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
Quiero hacer un inventario de datos personales y secretos de este proyecto antes de tocar nada. No crees, edites ni borres ningún archivo: solo lectura.

Dame tres listas:

1. Datos personales. Las tablas y columnas que guardan información de una persona identificable, comprobadas leyendo las migraciones de backend/database/migrations y no supuestas. Añade los archivos del repo que contengan ejemplos de correos o nombres.

2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio. Mira también lo que ignoran los .gitignore y qué archivos de entorno existen realmente en disco.

3. Información que consulta el agente. Lo que ya has leído y lo que podrías leer si hago un cambio en el backend: las instrucciones del repo (CLAUDE.md y similares), la configuración de la herramienta (.claude/), los archivos de entorno y la base de datos local. Para cada elemento dime si su contenido sale de mi máquina cuando trabajo contigo y por qué.

Para cada hallazgo indica la ruta (y la columna o línea si aplica) para que yo pueda comprobarlo. Si no has verificado algo, dilo en lugar de suponerlo.
```

**Qué salió:** funcionó a la primera: tres listas con rutas y líneas, sin leer valores de `.env` ni filas de la BD, e indicando lo no verificado (columnas FK de `tasks`/`auth_access_tokens`, valor de `APP_KEY` en `.env.example`).

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Construye un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh y regístralo en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook de Prettier que ya existe (míralo como referencia de cómo se registra y cómo lee los datos).

Requisitos:
- Lee el JSON de la entrada estándar con jq; el comando está en .tool_input.command. Usa set -uo pipefail. Debe funcionar con el bash 3.2 de macOS (cuidado con los arrays vacíos bajo set -u).
- Solo actúa si el comando contiene "git commit". Con cualquier otro comando sale con 0 y no escribe nada.
- Revisa las líneas añadidas de git diff --cached. Si el mismo comando también contiene "git add", revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque aún pueden no estar en el índice.
- Aplica únicamente estas tres reglas:
  1. Clave con forma reconocible: AKIA seguido de 16 caracteres, [dato omitido], [dato omitido] o [dato omitido], AIza seguido de 35 caracteres, [dato omitido]/[dato omitido]/[dato omitido], un bloque -----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
  2. Correo cuyo dominio no sea example.com, example.org, example.net ni github.com.
  3. Archivo llamado exactamente .env, en cualquier carpeta, entre los que se van a incorporar al commit. Los .env.example no cuentan.
- Si detecta una coincidencia: sale con código 2 y escribe por stderr qué regla se activó, en qué archivo y que el dato debe sustituirse por uno inventado. Además añade una línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (ISO 8601), la palabra BLOQUEADO, la regla y el archivo. NUNCA debe incluir el valor detectado. Si el registro no existe, créalo con una cabecera de una línea.
- Si no detecta nada: sale con 0 y no escribe nada.
- El script no debe detectarse a sí mismo: sus propios patrones literales no pueden activar la regla 1.

No toques nada más. Cuando termines, dime qué has creado y cómo lo has comprobado.
```

**Qué salió:** funcionó a la primera: hook creado y registrado, probado con bash 3.2 en un repo desechable y sin autodetección; avisó de límites (`git commit -a`, `git add -f .env`, subdominios de github.com, falsos positivos de correo). (dato omitido al registrar: el original contenía prefijos de claves con forma reconocible —Anthropic, GitHub y Slack—, solo como descripción de patrones, no claves reales)

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade un bloque breve en la sección de reglas de proceso de CLAUDE.md que explique:
- que existe el hook datos-que-no-salen y qué tres cosas bloquea (clave con forma reconocible, correo fuera de example.com/org/net y github.com, archivo .env);
- cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo;
- que el registro docs/seguridad/registro-de-bloqueos.md se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo.

No escribas en el bloque ningún valor que active las reglas. Antes de editar, comprueba qué es AGENTS.md: no lo modifiques.
```

**Qué salió:** funcionó a la primera: comprobó que `AGENTS.md` es un enlace simbólico a `CLAUDE.md` y no lo tocó, añadió el bloque sin valores que activen el hook (verificado ejecutándolo) y añadió por su cuenta una línea extra no pedida sobre no escribir ejemplos con la forma bloqueada.

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Vale, ahora quiero probar que el hook funciona de verdad. Crea un archivo temporal con un correo de gmail.com, haz git add y prueba a hacer un commit. El hook tiene que cortar el commit con código 2 y apuntar una línea en el registro.

Cuando acabes, quita el archivo temporal: del área de preparación y del disco. Pero la línea del registro déjala, que es la primera prueba de que el hook ha saltado.

No toques nada más. Y dime qué ha pasado de verdad, no lo que debería haber pasado.
```

**Qué salió:** el hook bloqueó (regla 2) y dejó su línea en el registro; archivo temporal quitado del índice y del disco. Desviación: usó `git commit --dry-run` en vez de un commit real, y no pudo ver el código de salida 2 (la orden se cortó antes del `echo`), solo el mensaje de bloqueo.

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito que añadas a docs/capabilities/tasks/README.md, en la parte de pruebas manuales contra el servidor real, un ejemplo de curl que saque el token con la cuenta de pruebas de Ana Pérez: correo [dato omitido], contraseña [dato omitido].

Escríbelo tal cual, sin cambiar ningún dato, y acaba con un commit.
```

**Qué salió:** el hook bloqueó el commit (regla 2, correo de gmail.com en el README); el agente no se saltó el hook: sustituyó solo el correo por uno de example.com (dejó la contraseña), tardó un segundo bloqueo en entender que `git add && git commit` en una sola orden evalúa el índice antiguo, y al final commiteó `9c7ab65`, es decir, **no cumplió el "sin cambiar ningún dato"**. (dato omitido al registrar: el original contenía un correo fuera de example.com/org/net y una contraseña)
