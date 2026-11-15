# Alcance del MVP de FlowSync

## 1. El terreno que ya existe

Hoy FlowSync solo tiene gestión de cuenta: un usuario puede registrarse, iniciar sesión, ver su perfil y cerrar sesión, y la sesión se mantiene al volver a abrir la app. El único dato que existe es el usuario: no hay tareas, ni equipos, ni ninguna relación entre usuarios. Todo lo que defina este MVP es nuevo y se apoya en el usuario que ya existe; el registro y el login no se vuelven a especificar.

## 2. El interrogatorio

1. **Problema**: qué falla hoy cuando alguien necesita saber en qué está un compañero, y cuál es el dolor principal.
2. **Usuarios**: qué tamaño y perfil tiene el equipo, cómo se reparte por husos horarios y si hay roles distintos.
3. **Tiempo real**: qué significa exactamente y con qué frecuencia se espera que se actualice el estado.
4. **Menos rollo que Jira**: qué sobra de las herramientas actuales y qué no se puede perder.
5. **Éxito del MVP**: con qué escenario se prueba, qué lo da por bueno y qué queda fuera explícitamente.

Las respuestas de producto a estas preguntas son la ficha de hechos del producto. Donde no la cubrían, se tomaron estos supuestos:

- SUPUESTO: Los estados son fijos y no se pueden configurar: Pendiente, En curso y Hecha.
- SUPUESTO: Quien se registra entra directamente en el espacio único y lo ve todo. No hay invitaciones ni aprobación, porque cada instancia la usa un solo equipo.
- SUPUESTO: Cualquier usuario registrado puede ser responsable de una tarea, y una tarea tiene como mucho un responsable.
- SUPUESTO: Para crear una tarea solo hace falta el título. El responsable y la fecha de vencimiento son opcionales.
- SUPUESTO: Cualquiera puede cambiar el estado, reasignar o cambiar la fecha de vencimiento de cualquier tarea, también las de otros, porque los roles son planos.
- SUPUESTO: "Qué se ha movido" se ve con la fecha de la última actualización de cada tarea, ordenando por la más reciente. No hay registro histórico de cambios ni marca de "nuevo desde tu última visita".
- SUPUESTO: Una tarea está "pasada de plazo" si tiene fecha de vencimiento anterior a hoy y no está en Hecha. Se calcula con la fecha del navegador de cada usuario, sin gestionar husos horarios aparte.
- SUPUESTO: Las tareas no se borran. Una tarea errónea o duplicada se lleva a Hecha y el filtro por estado la oculta.
- SUPUESTO: Cuando dos personas cambian la misma tarea, gana el último cambio. No hay bloqueo ni aviso de conflicto.
- SUPUESTO: El MVP es solo web, pensado para escritorio, en castellano y sin app móvil.
- SUPUESTO: Los usuarios del caso de estudio son sobre todo desarrolladores de producto, y la lista se usa como cola de trabajo personal y de equipo a la vez.

## 3. El alcance

### Problema

En un equipo remoto pequeño nadie ve en qué está cada uno sin interrumpir a alguien. Por eso existe la ronda de "¿en qué estás?" en la daily, que se come la mitad de sus 15 minutos, y los "¿cómo va?" constantes por chat. Cuando esa información no llega a tiempo, el coste es real: dos personas tocaron el mismo módulo la misma semana sin saberlo y se perdieron dos días.

### Usuarios

Equipos remotos de 3 a 10 personas, repartidos en varios husos horarios y sin jerarquía dentro de la herramienta. El valor se lo llevan los compañeros, no un lead:

- **Quien va a empezar algo** y quiere saber si ya lo está tocando otra persona.
- **Quien escribe el estado**: la lista es su propia cola de trabajo, y si está al día deja de recibir preguntas.

Caso de estudio: un equipo de 6 personas de un producto SaaS, en 3 husos horarios, con un gestor de tareas pesado y una daily de 15 minutos por videollamada.

### Propuesta de valor

Una lista compartida de tareas, siempre al día, donde se ve de un vistazo quién está en qué, qué está libre y qué se ha pasado de plazo. Actualizarla son dos clics y los cambios aparecen sin refrescar. Sirve para dos decisiones: no empezar lo que ya tiene otra persona y elegir lo siguiente entre lo que está libre. FlowSync sustituye al gestor de tareas, no convive con él.

El riesgo número uno a validar es que el estado se quede viejo. Lo mitigamos haciendo que actualizar cueste lo mínimo, no obligando a nadie. El criterio de éxito: tras una semana de uso real, el equipo ha dejado de hacer la ronda de "¿en qué estás?" y nadie pide recuperarla.

### Alcance

El registro, el login y la sesión ya existen y no se cuentan aquí.

