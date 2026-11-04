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

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Generó cambios.


## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)
```

**Qué salió:** 
Dice que no hay documento de openapi, que este se genera a partir de los decoradores  de @foadonis/openapi
Indica cambios en docs/capabilities/tasks/README.md 

## Prompt 3

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
/clear

```

**Qué salió:** 

## Prompt 4

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.

```

**Qué salió:** Generó cambios.


## Prompt 5

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)

```

**Qué salió:** 
Detecta existencia de docs/api/openapi.json, pero no lo ha actualizado (después detalla que es por las instrucciones del readme).
Indica cambios en docs/capabilities/tasks/README.md 


## Prompt 6

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
/clear

```

**Qué salió:** 

## Prompt 7

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.

```

**Qué salió:** Generó cambios.
Advierte que detecta documento docs/api/openapi.json (en contra de lo que dice el readme)


## Prompt 8

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)

```

**Qué salió:** Lista cambios en docs/api/openapi.json (añade Delete) y docs/capabilities/tasks/README.md

## Prompt 9

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
/clear

```

**Qué salió:** 

## Prompt 10

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Generó cambios.


## Prompt 11

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)

```

**Qué salió:**  indica cambios en  docs/api/openapi.json (añade delete, advirtiendo un error en la respuesta) y en docs/capabilities/tasks/README.md

## Prompt 12

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
/clear

```

**Qué salió:** 

## Prompt 13

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.

```

**Qué salió:** Generó cambios.

## Prompt 14

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)
```

**Qué salió:** Inidica cambios en docs/api/openapi.json y en docs/capabilities/tasks/README.md


## Prompt 15

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
/clear
```

**Qué salió:** 


## Prompt 16

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.

```

**Qué salió:** Generó cambios.

## Prompt 17

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code


```
Sin realizar ningún cambio más en ningún fichero, muestrame las diferencias que has generado en el documento de OpenAPI y readme de la capability (ruta del fichero modificado, y cambios efectuados)
```

**Qué salió:**  Inidica cambios en docs/api/openapi.json y en docs/capabilities/tasks/README.md
