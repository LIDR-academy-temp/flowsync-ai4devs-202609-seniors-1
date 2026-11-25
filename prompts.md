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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Vamos a hacer el siguiente ejercicio, compara el enunciado de la web (que te adjunto) con el readme.md por si hay incoherencias pero no empieces:
---
✍️ Ejercicio FlowSync: cubre con tests un requisito que no tenía ninguno 🔴
Antonio Perez
⏱ La fecha límite es miércoles 25 de Noviembre al final del día.

Repositorio: FlowSync

Es la última lección del módulo y la única que se hace con el portátil delante. Trae el setup del entorno, la tarea y cómo se entrega, todo en un sitio. La tarea tiene dos partes técnicas y una última con las tres líneas que entregas.

📌 Ve guardando cada prompt tal cual lo lanzas, desde el primero. Se entregan, y reescribirlos al final de memoria no sirve: lo que se revisa es cómo lo pediste, no la versión limpia que recuerdas. Hay un archivo esperándolos en el propio repositorio.

🔁 Cómo funciona este módulo
Hay tres momentos, y saberlos cambia cómo aprovechas cada uno.

1. Lo intentas tú. Sobre el proyecto de abajo, con tu agente y con el reloj puesto. Entregas lo que te salga, con lo que tenga. La entrega a medias no es un problema: este paso no se puntúa por completarlo, y lo que se discute en vivo son las cosas con las que te chocaste.

2. Lo ves resuelto en el directo. El mentor escribe estos mismos tests, sobre este mismo requisito y este mismo proyecto, y después arregla la implementación, que es el paso que tú no haces. Si a ti no te salió, ahí ves que se puede y cómo. Por eso conviene mirar sin teclear: lo vas a repetir con calma después.

3. Lo replicas. Los prompts que use el mentor te llegan por escrito. Con ellos vuelves a tu entorno y rehaces el recorrido, que es donde se asienta.

⚠ En el paso 3 no esperes salidas idénticas, y no es un fallo tuyo. La inteligencia artificial (IA) no es determinista: con el mismo prompt cambian los nombres de los casos, su orden y hasta cuántos escribe por cada Scenario. Lo que no cambia es qué tiene que estar en rojo, porque eso lo fija la spec y no el agente. Lo que se repite es la forma del recorrido, no el texto.

🛠 Deja el entorno listo
1. Comprueba lo que necesita tu máquina
Cuatro cosas, cada una con el comando que dice si la tienes y el síntoma de tenerla mal. Compruébalas antes de clonar nada: las cuatro fallan más tarde y con mensajes que no mencionan la causa.

Docker, corriendo: docker ps. Si dice Cannot connect to the Docker daemon, está instalado y apagado. Ojo, que ese mensaje es igual que el de no tenerlo. Se instala desde https://docs.docker.com/get-started/get-docker/.

Node.js 24 o superior: node -v. La capa de base de datos que este proyecto instala declara que necesita 24 como mínimo, así que con versiones anteriores la instalación avisa y el arranque puede morir con errores que no hablan de versiones. Se instala desde https://nodejs.org.

make: make --version. Si no responde: en macOS viene con las herramientas de línea de comandos (xcode-select --install); en Linux, con el paquete build-essential o equivalente.

Una cuenta de GitHub: la entrega es un pull request desde tu propio fork hacia el repositorio del curso.

💻 Dónde funciona esto, porque no es en todas partes igual. En macOS y en Linux, tal cual. En Windows, dentro de WSL (Windows Subsystem for Linux, el subsistema de Linux para Windows), y esto no es una preferencia: los atajos del proyecto están escritos con órdenes de shell de macOS y Linux (cp, test, rm), así que en PowerShell no funcionan.

Y la parte que se olvida: todo tiene que estar dentro de WSL, no solo el último comando. El clon, Node y make. Lo que instales en Windows no existe dentro de esa terminal. Clona además dentro del sistema de ficheros de Linux (~/…) y no en /mnt/c, o la instalación de dependencias irá muy lenta.

2. Forkea y clona el proyecto
Se trabaja sobre tu propio fork, porque sobre el repositorio del curso no tienes permiso de escritura: la entrega es un pull request desde él hacia el del curso.

Entra en https://github.com/LIDR-academy/flowsync-ai4devs y pulsa Fork.

Clona tu fork y entra en la carpeta.

Añade el repositorio original como upstream y trae de ahí la rama de partida:

git remote add upstream https://github.com/LIDR-academy/flowsync-ai4devs.git
git fetch upstream
git checkout -b s11/start upstream/s11/start
🚨 La rama de partida se trae de upstream, no de tu fork. El formulario de Fork de GitHub trae marcada la casilla de copiar solo la rama por defecto, así que tu fork se lleva main y nada más. Un git checkout s11/start a secas moriría con un did not match any file(s) known to git que no menciona al fork por ningún lado. Y aunque desmarcaras la casilla, un fork es una foto del momento: no recibe las ramas que se publiquen después.

