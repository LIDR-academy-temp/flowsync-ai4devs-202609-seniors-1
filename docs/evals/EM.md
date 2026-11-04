# Parte A

## Intento 1

**Control:** **No** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint

## Intento 2

**Control:** **No** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint

## Intento 3

**Control:** **Si** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint

## Intento 4

**Control:** **Si** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint

## Intento 5

**Control:** **Si** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint

## Intento 6

Test adicional. Los anteriores se habian lanzado bajo una misma sesión con /clear entre intentos (además de comprobar en cada caso que el proyecto haya pasado a su estado original).
Lanzo este test adicional porque ha fallado en los dos primeros, y ha empezado a funcionar en los 3 intentos restantes de forma consecutiva.

Aunque esta ejecución posterior aislada no valida nada, era para tratar de ver si a pesar del /clear había algun efecto sobre el contexto.

**Control:** **Si** se declara en docs/api/openapi.json

**Resultado:** docs/capabilities/tasks/README.md **Si** menciona el nuevo endpoint


# Parte B

## Predicción

Inicialmente creo que va a actualizar en los 5 intentos.

Ha actualizado en 3 intentos.

(Finalmente he lanzado una ejecución adicional sobre una ventana nueva. En total ha actualizado todos los ficheros en 4 intentos de 6 en total).


## Qué harías con ese resultado

Reescribirla. (Respuesta sujeta a realizar comprobación contra línea base sin instrucciones)

La parte de la regla en que se pide documentar el readme de la capability si ha funcionado en el 100% de los casos.
La parte de la regla que pide la actualización de openApi la rescribiría indicando la ruta del documento a actualizar. Además indicaría en el readme que el documento de especificación openapi se deja generado en cada commit, guardado y versionado en el repositorio.


## Algo que tu medición no está comprobando.

No está comparando la efectividad de la regla contra una línea base sin esa regla aplicada. 

Sin eso no se puede medir la efectividad de la regla.
