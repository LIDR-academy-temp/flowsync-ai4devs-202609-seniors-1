Parte A: El resultado de las 5 ejecuciones

1 ejecucion:
Control: Esta creado
Resultado: Ha modificado el readme de la capability

2 ejecucion:
Control: Esta creado
Resultado: Ha modificado el readme de la capability

3 ejecucion:
Control: Esta creado
Resultado: Ha modificado el readme de la capability

4 ejecucion:
Control: Esta creado
Resultado: Ha modificado el readme de la capability

5 ejecucion:
Control: Esta creado
Resultado: Ha modificado el readme de la capability

Parte B: Las tres líneas

1. Apuesta y resultado.
El resultado es 5 de 5 con el control en verde en todos: ruta DELETE declarada y README con el endpoint. Yo dije que 3, pero al final el resultado ha sido de 5.

2. Qué haría con el número: no borrar la regla y convertirla además en una comprobación automática.
- No dice que la regla sea fiable. 5 de 5 es una muestra muy pequeña.
- El fallo es silencioso y la comprobación es barata. Hablo de un hook o paso de CI.

3. Lo que la medición no mide. Hay varias cosas; elige la que más te convenza.
- No hay línea base, y es la más importante. No sabemos si el 5 de 5 se debe a la regla de CLAUDE.md. El propio README de la capability dice "Si cambia un transformer o un validador, se actualiza en el mismo commit", y el encargo nombra la capability tasks, así que el agente abre ese README y ve que es la tabla de endpoints. Probablemente lo actualizaría sin la regla. Para saberlo, habría que repetir la medición sin esa línea en CLAUDE.md.