3. Instálalo y levántalo
No hay package.json en la raíz. Los comandos de npm se ejecutan dentro de backend/ y de frontend/, y el Makefile de la raíz ya lo hace por ti.

make setup   # solo la primera vez: instala dependencias, crea los .env, levanta las bases y migra
make db-up   # levanta las dos bases de datos y espera a que estén sanas
make start   # levanta backend y frontend a la vez; Ctrl-C para los dos
make help    # lista todos los atajos
make start se queda corriendo en esa terminal: para lo demás, abre otra.

Comprueba que cada pieza vive:

Backend en http://localhost:3333. Desde otra terminal: curl -s http://localhost:3333.

Frontend en http://localhost:5173. Ábrelo en el navegador.

Las dos bases de datos en el 54410 (desarrollo) y el 54411 (pruebas). No se usa el 5432 a propósito: quien tenga un PostgreSQL suyo levantado se lo encontraría ocupado, y el error que vería no menciona a Docker por ningún lado.

4. Comprueba la batería de pruebas antes de tocar nada
Es la mejor comprobación de que el entorno está bien montado, y además es tu línea de partida: apunta el número que te dé, porque vas a compararlo al final.

make test        # migra la base de pruebas y corre la suite entera
make test-unit   # solo la suite unitaria
make test-e2e    # solo la funcional: peticiones reales a la aplicación
🔎 Fíjate en lo que contesta make test-unit y no sigas hasta haberlo mirado. Es el hecho que abre este módulo, y verlo en tu propia pantalla vale más que leerlo.

5. Crea tu rama
Trabaja en tu propia rama, no en s11/start. Créala antes del primer prompt con este nombre:

git checkout -b tests-<tus-iniciales>
Si el agente commitea en una rama suya, tráete esos commits a la tuya con git merge <esa-rama> antes de empujar.

📋 La tarea
Cubre con tests el requisito «Cuándo una tarea está vencida», que hoy no tiene ninguno. Empieza por el contrato, míralo en rojo, y baja la regla a un test que la llame directamente.

Es el mismo encargo que se resuelve en el directo, con la misma unidad de trabajo y los mismos insumos. Los prompts los escribes tú, y son la mitad de lo que se entrega.

La unidad de trabajo es una y está nombrada: el Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md. No elijas otro. Sus Scenarios son el enunciado, así que no tienes que inventarte los casos: están escritos, y están escritos desde antes de que existiera el código.

✋ Y el corte es fijo: no arregles la implementación. El ejercicio termina con los tests escritos y en rojo. El arreglo se hace en el directo, y lo que se compara allí es tu rojo con el de la clase.

🅰 Parte A: el contrato primero
Lee el Requirement entero y sus Scenarios.

