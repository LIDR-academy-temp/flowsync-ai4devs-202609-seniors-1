# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambiaron de valor.
- No toca datos. Las tablas están vacías. Tests se ejecutan bajo una transacción global (withGlobalTransaction()) que se deshace al terminar.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Comportamiento ante cambios de timezone del usuario. Busqué como se calcula y aplica (función isOverdueOn, y de donde procede el referenceDay > procede de frontend/src/lib/api.ts:156, localToday())

- No pude validar nada a nivel de datos migrados (tablas vacías)

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- ¿Debería haber hecho un seed inicial antes de proceder a la migración? En el ejercicio no se especificaba, pr eso no lo he hecho. En un entorno real, si lo hubiera forzado, con casos extremos.
  

