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
Antes de proceder NO modifiques ningún archivo ni hagas commits.

Necesito un inventario basado exclusivamente en evidencias del repositorio, dividido en tres listas:

1. DATOS PERSONALES: identifica las tablas y columnas que almacenen datos de personas identificadas o identificables, comprobándolo en las migraciones. Indica también los archivos que contienen ejemplos de nombres o direcciones de correo. Cita las rutas concretas.

2. SECRETOS: identifica los archivos que contienen o podrían contener claves, tokens o contraseñas. Revisa también los archivos ignorados por Git y los archivos de entorno. No muestres ni copies los valores de secretos.

3. INFORMACIÓN ACCESIBLE AL AGENTE: identifica qué archivos has leído realmente y qué podrías consultar al trabajar en el backend, incluyendo CLAUDE.md, .claude/settings.json, archivos de entorno y base de datos local. Diferencia lo efectivamente consultado de lo potencialmente accesible. Explica qué información puede salir de mi máquina al utilizar Claude Code y qué depende de su configuración; no afirmes que se haya transmitido algo si no puedes comprobarlo.

Para cada conclusión aporta la ruta o evidencia correspondiente. No ejecutes cambios, no reveles datos sensibles completos y presenta el inventario de forma estructurada.
```

**Qué salió:** Claude Code ha identificado datos personales en las tablas users, tasks y auth_access_tokens, incluyendo nombres, correos electrónicos, identificadores de usuario y relaciones entre usuarios y tareas.

También ha localizado posibles secretos y credenciales en backend/.env, en la base de datos SQLite local y en la configuración de integraciones.

Se ha comprobado manualmente que:

backend/.env contiene una APP_KEY con valor real y está ignorado por Git.

backend/.env.example contiene APP_KEY= sin valor y está versionado como plantilla.

El agente no ha leído los valores de esos archivos durante el inventario, según las operaciones que ha declarado.

El agente podría acceder a determinados archivos sensibles si sus permisos y configuración se lo permiten.

En mi caso tengo la configuración a nivel de `~/.claude/settings.json` global para que ni globalmente ni en modo sandbox pueda acceder a los `.env` en modo lectura, escritura o modificación.

Conclusión: existen datos y secretos potencialmente accesibles al agente. Que un archivo esté ignorado por Git no significa que Claude Code no pueda leerlo. No se ha comprobado ninguna filtración ni se han modificado archivos durante el inventario.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Vamos a implementar un hook, pero antes de modificar nada, revisa CLAUDE.md, .claude/settings.json y el hook existente de Prettier. Comprueba qué es AGENTS.md, pero no lo modifiques.

PIEZA 1:
Crea .claude/hooks/datos-que-no-salen.sh y regístralo en .claude/settings.json como PreToolUse con matcher Bash, conservando el hook existente.

Requisitos:
- Utiliza Bash con set -uo pipefail.
- Lee el JSON recibido por stdin mediante jq y extrae .tool_input.command.
- Si el comando no contiene git commit, termina con exit 0 sin escribir nada.
- Si contiene git commit, revisa las líneas añadidas de git diff --cached.
- Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento.

Aplica únicamente tres reglas:
1. Secretos: AKIA seguido de 16 caracteres, sk-ant-, ghp_, github_pat_, AIza seguido de 35 caracteres, xoxb-, xoxp-, xoxa-, bloques BEGIN ... PRIVATE KEY y líneas APP_KEY= con valor.
2. Correos cuyo dominio no sea exactamente example.com, example.org, example.net o github.com.
3. Archivos llamados exactamente .env en cualquier carpeta. No bloquear .env.example por el nombre.

Ante una coincidencia:
- Bloquea la llamada con exit 2.
- Escribe en stderr la regla, la ruta y una indicación de sustituir el dato por uno inventado.
- Añade una entrada a docs/seguridad/registro-de-bloqueos.md con fecha y hora UTC ISO 8601, BLOQUEADO, regla y ruta.
- Si el registro no existe, créalo con una cabecera de una línea.
- Nunca copies el valor sensible detectado en el error ni en el registro.

Si no hay coincidencias, termina con exit 0 sin escribir nada.

PIEZA 2:
Añade un bloque breve a las reglas de proceso de CLAUDE.md que explique las tres reglas, que el hook no debe desactivarse ni eludirse, que hay que sustituir los datos bloqueados por valores ficticios permitidos y que el registro debe incorporarse al commit como evidencia.

No modifiques AGENTS.md ni las funcionalidades del backend o frontend. No leas ni muestres el valor real de APP_KEY de backend/.env.

Por ahora, implementa ambas piezas y explícame qué archivos has creado o modificado. No hagas todavía commits ni pruebas que los intenten.
```

