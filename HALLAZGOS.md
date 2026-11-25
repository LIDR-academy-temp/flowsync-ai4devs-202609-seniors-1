# Hallazgos

Siete tests de contrato (uno por Scenario) y seis unitarios sobre el Requirement **«Cuándo una
tarea está vencida»**. Ni una línea tocada fuera de `backend/tests/`.

## 1. Las cifras

```
Tests  44 passed, 3 failed (47)     ← suite funcional entera
Tests   4 passed, 3 failed  (7)     ← solo mi grupo, Tasks | vencimiento
Tests   4 passed, 2 failed  (6)     ← la suite unitaria, en 18 ms
```

**3 de mis 7 casos nuevos en rojo, y los 40 que ya había, los 40 en verde.** Los tres rojos son
«Fecha del día anterior», «Darla por hecha la deja de vencer» y «Una tarea hecha con la fecha
pasada».

## 2. Cuál pasó, y por qué

Pasaron cuatro: *Vencer hoy todavía no es estar vencida*, *Fecha futura*, *Sin fecha no se vence
nunca* y *Aplazar resuelve el vencimiento*. Mirando qué tienen en común los que fallaron, salen
**dos fallos distintos, no uno**:

- Los dos primeros rojos esperan un `isOverdue: true` leído por **`GET`**. La columna es
  `table.date(...)`, así que el driver sube un **`Date`**, no un texto — medido, no supuesto:

  ```
  constructor                : Date
  serializado a JSON         : "2026-08-19T06:00:00.000Z"
  d < '2026-08-20'           : false   ← lo que ejecuta isOverdueOn
  '2026-08-19' < '2026-08-20': true    ← lo que promete su docblock
  ```

  Ese `06:00:00.000Z` es medianoche en CDMX: **el huso que el docblock dice haber evitado está
  dentro del dato**. Por el `GET`, nada sale vencido nunca.

- El tercer rojo espera un `false` leído por **`PUT`**, donde `dueDate` todavía es el texto que el
  controlador acaba de asignar en memoria. Ahí la comparación sí funciona — y deja a la vista que
  `isOverdueOn` **no mira el estado `done`**.

👉 **Los cuatro que pasaron son los que nunca le piden al sistema que diga «sí».** Tres sólo
esperan `false`, y una regla que contesta `false` a todo los satisface: pasarían igual con un
`return false`. El cuarto, *Aplazar*, pasa porque **sus dos lecturas son respuestas del `PUT`** y
nunca vuelve a la base. El único que pasa por derecho propio es *Sin fecha*: el `null` es la parte
de la regla que sí está completa, y lo único que cruza la base sin convertirse en otra cosa.

Y el remate: **el fallo del `Date` tapa al del `done`.** Por el `GET` todo es `false`, que es justo
lo que una tarea hecha debe devolver, así que por ahí el `done` que falta no se ve. Si hubiera
probado sólo por la consulta —lo natural— tendría dos rojos y un fallo invisible. Lo que lo destapó
fue comprobar **las dos lecturas del mismo dato**.

## 3. De qué dudé

Mi predicción, escrita antes de ejecutar nada, decía **2 rojos**; fueron **3**. Acerté los dos del
`done` y no vi el del tipo, que además rompe el caso más simple de todo el requisito: *una tarea con
fecha de ayer está vencida*. Di por bueno el `tsType: 'string'` de `schema_rules.ts` sin preguntarme
si alguien lo comprueba en ejecución — **nadie lo hace**.

Lo que no pude correr es `make test-e2e` tal cual: depende de `docker compose`, y aquí fallaron
Rancher Desktop (`wsl-init.pid`, agotado), winget con Podman (137 min colgado) y el instalador de
PostgreSQL (UAC). Corrí su última línea, `node ace test functional`, **dos veces**: contra un
PostgreSQL 17.12 nativo y, con Podman ya en pie, contra `pgvector/pgvector:pg17`, la imagen del
`compose.yaml`. **Misma cifra en las dos**, así que el fallo es del tipo que entrega el driver y no
del entorno.

Me queda una duda que sólo el directo resuelve: la tercera condición está escrita en **tres sitios**
—el docblock de `isOverdueOn`, el Requirement de la spec y la descripción del esquema OpenAPI— y no
está en el código. Tres sitios que lo prometen y ninguno que lo obligue.