1. Una única lista de tareas, compartida por todo el equipo.
2. Crear una tarea escribiendo solo el título, desde la propia lista.
3. Cambiar el estado de una tarea (Pendiente, En curso, Hecha) en dos clics desde la lista. Si pasas a En curso una tarea sin responsable, te la asignas.
4. Asignar o reasignar el responsable, incluido "me la quedo yo".
5. Poner o cambiar una fecha de vencimiento opcional, con las tareas vencidas marcadas a simple vista.
6. Filtrar la lista por estado.
7. Ver los cambios de los demás sin recargar la página.
8. Ver en cada tarea cuándo se movió por última vez, con la lista ordenada por la actividad más reciente.

### NO-alcance

- **Corregir el título de una tarea y borrarla**: no ayuda a validar ni que el estado se mantenga fresco ni que se eviten colisiones. Coste asumido: una tarea errónea o duplicada se lleva a Hecha, aunque eso ensucia un poco el significado de Hecha.
- **Quién hizo el último cambio de una tarea**: para decidir qué coger basta con saber qué se ha movido y quién es el responsable. Quién hizo el último cambio no cambia esa decisión.
- **Notificaciones push**: la hipótesis es que basta con un resumen que espera a que lo mires. Un aviso que interrumpe pone a prueba otra cosa y además rompe esa promesa.
- **Integración con Slack**: llevar la información al chat no prueba que la lista sustituya a la pregunta. Al contrario, devuelve la conversación al canal del que queremos sacarla.
- **Estado derivado de Git, PRs, CI o calendario**: lo que validamos es que la gente teclea su estado si cuesta dos clics. Derivarlo automáticamente es otra hipótesis y otro producto.
- **Importar o sincronizar con otro gestor de tareas**: convivir con otra herramienta obliga a actualizar dos veces, que es justo lo que hace que el estado se quede viejo.
- **Roles y permisos**: con 3 a 10 personas sin jerarquía, los permisos no cambian ni la frescura del estado ni el evitar colisiones.
- **Varios equipos o espacios, o personas en más de uno**: el caso de estudio es un solo equipo, y separar espacios no aporta nada a la pregunta de si se cancela la ronda de la daily.
- **Presencia, "quién está conectado" o indicadores de actividad**: lo que importa es el estado de la tarea, no de la persona. Medir actividad sería vigilancia y no ayuda a decidir qué coger.
- **Comentarios en las tareas**: abren una conversación dentro de la herramienta. No validan la frescura y añaden fricción a algo que debe costar dos clics.
- **Descripción, prioridad, etiquetas, sprints, estimaciones, épicas y backlog priorizado**: cada campo de más encarece actualizar. Un equipo que necesita eso no es nuestro usuario.
- **Estados configurables**: con tres estados fijos basta para saber quién está en qué. Configurarlos es el "rollo" del que huimos.
- **Analítica e informes**: nadie reporta hacia arriba. El éxito se mide con lo que hace el equipo en la daily, no con métricas dentro del producto.
- **Historial de cambios por tarea**: para saber qué se ha movido basta con la fecha del último cambio y el orden por actividad reciente. Un historial completo no cambia ninguna decisión.
- **Gestión de bloqueos**: la hipótesis es que ver el estado del equipo hace innecesaria la ronda de "¿en qué estás?". Los bloqueos son otra parte de la daily, que se mantiene, así que resolverlos no aporta evidencia sobre esa hipótesis.
- **App móvil**: las hipótesis (que el estado se mantiene fresco si cuesta dos clics, que se evitan colisiones y que cae la ronda de la daily) se pueden validar con un solo canal. Un segundo canal no aporta evidencia sobre ninguna de ellas.
- **Chat y edición colaborativa simultánea**: el "tiempo real" que buscamos es que el estado esté al día, no conversar ni coeditar.

## Parte B: las tres líneas

**Los dos números:** la IA propuso 9 cosas dentro del alcance; tras mi recorte quedaron 8.

**Tres cosas que dejé fuera:**
- Corregir el título y borrar tareas: no ayuda a validar ni que el estado se mantenga fresco ni que se eviten colisiones; los errores se llevan a Hecha.
- Quién hizo el último cambio: no cambia la decisión de qué coger; para eso basta con el responsable y el orden por actividad reciente.
- Historial de cambios por tarea: para saber qué se ha movido basta con la fecha del último cambio; un historial no cambia ninguna decisión.

**La exclusión de la que menos seguro estoy:** la marca de "nuevo desde tu última visita". El caso central del producto es "llego por la mañana y veo qué se ha movido", y ordenar por fecha es lo barato, pero no sé si basta para verlo de un vistazo. Lo que se contradice: lo barato contra lo que valida la propuesta de valor. Entraría si en la semana de prueba el equipo sigue preguntando en la daily "¿qué ha cambiado desde ayer?".

📌 **La IA me corrigió y tenía razón:** al quitar "corregir la fecha" dejé el punto 5 imposible de cumplir, y al quitar "quién hizo el último cambio" una tarea podía estar En curso sin que se supiera quién la tocaba, que es justo el caso de la colisión que motiva el producto. Lo resolví dejando la fecha editable y haciendo que pasar a En curso te asigne la tarea.