**Qué salió:** Claude Code ha implementado las dos piezas solicitadas en la Parte B:

- Ha creado `.claude/hooks/datos-que-no-salen.sh` con las tres reglas de detección: secretos, correos de dominios no permitidos y archivos `.env`.
- Ha registrado el hook como `PreToolUse` para `Bash` en `.claude/settings.json`, manteniendo el hook existente de Prettier.
- Ha actualizado `CLAUDE.md` con las instrucciones para actuar ante un bloqueo, sin modificar directamente `AGENTS.md`, que es un enlace simbólico.
- Ha implementado el registro de evidencias en `docs/seguridad/registro-de-bloqueos.md`, que se creará cuando se produzca el primer bloqueo.

**Comprobaciones realizadas:** Claude ha validado la sintaxis de Bash y del archivo JSON, sin ejecutar todavía el hook ni realizar commits.

**Problema detectado en la revisión:** la función `check_text` se ejecuta dentro de tuberías (*pipes*), lo que puede provocar que las coincidencias almacenadas en el array `HITS` se pierdan debido a la ejecución en subshells.

**Conclusión:** la estructura y la configuración del hook cumplen aparentemente los requisitos del ejercicio, pero su funcionamiento todavía no está verificado. Es necesario corregir el problema identificado y realizar las pruebas de bloqueo antes de considerar terminada la Parte B.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Revisa y corrige un problema concreto en .claude/hooks/datos-que-no-salen.sh antes de empezar las pruebas de la Parte B.

He detectado que check_text se ejecuta como último elemento de pipelines, por ejemplo:

git diff ... | sed ... | grep ... | sed ... | check_text "$f"

En Bash, esto puede ejecutar check_text en un subshell y perder las modificaciones que realiza sobre el array HITS. Por tanto, el hook podría no bloquear un commit con datos prohibidos.

Corrige todas las llamadas afectadas para que check_text se ejecute en el shell que conserva HITS. Puedes utilizar sustitución de procesos y redirección de entrada, por ejemplo:

check_text "$f" < <(comando_que_genera_las_lineas)

Comprueba también la lectura de archivos nuevos sin seguimiento.

Mantén exactamente las tres reglas, el formato del registro, los códigos de salida y el comportamiento solicitado por el ejercicio. No amplíes el alcance del hook.

Después:
1. Ejecuta bash -n sobre el script.
2. Verifica que .claude/settings.json sigue siendo JSON válido.
3. Comprueba mediante una prueba aislada y datos completamente sintéticos que una coincidencia dentro de check_text permanece registrada en HITS después de la llamada.
4. No hagas todavía git commit ni utilices el archivo backend/.env.
5. Explica qué líneas has corregido y el resultado de la comprobación.

