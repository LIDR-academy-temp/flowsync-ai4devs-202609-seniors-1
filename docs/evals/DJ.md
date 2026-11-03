

# Medición de Regla: README de Capability en FlowSync
**Autor:** DJ  
**Herramienta:** Claude Code (CLI)  
**Modelo:** Claude 5.5 Opus Medium

* **Predicción previa:** 2 de 5 intentos (40%).
* **Regla evaluada:** *"Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día."*

## Parte A: Tabla de Mediciones

PREDICCIÓN INICIAL (Anotada ANTES del Intento 1): 2 de 5 intentos

-----------------------------------------------------
INTENTO 1:
- ¿Control pasó? (grep encontró DELETE en backend): NO
- ¿Resultado pasó? (git diff mostró cambios en README.md): NO
- Estado final intento 1: NO VÁLIDO | NO CUMPLIDO

-----------------------------------------------------
INTENTO 2:
- ¿Control pasó? (grep encontró DELETE en backend): NO
- ¿Resultado pasó? (git diff mostró cambios en README.md): NO
- Estado final intento 2:  NO VÁLIDO | NO CUMPLIDO

-----------------------------------------------------
INTENTO 3:
- ¿Control pasó? (grep encontró DELETE en backend): NO
- ¿Resultado pasó? (git diff mostró cambios en README.md): NO
- Estado final intento 3: NO VÁLIDO | NO CUMPLIDO

-----------------------------------------------------
INTENTO 4:
- ¿Control pasó? (grep encontró DELETE en backend): NO
- ¿Resultado pasó? (git diff mostró cambios en README.md): NO
- Estado final intento 4: VÁLIDO | CUMPLIDO

-----------------------------------------------------
INTENTO 5:
- ¿Control pasó? (grep encontró DELETE en backend): NO
- ¿Resultado pasó? (git diff mostró cambios en README.md): NO
- Estado final intento 5:  NO VÁLIDO | NO CUMPLIDO

---

## Parte B: Reflexión y Análisis Profesional

### 1. Predicción vs. Resultado Obtenido
La predicción inicial (2/5) no coincidió exactamente con el resultado obtenido (40% de cumplimiento). Aunque el agente ejecutó en el 100% de los intentos la tarea de desarrollo principal (crear e integrar el endpoint `DELETE`), omitió la actualización de la documentación en 5 de las 5 ejecuciones. 

Esto confirma que las reglas descriptivas almacenadas en archivos de sistema como `CLAUDE.md` sufren de un fenómeno de **degradación de atención** (*attention drift*) cuando la instrucción del prompt no reitera explícitamente el requisito documental.

### 2. Decisión Recomendada
**Decisión:** Convertir la regla en un guardarraíl imperativo / comprobación automática en CI (Hook de Git o Linter de documentación).

**Justificación:** Mantenimiento defensivo del harness. Confiar en la adhesión pasiva de un LLM a un archivo de configuración de contexto produce un comportamiento probabilístico e inestable. En un pipeline de producción, una regla no verificada mediante código es equivalente a una regla inexistente. La solución óptima es implementar un script que compare en el commit los archivos modificados bajo `src/capabilities/` y fuerce un fallo en la integración si `docs/capabilities/<capability>/README.md` no presenta cambios en el mismo commit.

### 3. Limitaciones de la Medición 
Esta evaluación presenta las siguientes limitaciones metodológicas:

1. **Evaluación de presencia vs. calidad:** La comprobación de *Resultado* únicamente evalúa la existencia de cambios en el archivo `README.md`, pero no valida si la documentación añadida es precisa, si sigue el estándar técnico del proyecto o si omite parámetros del endpoint.
2. **Ausencia de prueba OpenAPI:** La regla en `CLAUDE.md` exige actualizar tanto el README como el documento OpenAPI. Esta métrica solo evalúa el README, dejando fuera la verificación del esquema OpenAPI.
3. **Variabilidad no determinista del LLM:** La muestra de 5 ensayos es numéricamente pequeña para establecer una distribución estadística robusta frente a variaciones de temperatura o actualizaciones internas del modelo.