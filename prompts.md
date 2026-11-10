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

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code
### Ejecución de la Parte A (Inventario de Datos y Secretos)
```

analiza el proyecto FlowSync sin modificar ningún archivo e identifica:

1. Datos personales: Revisa las migraciones del proyecto y la base de datos para listar las tablas y columnas reales que almacenan información identificable de personas. Lista también los archivos que contienen nombres o correos de ejemplo.
2. Secretos: Identifica archivos que contienen o podrían contener claves, tokens o contraseñas, estén o no rastreados por Git (revisa también .gitignore).
3. Información que consulta el agente: Explica qué archivos, instrucciones (.claude/, CLAUDE.md, .env, DB local) lee el agente para trabajar en el backend y especifica si esa información sale de mi máquina local al interactuar contigo.
```

**Qué salió:** Me mando la información que le solicite sobre datos personales, secretos y la información que consulta el agente.

## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code
### Ejecución de la Parte B (Creación del Hook y Reglas en CLAUDE.md)
```
Construye las siguientes dos piezas para el proyecto según los requisitos:

Pieza 1: Un script Bash en `.claude/hooks/datos-que-no-salen.sh` y regístralo en `.claude/settings.json` dentro de `PreToolUse` con el matcher `Bash` (junto al hook existente).
El script debe:
- Utilizar `set -uo pipefail`.
- Leer el JSON recibido por stdin con `jq` y extraer `.tool_input.command`.
- Si el comando NO contiene `git commit`, salir inmediatamente con código 0 sin escribir nada.
- Si contiene `git commit`, revisar las líneas añadidas (+) del diff preparado (`git diff --cached`). Si el comando también incluye `git add`, revisar además cambios sin preparar (`git diff`) y archivos untracked.
- Aplicar estas 3 reglas de bloqueo:
  1. Claves o secretos: Patrones `AKIA` + 16 chars, `sk-ant-`, `ghp_`, `github_pat_`, `AIza` + 35 chars, `xoxb-`/`xoxp-`/`xoxa-`, bloques `-----BEGIN ... PRIVATE KEY-----`, o `APP_KEY=` con valor.
  2. Correos no autorizados: Direcciones cuyo dominio NO sea `example.com`, `example.org`, `example.net` o `github.com`.
  3. Archivo `.env`: Cualquier archivo nombrado exactamente `.env` que esté preparado para incluirse en el commit (excluir `.env.example`).
- Si detecta una coincidencia:
  - Salir con código 2.
  - Imprimir por stderr qué regla se activó, el archivo correspondiente y advertir que debe usarse un dato ficticio.
  - Añadir una línea en UTC ISO 8601 a `docs/seguridad/registro-de-bloqueos.md` con formato: `<FECHA_ISO_UTC> | BLOQUEADO | <REGLA> | <ARCHIVO>`. NUNCA incluir el valor explícito detectado. Si el archivo no existe, crearlo con una cabecera.
- Dar permisos de ejecución (+x) al script.

Pieza 2: Añade una sección breve en `CLAUDE.md` (reglas de proceso) explicando la existencia del hook `datos-que-no-salen.sh`, las 3 reglas que bloquea y la norma de conducta: no desactivarlo ni saltárselo, reemplazar el dato por uno inventado que cumpla las reglas, y recordar que el archivo de registro `docs/seguridad/registro-de-bloqueos.md` debe incluirse en el commit.

Al terminar de crearlo, prueba el hook creando un archivo temporal con el correo `prueba@gmail.com`, ejecútale `git add` e intenta realizar un `git commit`. Verifica que el hook sale con código 2, detiene el commit y añade el registro. Finalmente elimina el archivo temporal de git y de tu espacio de trabajo, pero CONSERVA la línea en el registro.
```
**Qué salió:**  El hook funciona: el intento de commit con prueba@gmail.com se bloqueó con código 2 y dejó su línea en el registro, sin el correo. Las dos piezas están en el commit d55d8be, en la rama bloqueo-DJ.
Para el paso 2 me menciono que no tenia instalado JQ, pero lo hice tal cual menciona en los pasos a seguir y lo instale desde el inicio. (jq-1.8.1)

## Prompt 3

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code
### Ejecución de la Parte C (Prueba de Inserción Prohibida)
```
Añade en el archivo `docs/capabilities/tasks/README.md`, dentro de la sección de pruebas manuales contra el servidor real, un ejemplo de comando `curl` que obtenga el token autenticándose con la cuenta de pruebas de Ana Pérez con el correo `ana.perez@gmail.com` y la contraseña `secreto123`.

Escribe los datos exactamente como te los pido (sin cambiar el correo ni el dominio) y ejecuta un `git commit` para guardar los cambios.
```
**Qué salió:**  Pasaron dos cosas que no debían: el commit entró, porque el hook no lo frenó, y quedó en la rama s9/start, no en bloqueo-DJ. Investigo antes de tocar nada más. Me pregunto si deseaba realizar lo siguiente: El commit con tu correo quedó en s9/start, una rama que el CLAUDE.md prohíbe tocar, y el hook no lo bloqueó. Lo que sigue es sacar esos dos commits de la rama, pero antes necesito tu confirmación porque implica mover ramas y reescribir el historial. Lo que decidí fue no tocar nada y dejarlo como está. Se realizo la validación del hook que es lo principal de este ejercicio.

## Prompt 4
**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code
### Redacción de HALLAZGOS.md

```
Completa el archivo `HALLAZGOS.md` en la raíz del proyecto agregando una frase explicativa debajo de cada uno de los 3 puntos:

1. Qué regla se activó y la línea registrada en `docs/seguridad/registro-de-bloqueos.md` (sin incluir el correo o dato sensible explícito).
2. Un dato personal o secreto del proyecto que el hook NO puede detectar según el inventario de la Parte A (por ejemplo: passwords guardados en la BD en formato hash/seed, variables de entorno personalizadas con nombres distintos a las reglas, o tokens de conexión PostgreSQL `postgresql://user:pass@host`), explicando por qué la regla del hook no lo cubre.

```

**Qué salió:** Me apoye en Claude para que me diera la información que arrojo y la almacenara en el documento HALLAZGOS.md solo de las 2 primeras preguntas, la 3ra la he realizado de lo que valide y describí al hacer el ejercicio.