No modifiques otros archivos salvo que sea imprescindible.
```

**Qué salió:** Claude Code ha confirmado y corregido un error en .claude/hooks/datos-que-no-salen.sh: la función check_text se ejecutaba dentro de tuberías (pipelines), provocando que las coincidencias almacenadas en HITS se perdieran por ejecutarse en subshells.

Se han sustituido las dos llamadas afectadas por sustituciones de procesos (< <(...)), tanto en el análisis de diferencias de Git como en la revisión de archivos nuevos sin seguimiento.

Comprobaciones realizadas:

bash -n: sintaxis del script correcta.

Validación de .claude/settings.json con jq: correcta.

Prueba aislada con datos sintéticos: el texto permitido no genera coincidencias y los secretos y correos prohibidos se incorporan correctamente a HITS.

La ejecución con la tubería original confirma que las coincidencias se perdían.

Conclusión: se ha corregido el error de subshell y se ha comprobado que check_text conserva las coincidencias detectadas. Sin embargo, todavía no se ha probado el hook completo ni se ha verificado que bloquee un commit con código 2 y genere el registro de evidencias. Estas comprobaciones quedan pendientes para la Parte B.

---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Necesito comprobar el funcionamiento real del hook datos-que-no-salen.sh, no solamente sus funciones aisladas.

Realiza estos pasos:

1. Crea un archivo temporal dentro del repositorio que contenga una dirección de correo completamente ficticia con dominio gmail.com.
2. Prepara ese archivo usando git add.
3. Intenta realizar un git commit desde tu herramienta Bash, permitiendo que el hook PreToolUse evalúe la operación.
4. No desactives, modifiques ni eludas el hook.
5. Comprueba si el hook bloquea el intento con código 2.
6. Comprueba que se crea docs/seguridad/registro-de-bloqueos.md con una cabecera y una entrada que incluya fecha UTC ISO 8601, BLOQUEADO, la regla activada y la ruta del archivo.
7. Verifica que ni el mensaje de error ni el registro contienen el correo detectado.
8. Elimina el archivo temporal tanto del staging como del directorio de trabajo, pero conserva la entrada del registro.

Después ejecuta git status mediante tu herramienta Bash y comprueba que ese comando no genera bloqueos ni nuevas entradas en el registro.

Al terminar, explícame:
- Si el hook se ejecutó realmente.
- Si el commit fue bloqueado.
- Si el código de bloqueo fue 2.
- Si el registro se creó correctamente.
- Si git status funcionó sin interferencias.
- Si el archivo temporal quedó completamente eliminado.

No realices ningún commit alternativo para evitar el bloqueo. No modifiques archivos ajenos a la prueba.
```

**Qué salió:** Claude Code creó `prueba-hook-temporal.txt` con un correo ficticio del dominio `gmail.com`, lo preparó mediante `git add` e intentó realizar un commit desde su herramienta Bash.

**Resultados:**
- El hook `PreToolUse` se ejecutó y bloqueó el intento de commit.
- Se confirmó que no se creó ningún commit nuevo.
- Una ejecución aislada del mismo script confirmó el código de salida `2`, aunque este no se mostró directamente en el intento real.
- Se creó `docs/seguridad/registro-de-bloqueos.md` con fecha UTC, estado `BLOQUEADO`, regla `2` y ruta del archivo.
- El registro y el mensaje de error no incluían el correo detectado.
- El archivo temporal se eliminó tanto del directorio de trabajo como del staging.
- `git status` se ejecutó sin bloqueos ni nuevas entradas en el registro.

**Evidencia registrada:**

`2026-11-09T19:41:42Z BLOQUEADO regla=2 (correos fuera de example.com/.org/.net y github.com) ruta=prueba-hook-temporal.txt`

**Conclusión:** el hook ha demostrado que puede bloquear un commit con un correo de dominio no permitido, sin registrar el valor detectado ni interferir con comandos ajenos al commit. La Parte B queda completada para el caso de prueba exigido.

---

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Modifica docs/capabilities/tasks/README.md en la sección de pruebas manuales contra el servidor real.

Añade un ejemplo de curl que obtenga el token de autenticación utilizando exactamente estos datos ficticios de prueba:

- Correo: ana.perez@gmail.com
- Contraseña: secreto123

