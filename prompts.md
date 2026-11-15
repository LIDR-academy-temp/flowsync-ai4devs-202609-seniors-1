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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Antes de definir nada nuevo, necesito saber qué hay ya construido en este repo. Revisa backend/ y frontend/ y dime:
1. Qué capabilities funcionan hoy de punta a punta (qué puede hacer un usuario con la app).
2. Cómo es el modelo de datos actual: qué entidades hay y cómo se relacionan, sin detallar columnas.
No propongas nada nuevo ni modifiques archivos. Respuesta breve, en español.
```

**Qué salió:** funcionó a la primera; incluyó endpoints que no pueden ir al documento.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Te paso la petición de partida tal cual me llega:

«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

Antes de proponer nada, hazme las cinco preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance del MVP. Reglas:
- Una sola ronda: solo esas cinco preguntas, numeradas. No propongas soluciones ni funcionalidades todavía.
- Nada de modelo de datos, endpoints, arquitectura ni tecnología: nos quedamos a nivel de producto.
- No escribas ni modifiques archivos.
Te responderé a todas de una vez.
```

**Qué salió:** cinco preguntas solo de nombre: cada una con 3-5 subpreguntas, unas 20 en total.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Estas son las respuestas del producto, ya decididas. No las discutas; úsalas como hechos:

- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.

Y lo que ya está decidido que queda fuera del MVP:
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.

Si alguna de tus preguntas no queda cubierta por esto, decide tú y márcalo como SUPUESTO. Todavía no propongas el alcance: de momento solo devuélveme la lista de supuestos que has tenido que tomar, uno por línea, y nada más. No escribas ni modifiques archivos.
```

**Qué salió:** 11 supuestos; el de "qué se ha movido" escondía una decisión de alcance sobre la propuesta de valor.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Ahora sí, propón el alcance del MVP en cinco bloques, en este orden: Problema · Usuarios · Propuesta de valor · Alcance · NO-alcance.

Reglas:
- Sé agresivo recortando: una vertical fina y usable de punta a punta, no el andamiaje de un producto.
- En "Alcance", numera cada cosa que propones meter (1, 2, 3...), una por línea, para poder contarlas.
- En "NO-alcance", cada exclusión con su porqué al lado: qué hipótesis del producto no ayuda a validar. "No da tiempo" no vale como porqué.
- Es un documento de producto: nada de modelo de datos, tablas, endpoints, arquitectura, casos de uso ni requisitos numerados tipo RF-01. Si necesitas algo de eso, súbelo de nivel.
- Tiene que caber en una pantalla larga.
- Devuélvelo en el chat. No escribas ni modifiques archivos.
```

**Qué salió:** propuso 9 elementos de alcance; el NO-alcance era largo pero casi todo repetía la ficha.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Aplico mi recorte sobre tu propuesta:
- Quito el punto 9 entero (corregir título o fecha y borrar). Pasa al NO-alcance con este porqué: no ayuda a validar ni que el estado se mantenga fresco ni que se eviten colisiones; una tarea errónea se puede llevar a Hecha.
- Del punto 8 quito "quién la movió": se queda solo cuándo se movió por última vez y el orden por actividad reciente. Pasa al NO-alcance con este porqué: para decidir qué coger basta con saber qué se ha movido y quién es el responsable; quién hizo el último cambio no cambia esa decisión.

Además corrige esto:
- En "Problema", quita la frase de que el gestor actual cuesta tanto de actualizar que el estado nunca está al día: no es un hecho que te haya dado.
- Reescribe el porqué de "Gestión de bloqueos" y de "App móvil" para que digan qué hipótesis no ayudan a validar, sin inventar datos.
- Integra "Riesgo #1" y "Criterio de éxito" dentro de "Propuesta de valor", para que queden solo los cinco bloques.
- En el NO-alcance, usa una lista de markdown: "- **Exclusión**: porqué". Sin tablas ni separadores.

Escribe el resultado en docs/prd/alcance-mvp-mm.md, debajo de lo que ya hay en el archivo (no toques la sección 1), con dos secciones nuevas:
## 2. El interrogatorio: tus cinco preguntas resumidas en una línea cada una, una línea que diga que las respuestas son la ficha de hechos del producto, y la lista de supuestos que tomaste.
## 3. El alcance: los cinco bloques con mi recorte aplicado. Mantén numerados los elementos del Alcance.

No escribas nada más en el archivo. Al terminar, dime en el chat si mi recorte o el documento se contradicen en algo: que pida algo que él mismo excluye, o que prometa algo que su alcance no permite cumplir.
```

**Qué salió:** señaló 3 incoherencias que provocaba mi recorte (fecha y colisión); tenía razón.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```text
Tienes razón en las tres. Las resuelvo así, sin añadir elementos al alcance:
1. Fecha: el punto 5 pasa a ser "poner o cambiar una fecha de vencimiento opcional, con las tareas vencidas marcadas a simple vista". Del antiguo punto 9 solo quedan en el NO-alcance corregir el título y borrar; añade a su porqué el coste asumido: una tarea errónea o duplicada se lleva a Hecha, aunque eso ensucia un poco el significado de Hecha.
2. Queda resuelta con la 1.
3. Colisión: en el punto 3 añade la regla de que pasar una tarea a En curso te la asigna si no tenía responsable.

Aplica estos cambios en docs/prd/alcance-mvp-mm.md y ajusta los supuestos de la sección 2 si chocan. No toques nada más ni añadas secciones. Después dime en una línea si queda alguna contradicción.
```

**Qué salió:** dijo que no quedaban contradicciones, pero dejó un supuesto duplicado que borré a mano.
