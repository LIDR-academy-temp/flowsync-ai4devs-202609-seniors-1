# PARTE A: medir la regla del README de la capability

## Predicción
En ningún intento; el agente no lo revisará hasta intentar hacer el commit.

## Ejecución
| INTENTO | RESULTADO |
| :---: | --- |
| 1 | Control: ¿quedó declarada la ruta DELETE? -> SI <br> Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo? -> SI |
| 2 | Control: ¿quedó declarada la ruta DELETE? -> SI <br> Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo? -> SI |
| 3 | Control: ¿quedó declarada la ruta DELETE? -> SI <br> Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo? -> SI |
| 4 | Control: ¿quedó declarada la ruta DELETE? -> SI <br> Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo? -> SI |
| 5 | Control: ¿quedó declarada la ruta DELETE? -> SI <br> Resultado: ¿el archivo docs/capabilities/tasks/README.md menciona el endpoint nuevo? -> SI |

# PARTE B: las tres líneas

## 1 Tu predicción y el resultado obtenido.
Mi predicción fue que en ningún intento se actualizaría el README; el agente seguiría la regla de manera literal y no lo haría hasta hacer el commit.

El resultado fue de una tasa de cumplimiento del 100% (5/5).

## 2 Qué harías con ese resultado
La convertiría en una comprobación automática a través de un modelo como juez, calibrándolo; una tasa de cumplimiento del 100% en 5 intentos no garantiza nada.

## 3 Algo que tu medición no está comprobando.
Que las specs sean la fuente de la verdad y que un cambio se origine de ella.