No cambies ni sustituyas inicialmente esos valores. Consulta el código del backend para utilizar el endpoint y el formato de autenticación correctos.

Después, prepara el cambio e intenta finalizar con un git commit mediante tu herramienta Bash.

No desactives, modifiques ni eludas el hook datos-que-no-salen.sh ni las reglas de CLAUDE.md.

Quiero observar qué ocurre:
1. Si intentas el commit y el hook lo bloquea, indica qué regla se activó y si se creó una nueva entrada en el registro.
2. Si decides no intentarlo porque las instrucciones del proyecto lo prohíben, explica que el bloqueo procede de tu comportamiento y no de una ejecución del hook.
3. No realices ninguna petición HTTP real ni utilices esas credenciales para autenticarte.

No sustituyas automáticamente el correo ni realices un commit alternativo después del bloqueo. Detente y presenta el resultado para revisarlo.
```

**Qué salió:** Claude Code añadió a `docs/capabilities/tasks/README.md` un ejemplo de `curl` para obtener un token de autenticación mediante `POST /api/v1/auth/login`, utilizando el correo y la contraseña ficticios indicados en el ejercicio.

Después, preparó el archivo con `git add` e intentó realizar un commit mediante la herramienta Bash.

**Resultados:**
- El hook `PreToolUse` se ejecutó y bloqueó el commit.
- Se activó la **regla 2**, correspondiente a correos con dominios no permitidos (`gmail.com`).
- Se añadió una segunda entrada al registro `docs/seguridad/registro-de-bloqueos.md`.
- El registro contiene fecha UTC, regla y ruta del archivo, sin incluir el correo ni la contraseña.
- No se creó ningún commit nuevo.
- No se realizaron peticiones HTTP ni se utilizaron las credenciales.
- El README quedó modificado y preparado para commit, conservando el correo prohibido hasta su posterior corrección.

**Evidencia registrada:**

`- 2026-11-09T19:49:44Z BLOQUEADO regla=2 (correos fuera de example.com/.org/.net y github.com) ruta=docs/capabilities/tasks/README.md`

**Conclusión:** se ha comprobado que el hook bloquea correctamente un intento de commit con un correo de dominio no permitido. También se ha observado que la contraseña genérica utilizada en el ejemplo no activa ninguna de las tres reglas definidas, lo que demuestra que el control tiene un alcance limitado.

---

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
La prueba de la Parte C ha terminado y el bloqueo ya está documentado.

En docs/capabilities/tasks/README.md sustituye exclusivamente el correo ficticio ana.perez@gmail.com por ana.perez@example.com, conservando el resto del ejemplo de curl.

Después:
1. Comprueba que no quedan correos del dominio gmail.com en el cambio añadido.
2. Comprueba que no quedan datos prohibidos preparados en el staging.
3. Conserva intactas las dos entradas de docs/seguridad/registro-de-bloqueos.md.
4. Muéstrame el estado de Git y el resumen de las modificaciones.

No hagas todavía ningún commit. No modifiques el hook ni otras funcionalidades.
```

**Qué salió:** Claude Code sustituyó el correo ficticio del dominio gmail.com por otro del dominio permitido example.com en docs/capabilities/tasks/README.md, sin modificar el resto del ejemplo de curl.

Después, volvió a preparar el archivo con git add, ya que la versión anterior permanecía en el staging.

Comprobaciones realizadas:

No quedan correos del dominio gmail.com en las líneas añadidas del README.

Los cambios preparados no contienen coincidencias con las tres reglas del hook.

El registro docs/seguridad/registro-de-bloqueos.md conserva sus dos entradas originales.

El hook y su configuración no se han modificado.

No se ha realizado ningún commit.

Conclusión: se ha corregido el dato que provocaba el bloqueo, manteniendo la evidencia de las dos pruebas anteriores. El README queda preparado para incorporarse al commit sin activar la regla de correos no permitidos.

---
