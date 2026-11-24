## Prompt 1

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Lee el Requirement «Cuándo una tarea está vencida» y todos sus Scenarios en openspec/specs/tasks/spec.md. Revisa también los archivos existentes en backend/tests/functional/ para ver cómo se configuran las peticiones HTTP, cómo se aíslan los datos entre tests y cómo se manejan los IDs. No escribas ni modifiques ningún archivo todavía, solo resúmeme los escenarios y el patrón técnico que usan los tests actuales.
```

**Qué salió:** 


## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Crea un nuevo archivo de tests funcionales en backend/tests/functional/ para cubrir cada uno de los Scenarios del requisito «Cuándo una tarea está vencida». Cumple estrictamente estas reglas:
1. No modifiques absolutamente ningún archivo fuera de backend/tests/.
2. Haz peticiones HTTP reales al endpoint correspondiente y verifica el campo isOverdue en el cuerpo de la respuesta.
3. Pasa siempre el día de referencia explícitamente en la petición; nunca uses la fecha actual ni el reloj del sistema.
4. Usa exactamente el mismo mecanismo de aislamiento de base de datos que los demás tests en backend/tests/functional/.
5. No hardcodees IDs; captura y utiliza el identificador que devuelva la petición de creación de la tarea.

```

## Prompt 3

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Inspecciona la firma de isOverdueOn en backend/app/models/task.ts sin modificar ese archivo. Crea el directorio backend/tests/unit/ y escribe un archivo de tests unitarios puros (sin levantar servidor HTTP ni tocar base de datos) que pruebe isOverdueOn en estos casos:
1. Fecha de vencimiento anterior al día de referencia y tarea pendiente.
2. Fecha de vencimiento exactamente igual al día de referencia.
3. Fecha de vencimiento posterior al día de referencia.
4. Tarea sin fecha de vencimiento.
5. Tarea ya completada con fecha de vencimiento pasada.
6. Caso adicional de robustez: verificar que isOverdueOn se comporta exactamente igual tanto si recibe la fecha como string (texto) como si la recibe como objeto Date.
Recuerda: no toques ni una línea fuera de backend/tests/
```

