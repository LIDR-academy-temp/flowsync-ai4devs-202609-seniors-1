#  La tarea

## Parte A: medir la regla del README de la capability

1. Anota tu predicción antes de empezar. Realizado.
2. Envía el encargo exacto en una sesión nueva. Realizado (x5)
3. Haz las dos comprobaciones de cada intento. Realizado (x5)

- Control: ¿quedó declarada la ruta DELETE?
  ```bash
  $ grep delete backend/app/controllers/tasks_controller.ts
      await task.delete()
  ``` 
- Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo?
  ```bash
  $ grep DELETE docs/capabilities/tasks/README.md
  | `DELETE /tasks/:id` | — | [`TasksController.destroy`](../../../backend/app/controllers/tasks_controller.ts) | `204` · sin cuerpo; `404` si no existe |
  curl -s -o /dev/null -w '%{http_code}\n' -X DELETE http://localhost:3333/api/v1/tasks/1 \
  ``` 

4. Devuelve el proyecto a su estado inicial. Ha sido necesario también borrar después de cada ejecución la rama local que creó el agente porque la detectaba y la reutilizaba.

## Parte B: las tres líneas

1. Tu predicción y el resultado obtenido. Predicción = 5. Resultado = 5.
2. Qué harías con ese resultado: convertirla en una comprobación automática porque es un cambio muy acotado.
3. Algo que tu medición no está comprobando. Mis comprobaciones son grep muy sencillos, se podría hacer uso de un modelo para preguntarle si se han realizado esos cambios en ambos ficheros.
