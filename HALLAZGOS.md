# Hallazgos

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

- 5 de 13 de los nuevos fallaron. 40 de los 40 que había siguen pasando. 

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. 

Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

- Pasaron 8: en los funcionales (4), «Vencer hoy», «Fecha futura» y «Hecha con la fecha pasada» esperan `false` y lo obtienen porque en el `GET` la fecha llega de la base como `Date` y `Date < string` es siempre `false` (los 3 rojos necesitan un `true`), y «Sin fecha» porque la regla sale antes por `null`; en los unitarios (4), anterior, igual, posterior y sin fecha pasan porque la fecha les llega como texto, que es lo que el código espera, o nula; «Hecha con la fecha pasada» pasa por HTTP pero falla en el unitario porque la regla no mira el estado y el fallo de la fecha lo tapa.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No comprobé que un `PUT` con fecha pasada sobre una tarea hecha responda `isOverdue: true`, ni que, arreglando solo la fecha, «Hecha con la fecha pasada» pase a rojo y «Darla por hecha», que ya está en rojo en su precondición, pase a fallar en la comprobación final (ambas cosas deducidas del código); como objeto de fecha solo probé `Date`, no `DateTime` de Luxon, y el unitario de texto frente a objeto se detiene en la fecha anterior sin llegar a la igual ni a la posterior; el agente había leído `task.ts` antes de que le pidiera no hacerlo; y el `GET` devuelve `dueDate` con hora y el `PUT` sin ella, así que el `notEqual` de «Aplazar» se cumpliría aunque la fecha no cambiara (hoy el test no llega hasta él).
