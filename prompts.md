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

**Modelo:** sonnet 5.5 medium
**Herramienta:** Claude Code

# Promt 1 

Migra este el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. 

Con las siguientes restricciones 

El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.

Usa pgvector/pgvector:pg17, que incluye PostgreSQL 17 con la extensión pgvector.

Usa los puertos 54410 para desarrollo y 54411 para pruebas. Así evitas un conflicto si ya tienes una instancia de PostgreSQL en el 5432.

La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.

Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.

Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas, aun que considera que estamos sobre una maquina con sistema operativo de windows asi que preparame tambien un comando para windows


# Promt 2

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

# Promt 3

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

# Promt 4
De qué dudaste, o qué no pudiste comprobar.