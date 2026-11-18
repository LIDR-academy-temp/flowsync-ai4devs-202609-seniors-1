# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

0 filas cambian de valor: select count(*) from tasks where due_date is not null (y los recuentos de users, tasks y auth_access_tokens) da 0 en el SQLite de partida y en db, y ninguna migración modifica datos (no hay update, insert ni raw; due_date se añadió nulable y sin valor por defecto). Rama: [rama]. Es un cambio de motor sin transformar datos y se deshace volviendo a s10/start sin perder nada. Lo que cambia no es el valor guardado sino cómo se lee: pg devuelve due_date como Date.

-

## 2. Lo que la batería de pruebas no podía ver

isOverdue es siempre false al releer una tarea. Con una tarea vencida, PUT /tasks/1/due-date {"dueDate":"2026-11-01"} devuelve isOverdue: true, pero GET /tasks/1?today=2026-11-18 devuelve false. El motivo es que pg entrega un Date y task.ts:52-56 lo compara con un string, lo que en JavaScript da NaN y siempre false. typecheck no lo ve porque schema_rules.ts:27-33 fija el tipo a string, y ningún test relee la tarea después de fijar la fecha (grep -i "due|overdue|vencid" en tests/ no encuentra nada). Tampoco hay test para dos efectos relacionados: dueDate sale como instante ISO, lo que rompe el format: date de openapi.json, y un fullName de más de 255 caracteres ahora da un 500, porque SQLite no aplicaba el límite de varchar(255).

-

## 3. Tu duda

No pude situar el cambio en el árbol de reversibilidad con lo que hay en el repo: solo lo nombra el README, que remite a la lección. No comprobé:

el frontend: cómo se ve allí el dueDate como instante o el isOverdue siempre falso;
el desfase de un día con TZ distinta de UTC más allá de un script;
el cambio en openapi.yml, porque openapi:check ya fallaba antes con Invalid URL (la prueba en una copia limpia usó los node_modules actuales, así que no es concluyente);
el comportamiento de SQLite con la app antigua, que verifiqué solo con sqlite3 en memoria.

-
