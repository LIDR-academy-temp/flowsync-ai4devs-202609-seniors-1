# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambian de valor (SQLite tenía 0 usuarios, 0 tokens y 0 tareas, y las 4 migraciones solo crean tablas o añaden `due_date` como columna nullable). Rama: reversible con otra migración conservando los datos (los `down()` los he leído, pero no ejecutado). Medido antes y después de migrar con:

```
select count(*) from users;
select count(*) from auth_access_tokens;
select count(*) from tasks;
select count(*) from tasks where due_date is not null;
```

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Los tests de `tasks/overdue.spec.ts` que escribió el agente mostraron que `due_date` ya no llega como texto sino como `Date`: 4 de 9 fallaron en PostgreSQL, y los 23 tests existentes seguían en verde porque ninguno lee una tarea con fecha. Efecto: `isOverdueOn` compara `Date < 'AAAA-MM-DD'` y devuelve siempre `false`, y en la API `GET /tasks/:id` devuelve `2026-08-19T00:00:00.000Z` en lugar de `2026-08-19`.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar si `isOverdueOn` ignora el estado `done`, como pide la especificación: el fallo de `due_date` en PostgreSQL hizo fallar la prueba antes de llegar a esa comprobación. Tampoco ejecuté ningún `down()`.
