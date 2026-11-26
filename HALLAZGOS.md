# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1 Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

-Los test de escenario, Todos los que habian en verde, de los nuevos 3 fallaron
Los test unitarios, 4 fallaron y pasaron 2

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

-En verde: "Vencer hoy", "Fecha futura", "Sin fecha" y "Hecha con fecha pasada". Pasan por la razón equivocada, porque hoy isOverdue es siempre false. No te dicen nada hasta que se arreglen los otros tres.

Causa del rojo: la API devuelve dueDate como "2026-08-12T00:00:00.000Z", no como "2026-08-12". Parece que Postgres entrega la columna date como objeto Date. Por eso isOverdueOn (task.ts:77) compara un Date con un texto y nunca da verdadero.

## 3. De qué dudaste, o qué no pudiste comprobar.

De qué dudaste, o qué no pudiste comprobar.

-No pude comprobar el comparativo de fechas contra la base de datos