Escribe un archivo de tests funcionales que los ejerza entrando por HTTP (HyperText Transfer Protocol, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Uno por Scenario.

Córrelo con make test-e2e y quédate con la salida entera, no solo con si pasó o no.

Cinco restricciones, y ninguna es decorativa:

No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.

Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.

El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.

Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.

No des por hecho ningún identificador: usa el que te devuelva la creación.

🅱 Parte B: bajar la regla, y solo la regla
La regla vive en isOverdueOn, en backend/app/models/task.ts. Crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:

Fecha anterior al día de referencia, y la tarea sin hacer.

Fecha exactamente igual al día de referencia.

Fecha posterior.

Sin fecha.

Tarea ya hecha, con la fecha pasada.

Y añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha. Ese no lo pide ningún requisito de producto. Sale de preguntarse cómo llega el dato de verdad, que es justo donde tu criterio no lo pone nadie por ti.

Sigue sin tocar implementación.

🔀 No te asustes si el agente se lleva el trabajo a otra rama. El propio proyecto le prohíbe commitear en una rama de partida, así que en cuanto tenga algo que guardar creará una rama nueva y commiteará ahí sin pedírtelo. Es el proyecto haciendo lo que se le mandó, no un descuido. git branch y git log --oneline te enseñan dónde está todo.

Parte C: las tres líneas
En un HALLAZGOS.md en la raíz del repositorio:

Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

De qué dudaste, o qué no pudiste comprobar.

El entregable no es tener los tests perfectos: son las tres líneas. Una parte A a medias con las tres líneas escritas vale más que lo contrario, porque lo que se discute en el directo es dónde te chocaste.

Cómo saber que la has hecho bien
No hay ni una línea tocada fuera de backend/tests/. Míralo con git diff --stat: si aparece el modelo o el controlador, tus tests nacieron verdes y no comprueban nada.

Tienes la salida entera de make test-e2e guardada, no solo si pasó. La cifra de la primera línea sale de ahí.

Hay un caso rojo y sabes cuál. Un archivo de tests que pasa entero sobre un requisito sin implementar es la señal de que los tests miran otra cosa.

Ningún test usa la fecha de hoy. Busca la llamada al reloj en tus archivos: si está, mañana el resultado será otro y no habrás medido la regla.

Las tres líneas están escritas y son concretas. La segunda es la que más sirve, y se responde mirando qué tienen en común los casos que sí fallaron.

Entrégalo con lo que tenga.

📤 Cómo se entrega
Trabaja en la rama tests-<tus-iniciales> que creaste al dejar el entorno listo, y no en s11/start.

Guarda tus prompts en prompts.md, en la raíz. Ese nombre y esa ubicación no son negociables: es lo que lee la herramienta que revisa las entregas. El repositorio ya lo trae con su plantilla puesta. Cada prompt va en su propio bloque de código, con el modelo y la herramienta que usaste.

Empuja tu rama a tu fork (git push -u origin tests-<tus-iniciales>) y abre el pull request desde tu fork hacia el repositorio del curso (github.com/LIDR-academy/flowsync-ai4devs; comprueba que el repositorio base que te propone GitHub es ese y no tu fork), con HALLAZGOS.md y prompts.md dentro.

El plazo
El plazo es antes del directo.

📚 Si vas justo de tiempo
Prioriza la lección sobre por qué el test que falla es la especificación que le das al agente, que es exactamente lo que vas a hacer, y la que trata cómo se sale de un verde falso con un segundo caso. Las demás lecciones del módulo pueden esperar.

El resto del material de apoyo está en la lección de recursos de este módulo, y es opcional.

✅ Antes de conectarte, comprueba
[ ] Estás en la rama de partida, sobre tu fork, y git push funciona.

[ ] docker ps devuelve una tabla, node -v responde v24 o más, y make --version responde.

[ ] Las dos bases levantan en el 54410 y el 54411, y make test corrió una vez entero.

[ ] Has leído el Requirement «Cuándo una tarea está vencida» y sus Scenarios.

[ ] Traes HALLAZGOS.md con sus tres líneas, y tus tests dentro del cambio, en rojo.

[ ] prompts.md está relleno, con modelo y herramienta en cada bloque.

[ ] Tu rama se llama tests-<tus-iniciales> y el pull request está abierto contra el repositorio del curso.

Trae el archivo tal como quedó, sin maquillarlo: lo que le falta es la mitad de lo interesante.

🎯 Qué te llevas del Módulo 11
El modelo mental: que el orden del encargo decide quién manda: si pides implementación y tests a la vez, los tests se escriben leyendo el código y describen lo que hace; si das un test que falla, el código tiene que obedecer a algo que no eligió. Que de un verde falso no se sale insistiendo, se sale con un segundo caso que el atajo no pueda satisfacer. Que se puede cubrir el 100% del código y no cubrir ni uno de los casos que el cliente consume, porque un test que llama a la función elige él los datos con los que entra y solo puede confirmar lo que ya creías. Que la base de datos de los tests no se finge y son dos, y que una separación que no has comprobado apagando una no es una separación. Y que escribir un test ya no cuesta nada, así que la pregunta dejó de ser cuántos tienes y pasó a ser cuáles no deberían existir, porque cada uno es un compromiso de mantenimiento que alguien va a pagar.

Lo que queda en el proyecto: un archivo de tests funcionales que ejerce, uno por uno, los casos de un requisito que no tenía ninguno, entrando por donde entra el cliente de verdad. Un directorio de tests unitarios con los bordes de una regla dentro, que es el primer contenido que ese nivel tiene desde que el proyecto existe. Un fichero de hallazgos con tus tres líneas y tus números. Y el registro de tus prompts, con la forma exacta en que se lo pediste.

👥 Qué te llevas según de dónde vengas.

Si eres dev: da primero el test que falla, sal de un verde falso con un segundo caso, empieza por donde entra el cliente y golpea la base de datos de verdad. Y borrar un test que no sirve es un acto profesional perfectamente respetable.

Si vienes de producto o gestión: el test que se escribe primero obliga a decidir cosas que en el otro orden nadie decide, y varias son de producto. También explica dos frases que habrás oído: «pero si teníamos tests», y por qué un cambio pequeño se estima en horas y se entrega en días.

Si no tienes background técnico: quien pide «haz que esto pase» recibe exactamente eso. Y una imitación solo puede confirmar lo que ya creías.
```

**Qué salió:** 
```
No he empezado el ejercicio ni he modificado nada. El texto de la web y `README.md` coinciden casi palabra por palabra; las diferencias están en el repositorio y la fecha.

## Web frente a README

| Punto                      | Web                                                                         | `README.md`                                      | Realidad comprobada                                                                           |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Repo para el fork (paso 2) | `LIDR-academy/flowsync-ai4devs`                                             | `LIDR-academy/flowsync-ai4devs-202609-seniors-1` | Tu `upstream` y el padre de tu fork son `LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1` |
| `git remote add upstream`  | la URL de la web                                                            | la URL del README                                | Ya lo tienes apuntando a `LIDR-academy-temp`                                                  |
| Repo destino del PR        | `LIDR-academy/flowsync-ai4devs`                                             | `…/flowsync-ai4devs-202609-seniors-1`            | `LIDR-academy-temp/…`                                                                         |
| Fecha límite               | miércoles 25 de noviembre al final del día, y más abajo «antes del directo» | solo «antes del directo»                         | **Hoy es miércoles 25 de noviembre**                                                          |

- **Repositorio:** con tu cuenta, GitHub responde que no encuentra ninguno de los dos de `LIDR-academy` (podrían no existir o ser privados). Usa el de `LIDR-academy-temp`.
- **Plazo:** si el directo es antes del final del día, las dos frases de la web se contradicen. Confirma la hora.

## Incoherencias que comparten los dos textos

1. **Rama:** el primer punto de la lista final dice «Estás en la rama de partida», pero el paso 5, la entrega y el último punto exigen `tests-<iniciales>`. Vale lo segundo, y ya estás en `tests-mtg`.
2. **Alcance:** «No toques ni una línea fuera de `backend/tests/`» choca con tener que rellenar `HALLAZGOS.md` y `prompts.md` en la raíz. Se entiende que la restricción es sobre la implementación.
3. **Rama base del PR:** no la indican. Tus PR anteriores van contra la `sN/start` de cada módulo, así que aquí tocaría `s11/start`; `main` solo tiene el commit inicial según su referencia local.

## Textos frente al repositorio

- **`HALLAZGOS.md` tiene una plantilla de otro ejercicio:** pide «las filas que cambian y la rama», «lo que la batería de pruebas no podía ver» y «tu duda». El enunciado pide casos fallidos y en verde, cuál pasó y por qué, y tus dudas. Habrá que sustituir los apartados por los del enunciado.
- **`make test-unit` necesita Docker:** el `Makefile` dice «sin servidor ni base de datos», pero el atajo depende de `migrate`, que levanta y migra las dos bases. La parte B pide tests sin base de datos, y eso sigue siendo posible aunque el atajo la levante.
- **`CLAUDE.md` está desactualizado:** dice que `tasks` no tiene ningún test, pero existen `trash.spec.ts` y `assignee.spec.ts`. No contradice al enunciado, porque no he visto ningún test que mencione `isOverdue`.

## Lo que sí cuadra

- El requisito está en `openspec/specs/tasks/spec.md` y tiene 7 Scenarios.
- `isOverdueOn` está en `backend/app/models/task.ts`.
- `backend/tests/unit/` no existe.
- Los atajos `test-unit` y `test-e2e` existen.
- Tienes Node 24.21.0, y Lucid exige 24 o más.

No he ejecutado `make test` ni he comprobado Docker. Cuando quieras empezar, el primer paso es anotar la línea base de las pruebas.
```

---

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Implementa la parte A de la tarea. No leas la implementación si hay alguna, sólo crea los tests tal y como se solicita en la tarea.
```

**Qué salió:** funcionó a la primera
```
La parte A está implementada y commiteada (`75fe006`) en `tests-mtg`. Los tests están en `backend/tests/functional/tasks/overdue.spec.ts`, uno por cada uno de los 7 Scenarios.

## Resultado de `make test-e2e`

| Ejecución            | Resultado                    |
| -------------------- | ---------------------------- |
| Antes de añadir nada | 40 pasan de 40               |
| Con el archivo nuevo | **44 pasan, 3 fallan** de 47 |

Los 40 que ya había siguen en verde. De los 7 nuevos:

| Scenario                               | Resultado | Dónde falla                                                    |
| -------------------------------------- | --------- | -------------------------------------------------------------- |
| Fecha del día anterior                 | ❌        | comprobación final: se esperaba `true` y llegó `false`         |
| Darla por hecha la deja de vencer      | ❌        | **precondición**: la tarea no llega vencida antes del cambio   |
| Aplazar resuelve el vencimiento        | ❌        | **precondición**: la tarea no llega vencida antes de aplazarla |
| Vencer hoy todavía no es estar vencida | ✅        |                                                                |
| Fecha futura                           | ✅        |                                                                |
| Sin fecha no se vence nunca            | ✅        |                                                                |
| Una tarea hecha con la fecha pasada    | ✅        |                                                                |

En los dos fallos por precondición, lo que pide el `THEN` no llega a comprobarse.

## Decisiones que conviene revisar

- **«Creada hace semanas»:** la API que describe el README no permite elegir la fecha de creación, así que ese test fija `created_at` directamente en la base de pruebas. El resto del recorrido va por HTTP.
- **Fechas:** el día de referencia es fijo (`2026-08-20`) y va en cada petición que informa del vencimiento. Una búsqueda de llamadas habituales al reloj en el archivo no encontró ninguna.
- **Aislamiento:** `withGlobalTransaction()` por test, como en los tests existentes. Los identificadores salen de la respuesta de creación.

## Sobre «no leas la implementación»

Para este encargo usé la spec, el README de la capability, `tests/bootstrap.ts` y los dos tests existentes. El README nombra clases y archivos de la implementación, pero no los abrí. Sí había abierto `task.ts` en la comparación anterior, como te avisé, así que mi contexto no partía limpio. Tenlo en cuenta si lo mencionas en tus dudas.

## Estado del repositorio

- El commit solo contiene el archivo de tests; `eslint`, Prettier y el typecheck pasan.
- `HALLAZGOS.md` y `prompts.md` tienen cambios tuyos sin commitear y no los he tocado.
- Las salidas completas están en `backend/tmp/test-e2e-baseline.log` y `backend/tmp/test-e2e-parte-a.log`, que Git ignora.
- No he actualizado el README de la capability, que sigue diciendo que hay dos archivos de tests, porque queda fuera de `backend/tests/`.
- No he hecho push ni abierto el PR; la parte B queda pendiente.
```

---

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Ahora la parte B
```

**Qué salió:**
```
La parte B está hecha y commiteada (`ea8da4b`) en `tests-mtg`. Los 6 casos están en `backend/tests/unit/tasks/overdue.spec.ts`.

Antes de crearlos, `make test-unit` respondía **`NO TESTS EXECUTED`** y salía con código 0.

## Resultado de `make test-unit`: 4 pasan, 2 fallan

| Caso                                                   | Resultado                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| Fecha anterior y sin hacer (`pending` e `in_progress`) | ✅                                                              |
| Fecha igual al día de referencia                       | ✅                                                              |
| Fecha posterior                                        | ✅                                                              |
| Sin fecha                                              | ✅                                                              |
| Hecha y con la fecha pasada                            | ❌ se esperaba `false` y llegó `true`                           |
| Fecha como texto o como objeto                         | ❌ la fecha anterior como objeto da `false`; se esperaba `true` |

Fíjate en que «hecha con la fecha pasada» **pasa por HTTP y falla en el unitario**, y que «fecha anterior» hace lo contrario. Te sirve para la segunda línea de `HALLAZGOS.md`; si quieres, comentamos el porqué cuando hayas sacado tu conclusión.

## Totales con `make test`

|                       | Pasan  | Fallan | Total  |
| --------------------- | ------ | ------ | ------ |
| Tests que ya había    | 40     | 0      | 40     |
| Parte A (funcionales) | 4      | 3      | 7      |
| Parte B (unitarios)   | 4      | 2      | 6      |
| **Suite completa**    | **48** | **5**  | **53** |

## Decisiones que conviene revisar

- **Objeto de fecha:** usé un `Date` de JavaScript a medianoche local, porque una consulta de solo lectura a la base de pruebas confirmó que el driver entrega eso para un `date`. El modelo declara el campo como `string`, así que el test fuerza el tipo. No probé con un `DateTime` de Luxon.
- **El caso extra:** comprueba fecha anterior, igual y posterior. Se detiene en la primera comprobación que falla, así que las de igual y posterior como objeto no llegan a ejecutarse.
- **Sin base de datos:** el archivo no guarda ni consulta nada. Apuntando a un puerto de base de datos inexistente da el mismo 4/2. `make test-unit` sí levanta y migra las bases antes, por cómo está el `Makefile`.
- **Implementación:** no volví a abrir `task.ts`, aunque lo había visto en la primera comparación. Sí miré la línea de `dueDate` en `database/schema.ts` para saber su tipo.

## Estado

- Respecto a `s11/start`, los commits solo añaden los dos archivos de tests; Prettier, `eslint` y el typecheck no dieron errores.
- Las salidas están en `backend/tmp/`: `test-unit-baseline.log`, `test-unit-parte-b.log`, `test-unit-sin-db.log` y `test-parte-b.log`.
- `HALLAZGOS.md` y `prompts.md` siguen sin commitear. Falta la parte C, y después el push y el PR.
```

---

## Prompt 4

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Por qué falla el test de 'Fecha del día anterior' del funcional
```

**Qué salió:** La explicación que me imaginaba pero al no ser una stack con la que trabajo me cuesta más seguir manualmente.
```
Falla porque la regla compara un objeto de fecha con un texto, y en JavaScript esa comparación da siempre false.

El recorrido

1. El test pone dueDate = '2026-08-19' y consulta con today=2026-08-20.
2. Al leer la tarea, el driver de PostgreSQL entrega la columna date como un objeto Date. El modelo la declara como string | null (backend/database/schema.ts:45), pero eso es solo un tipo: no convierte nada, y no encontré ninguna conversión en el código de la aplicación.
3. El día de referencia sí llega como texto, y backend/app/transformers/task_detail_transformer.ts se lo pasa a la regla.
4. La regla, en backend/app/models/task.ts:74, hace esto:

if (this.dueDate === null) return false

return this.dueDate < referenceDay   // Date < string
5. Con < entre un Date y un texto, JavaScript convierte ambos a número. La fecha pasa a ser sus milisegundos y '2026-08-20' pasa a ser NaN. Cualquier comparación con NaN es false.

Lo he reproducido aparte con Node:

┌──────────────────────────────────────┬───────────────┐
│              Expresión               │   Resultado   │
├──────────────────────────────────────┼───────────────┤
│ new Date(2026, 7, 19) < '2026-08-20' │ false         │
├──────────────────────────────────────┼───────────────┤
│ Number(new Date(2026, 7, 19))        │ 1787090400000 │
├──────────────────────────────────────┼───────────────┤
│ Number('2026-08-20')                 │ NaN           │
├──────────────────────────────────────┼───────────────┤
│ '2026-08-19' < '2026-08-20'          │ true          │
└──────────────────────────────────────┴───────────────┘

Por qué no lo detecta el typecheck

El comentario del método dice «se compara texto contra texto», y para TypeScript es cierto, porque el tipo declarado es string. La discrepancia solo existe en ejecución. Por eso el unitario con texto pasa y el caso con objeto de fecha falla.

Con este mecanismo ya puedes responder la segunda línea de HALLAZGOS.md: mira qué resultado esperaba cada test que pasó.

No he cambiado nada, porque el arreglo queda fuera del ejercicio. Una posible duda para la tercera línea: como el transformer copia dueDate tal cual, la respuesta HTTP podría no traer el formato AAAA-MM-DD que muestra el README. No lo he comprobado.
```

---

## Prompt 5

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
 ¿Los tres casos que fallan del funcional son por el mismo motivo?
 ```

**Qué salió:**
```
Sí, los tres tienen la misma causa: **en un `GET`, una tarea con fecha pasada nunca llega como vencida**, porque la regla compara un `Date` con un texto.

| Test                              | Línea que falla | Qué comprueba ahí             |
| --------------------------------- | --------------- | ----------------------------- |
| Fecha del día anterior            | 77              | resultado final tras un `GET` |
| Darla por hecha la deja de vencer | 117             | precondición tras un `GET`    |
| Aplazar resuelve el vencimiento   | 143             | precondición tras un `GET`    |

Las tres son un `isTrue` sobre una tarea no hecha, con fecha `2026-08-19` y consultada a `2026-08-20`.

## El `PUT` responde distinto

Lo he comprobado con un test temporal, ya borrado, sobre la misma tarea:

| Respuesta        | `dueDate`                    | `isOverdue` |
| ---------------- | ---------------------------- | ----------- |
| `PUT /due-date`  | `"2026-08-19"`               | `true` ✅   |
| `GET /tasks/:id` | `"2026-08-19T00:00:00.000Z"` | `false` ❌  |

En el `PUT`, el controlador asigna la fecha como texto (`backend/app/controllers/task_due_dates_controller.ts:61`), guarda y responde con ese mismo objeto en memoria. La regla compara texto con texto y acierta. En el `GET`, la tarea se lee de la base y la fecha llega como `Date`.

Esto confirma además la duda que te apunté antes: el `GET` devuelve `dueDate` con hora, no en el formato `AAAA-MM-DD` del README.

## Qué dejan sin probar los dos fallos por precondición

- **Darla por hecha:** si la precondición se saltara, el resto pasaría sin demostrar nada, porque el `GET` posterior daría `false` de todas formas.
- **Aplazar:** la comprobación final usa la respuesta del `PUT`, donde la regla compara texto. Con una fecha posterior debería dar `false` correctamente, pero el test se detiene antes.

Las precondiciones evitan así que «Darla por hecha» salga en verde sin merecerlo.

Un apunte para la clase: un test que solo mirase la respuesta del `PUT` con una fecha pasada habría salido en verde, y el fallo no se habría visto.
```

---

## Prompt 6

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
¿Y en el caso de los unitarios?
```

**Qué salió:**
```
En los unitarios no: **los dos fallos tienen causas distintas**.

| Test unitario que falla        | Causa                                                       |
| ------------------------------ | ----------------------------------------------------------- |
| Fecha como texto o como objeto | La misma que en los funcionales: `Date < string` da `false` |
| Hecha y con la fecha pasada    | Otra: la regla no mira el estado                            |

## El segundo defecto

La spec exige tres condiciones y el método solo comprueba dos (`backend/app/models/task.ts:74`):

| Condición de la spec                      | ¿La comprueba?                              |
| ----------------------------------------- | ------------------------------------------- |
| Tiene fecha de vencimiento                | Sí                                          |
| La fecha es anterior al día de referencia | Sí, pero solo funciona si la fecha es texto |
| El estado no es `done`                    | **No**                                      |

El comentario del propio método dice que la tarea no puede estar hecha, pero el código no usa `status`. El test le pasa una tarea `done` con la fecha como texto, la comparación acierta y devuelve `true`.

## Por qué los funcionales no lo ven

En «Una tarea hecha con la fecha pasada», la consulta es un `GET`, así que la fecha llega como `Date` y el resultado es `false` sea cual sea el estado. **Un defecto tapa al otro** y el test pasa sin haber comprobado la condición del estado.

De ahí se deducen dos cosas que no he ejecutado:

- Si se arreglara solo la comparación de fechas, ese funcional y «Darla por hecha» deberían ponerse en rojo.
- Hoy, un `PUT /due-date` con fecha pasada sobre una tarea hecha debería responder `isOverdue: true`, porque ahí la fecha es texto. Ningún funcional recorre ese caso.

## Resumen de los 5 fallos

| Defecto                       | Funcionales | Unitarios |
| ----------------------------- | ----------- | --------- |
| Comparación `Date` con texto  | 3           | 1         |
| Falta la condición del estado | 0           | 1         |

El unitario encuentra el segundo defecto porque llama a la regla con la fecha como texto y esquiva el primero. A la vez, con solo texto no habría visto el primero: lo detecta únicamente el caso del objeto de fecha.
```

---

## Prompt 7

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Rellena Hallazgos.md con lo que se pide y lo que has comprobado
```

**Qué salió:** Me ha hecho commit, lo he modificado manualmente después para acotar mejor.
```
He completado `HALLAZGOS.md` y lo he commiteado (`8e821fb`).

| Punto                           | Qué dice                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Cifras**                   | Conservé tu frase (5 de 13 nuevos fallan, 40 de 40 anteriores en verde) y añadí las salidas: `48/5` de 53 en total, `44/3` de 47 en funcionales y `4/2` de 6 en unitarios                                                |
| **2. Cuáles pasaron y por qué** | Los 8 en verde: los funcionales esperan `false` y el `GET` lo devuelve siempre para tareas con fecha; «Sin fecha» sale antes por `null`; los unitarios reciben texto o `null`. Incluye el segundo defecto, el del estado |
| **3. Dudas**                    | Lo no comprobado (`PUT` sobre una tarea hecha, efecto de arreglar solo la fecha, `DateTime` de Luxon), que yo había leído `task.ts` y la diferencia de formato de `dueDate` entre `GET` y `PUT`                          |

## Revísalo antes de entregar

- **Extensión:** cada punto es una sola viñeta, pero la segunda y la tercera son largas. La plantilla pide «con tus palabras», así que conviene que las recortes y las reescribas a tu manera.
- **Texto heredado:** la introducción (línea 4) sigue hablando de «un cambio de motor», del ejercicio anterior. No la he tocado.
- **Tus cambios:** el commit incluye también los títulos nuevos que habías puesto.

Para entregar falta commitear `prompts.md`, que sigue modificado, hacer `git push -u origin tests-mtg` y abrir el PR contra `s11/start` de `LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1`. El plazo es hoy. `CLAUDE.md` pide además pasar el revisor `adversarial-reviewer` sobre el PR al terminar. Dime cuándo quieres que lo haga.
```

---

## Prompt 8

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
¿Puedes explicarme mejor las dudas del 3r punto de los Hallazgos.md? (no modifiques el fichero)
```

**Qué salió:** Pidiéndole más información para mi conocimiento acerca de lo que se ha encontrado. Y él mismo ha detectado un problema en su test, no lo he corregido, porque realmente puede pasar.
```
El tercer punto junta cinco cosas distintas.

## 1. El `PUT` sobre una tarea hecha

- **La duda:** si una tarea está en `done` y le pones una fecha pasada con `PUT /due-date`, creo que respondería `isOverdue: true`, lo cual incumple la spec.
- **Por qué lo creo:** en el `PUT` la fecha es texto, así que la comparación acierta, y la regla no mira el estado.
- **Lo que falta:** nadie lo ha ejecutado. Ningún Scenario describe ese recorrido y ningún test lo hace.

## 2. Arreglar solo la fecha

Supón que alguien corrige la comparación de fechas y olvida el estado:

| Test funcional            | Hoy                   | Previsión                   |
| ------------------------- | --------------------- | --------------------------- |
| Hecha con la fecha pasada | ✅                    | ❌ respondería `true`       |
| Darla por hecha           | ❌ en la precondición | ❌ en la comprobación final |

Es una predicción, porque comprobarla exige tocar la implementación. Importa porque muestra que el primer test está hoy en verde por casualidad.

## 3. `Date` frente a `DateTime`

Una fecha como objeto puede ser un `Date` de JavaScript, que es lo que entrega hoy el driver, o un `DateTime` de Luxon, la librería que el proyecto usa en otras fechas como `deletedAt`.

Solo probé `Date`. Supongo que `DateTime` fallaría igual, pero no lo he ejecutado. Además, el test se detiene en la primera comprobación que falla (fecha anterior), así que las de fecha igual y posterior como objeto no llegan a ejecutarse.

## 4. Había leído `task.ts`

Los tests deberían salir de la spec y no del código. Abrí `task.ts` al comparar el enunciado con el README, antes de que pidieras no leer la implementación. Los casos siguen los Scenarios, pero no puedo demostrar que haberlo visto no influyera, por ejemplo en las precondiciones o en el caso del objeto de fecha.

## 5. El formato de `dueDate`

Esto sí está comprobado: el `GET` devuelve `2026-08-19T00:00:00.000Z` y el `PUT` devuelve `2026-08-19`. La duda es que ningún test nuevo vigila el formato.

**Al revisarlo veo además un fallo en mi test.** «Aplazar» termina con:

``ts
assert.notEqual(aplazada.dueDate, antes.dueDate)
``

`antes` viene de un `GET` y `aplazada` de un `PUT`. Como los formatos difieren, serían distintos **aunque la fecha no hubiera cambiado**. Hoy el test no llega a esa línea, pero si la regla empezara a funcionar sin igualar los formatos, esa comprobación pasaría siempre.

Se corrige comparando con la fecha esperada, `assert.equal(aplazada.dueDate, DIA_POSTERIOR)`. No he cambiado ningún archivo; dime si quieres que lo aplique antes de entregar.
```

---

## Prompt 9

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Valida los cambios sobre HALLAZGOS.md y prompts.md
```

**Qué salió:**
```
He revisado los dos archivos sin modificarlos. Hay **un error que conviene corregir antes de entregar**: el prompt 7 está vacío.

## `prompts.md`

| Prioridad | Dónde                     | Problema                                                                                           | Corrección                                                               |
| --------- | ------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Alta**  | Prompt 7 (líneas 531-532) | El bloque no tiene texto                                                                           | `Rellena Hallazgos.md con lo que se pide y lo que has comprobado`        |
| **Alta**  | Final del archivo         | Falta este último prompt                                                                           | Añadir el prompt 9: `Valida los cambios sobre HALLAZGOS.md y prompts.md` |
| Media     | Prompt 3, línea 335       | Quedó el texto de la plantilla: «(opcional, una línea) funcionó a la primera / tuve que insistir…» | Poner tu valoración o dejarlo vacío                                      |
| Baja      | Prompt 7, «Qué salió»     | «hehcho»                                                                                           | «hecho»                                                                  |

- **Prompts 2 a 6 y 8:** coinciden con lo que lanzaste.
- **Prompt 1:** está presente, pero no lo he comparado palabra por palabra.
- **Formato:** el ejemplo de la plantilla está borrado y los ocho apartados indican modelo y herramienta.
- **Datos sensibles:** no he encontrado direcciones de correo en ninguno de los dos archivos.

## `HALLAZGOS.md`

Las cifras cuadran con lo ejecutado: fallan 5 de 13 nuevos, pasan 8 (4 y 4) y siguen en verde los 40 anteriores.

**Punto 1:** correcto.

**Punto 2:** correcto, con dos mejoras posibles:
- «Y otro porque justamente no se pasa fecha» se entiende mejor así: tres pasan por la comparación y «Sin fecha» por la comprobación de `null`.
- Al recortarlo desapareció el segundo defecto. «Hecha con la fecha pasada» pasa por HTTP aunque la regla no mira el estado, y es probablemente lo más interesante que encontraste.

**Punto 3:**
- **Errata:** «aunque le he pedido que no li hiciese ya los había leído antes». Propuesta: «el agente había leído `task.ts` antes de que le pidiera no hacerlo».
- **Ambigüedad:** en «el caso se detiene en la fecha anterior», aclara que es el unitario de texto frente a objeto.
- **Opcional:** no recoge el fallo de «Aplazar», cuyo `notEqual` compara formatos distintos. Si decides no corregirlo, es una buena duda para dejar escrita.

La línea 4 sigue diciendo «un cambio de motor a medias», heredado del ejercicio anterior.

Los dos archivos siguen sin commitear. Cuando los corrijas, puedo hacer el commit, el push y el PR contra `s11/start`.
```
