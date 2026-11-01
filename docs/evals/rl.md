# Evals - FlowSync - Módulo 8

**Predicción antes de empezar el ejercicio**: creo que seguirá la regla todas las veces, mayormente por el modelo y el esfuerzo que estoy usando.

## Trial 1
- **Control**: Ruta `DELETE` declarada
- **Resultado**: Sí, menciona el endpoint nuevo

## Trial 2
- **Control**: Ruta `DELETE` declarada
- **Resultado**: Sí, menciona el endpoint nuevo

## Trial 3
- **Control**: Ruta `DELETE` declarada
- **Resultado**: Sí, menciona el endpoint nuevo

## Trial 4
- **Control**: Ruta `DELETE` declarada
- **Resultado**: Sí, menciona el endpoint nuevo

## Trial 5
- **Control**: Ruta `DELETE` declarada
- **Resultado**: Sí, menciona el endpoint nuevo

## Parte B

**1. Predicción y el resultado obtenido. Si no completaste los cinco intentos, indica cuántos hiciste.**
Predije que seguiría la regla en todos los trials, y así fue: 5 de 5. Conseguí hacer los 5 en tiempo.

**2. Qué harías con ese resultado: eliminar la regla, reescribirla o convertirla en una comprobación automática. Explica por qué tomarías esa decisión.**
Primeramente me gustaría correr los mismos 5 trials sin la regla, para así ver cómo se comporta el modelo. Luego, con esa línea base, decidiría qué hacer con la regla (si eliminarla o reescribirla). Convertirla en comprobación automática parece complicado, ya que probablemente comprobaríamos sólo formato pero no contenido.

**3. Algo que tu medición no está comprobando. Identifica al menos una limitación de los resultados.**
No se está midiendo la precisión y relevancia de los cambios en el `README.md` de `tasks`, pero es algo difícil de comprobar. De igual forma, como comenté en el punto 2, estas mediciones no nos permiten saber cómo se comportaría el modelo sin esta regla.

Además, la medición no aísla la regla: en 3 de 5 trials (2, 4 y 5) el agente leyó el `README.md` de la raíz, que en `s8/start` es el enunciado del ejercicio y cuenta qué se comprueba; en el trial 2 hasta dijo «es la regla que estás midiendo». Y ninguno de los 5 hizo commit, así que la parte de «en el mismo commit» quedó en 0 de 5, seguramente por una nota de mi memoria de Claude Code que se carga en cada sesión y dice que en los ejercicios del curso se commitea al final.
