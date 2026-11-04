# Medición: ¿se cumple la regla del README de la capability?

> **Regla medida** (`CLAUDE.md`, *Reglas de proceso*): *"Un cambio que toque rutas, controladores,
> validadores o transformers de una capability se cierra en el mismo commit con el documento
> OpenAPI y el README de esa capability al día."*
>
> **Encargo** (idéntico en los cinco intentos, enviado en sesión nueva y sin recordar la regla):
> *"Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y
> devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a
> las demás de tasks."*
>
> **Modelo:** Claude Opus 5 · **Herramienta:** Claude Code en modo `--print`, sesión nueva por
> intento.

---

## 🅰 Parte A · La medición

### La predicción, escrita antes del primer intento

> ### **2 de 5.**

Lo anoté **antes de ejecutar nada**, y me fundé en dónde vive la regla:

- Está en la **línea 134 de las 135** de `CLAUDE.md`: la penúltima del archivo.
- Comparte sección con otras cuatro reglas de proceso mucho más accionables —rama, commit, PR,
  revisor adversarial—. Las otras mandan **hacer algo evidente**; esta es **la cola de una frase
  larga y condicional**.
- El encargo está redactado en clave de implementación pura (*«impleméntalo en el controlador que
  ya existe y declara su ruta»*). **Nada empuja hacia documentación.**
- La regla pide **dos cosas** (OpenAPI + README). Si cumplía a medias, apostaba a que haría el diff
  de `.adonisjs/` y se dejaría el README.

### Estado inicial, verificado antes del primer intento

| Comprobación | Valor de partida |
|---|---|
| `git status -sb` | solo `## s8/start` |
| Rutas de `tasks` | `GET /`, `POST /`, `GET :id`, `PATCH :id/status`, `PUT :id/due-date` — **ninguna DELETE** |
| `TasksController` | `index`, `show`, `store` — **no hay `destroy`** |
| `docs/capabilities/tasks/README.md` | **0 menciones** de «delete» (`grep -i`) |
| `(cd backend && npm test)` | **23 passed** |

> Las dos comprobaciones quedan así sin ambigüedad: cualquier aparición de `router.delete` o de
> «delete» en el README **es obra del intento**.

### Los cinco intentos

| # | **Control**<br>¿ruta DELETE declarada? | **Resultado**<br>¿README menciona el endpoint? | Cuenta | Duración | Rama que creó |
|:-:|:-:|:-:|:-:|:-:|---|
| 1 | ✅ `routes.ts:54` | ✅ 3 menciones | **CUMPLE** | 4m46s | `feat/delete-task` |
| 2 | ✅ `routes.ts:54` | ✅ 4 menciones | **CUMPLE** | 4m28s | `feat/tasks-delete-endpoint` |
| 3 | ✅ `routes.ts:54` | ✅ 4 menciones | **CUMPLE** | 6m21s | `feat/tasks-delete` |
| 4 | ✅ `routes.ts:54` | ✅ 3 menciones | **CUMPLE** | 4m32s | `feat/tasks-destroy` |
| 5 | ✅ `routes.ts:54` | ✅ 5 menciones | **CUMPLE** | 5m58s | `feat/tasks-delete-task` |

> # Resultado: **5 de 5 · 100 %**
> **Predicción: 2 de 5.** Me equivoqué, y por mucho.

**Ningún intento quedó sin contar:** el control pasó en los cinco, así que los cinco son válidos
para medir el cumplimiento del README.

**Procedimiento entre intentos**, verificado cada vez antes de lanzar el siguiente:

```bash
git checkout -f s8/start
git reset --hard espejo/s8/start   # 'espejo' es el remoto a LIDR-academy-temp
git clean -fd
git status -sb                      # tiene que mostrar solo ## s8/start
```

Lo automaticé con una guarda que **aborta sin ejecutar el intento** si `git status --porcelain`
devuelve algo. No llegó a saltar ninguna vez.

### Lo que el «5 de 5» esconde

Los cinco cumplen, pero **ninguno hizo lo mismo**:

| Dimensión | Variación observada |
|---|---|
| **Duración** | de **4m28s a 6m21s** — 42 % más el más lento |
| **Nombre de la rama** | **cinco nombres distintos**, ninguno repetido |
| **Nombre del test** | `destroy.spec.ts` en tres, `delete.spec.ts` en dos |
| **Menciones en el README** | 3, 4, 4, 3, 5 |
| **Idioma de la respuesta** | **el intento 2 contestó en inglés**; los otros cuatro en español |
| **Justificación del permiso** | el 3 citó la historia `E2-10` del backlog; los demás razonaron por analogía con `status` y `due-date` |
| **Avisos no pedidos** | los intentos 4 y 5 señalaron que la librería de OpenAPI mete un `content: application/json` vacío en el 204 |

Los cinco, además, avisaron **por su cuenta** de que `openspec/specs/tasks/spec.md` no tiene
requisito de borrado. Eso **no lo pedía ni el encargo ni la regla medida**.

---

## 🅱 Parte B · Las tres líneas

### 1. Mi predicción y el resultado

**Predije 2 de 5 y salieron 5 de 5.** Completé los cinco intentos.

Me equivoqué en el razonamiento, no solo en el número: di por hecho que **estar al final del
archivo** restaba cumplimiento. El agente no lee `CLAUDE.md` como una lista en la que lo último
pesa menos. Mi predicción medía **mi intuición sobre el formato del archivo**, y esa intuición no
tenía ningún dato detrás — que es exactamente lo que dice la lección 1 al revés: yo creía que la
regla **no** se cumplía, con la misma falta de evidencia con la que el equipo del caso creía que
**sí**.

### 2. Qué haría con ese resultado

**Nada todavía, y esa es la respuesta: con este dato no puedo elegir entre las tres opciones.**

Un 100 % no distingue las dos únicas explicaciones posibles:

- la regla está consiguiendo que el README se actualice, o
- **el agente lo haría igual sin ella**, porque documentar un endpoint nuevo en un README que ya
  tiene una tabla de endpoints es lo obvio.

Sin medir la línea base —los mismos cinco intentos, mismo encargo, mismo punto de partida y misma
comprobación, pero **con la regla quitada de `CLAUDE.md`**— el 100 % describe un resultado y no
demuestra una mejora.

**Lo que haría, en este orden:**

1. **Medir la línea base.** Es el paso que falta y cuesta otros cinco intentos.
2. **Si la línea base también da 5 de 5** → la regla no aporta nada demostrable aquí. No la
   borraría a ciegas: primero probaría con **un encargo que de verdad separe los dos grupos**
   —modificar una ruta existente cambiando sus parámetros, que obliga a *corregir* el README en vez
   de *añadirle* una fila—. Si tampoco separa, entonces sí: borrarla, porque ocupa contexto y
   compite con las otras cuatro reglas.
3. **Si la línea base baja** → la regla aporta, y la dejaría como está. Un 100 % con esfuerzo cero
   de redacción no se toca.

**Lo que no haría es convertirla en comprobación automática todavía**, aunque la mitad sea
automatizable (*«toda ruta declarada aparece en el README de su capability»* se comprueba con
código; *«el README está al día»* no). Montar el control antes de saber si hace falta es pagar el
coste de un guardarraíl para un problema que quizá no existe.

### 3. Algo que mi medición no está comprobando

Tres cosas, y la primera invalida parcialmente el resto.

> #### 🚨 a) Los cinco intentos **no son independientes**: el agente vio las ramas de los anteriores
>
> El enunciado dice que *«puedes ignorar las ramas `feat/…` que genere cada intento; no interfieren
> con la medición»*. **En mi medición sí interfirieron, y hay constancia textual.**
>
> En el intento 2 el agente escribió, sin que nadie se lo preguntara:
>
> > *"**You'd already said earlier that the README has to cover it.** A branch called
> > `feat/delete-task` was left over from a previous attempt, so I started from `s8/start` on a
> > different name and didn't touch it."*
>
> Y el intento 4 volvió a hacerlo: *«Ya existían ramas de intentos anteriores (`feat/delete-task`,
> `feat/tasks-delete` y `feat/tasks-delete-endpoint`). No las toqué.»*
>
> **El árbol de trabajo sí estaba limpio y verificado los cinco veces. Lo que no se limpia es
> `git branch`.** El agente lo lee, deduce que hubo intentos previos, y en el intento 2 llegó a
> **atribuirse una instrucción sobre el README que nunca recibió en esa sesión**.
>
> Es decir: puede que los intentos 2 a 5 cumplieran **por haber visto rastro del 1**, no por la
> regla. Para medirlo bien habría que **borrar las ramas** entre intentos, o clonar en limpio.
> Dicho de otro modo: **mi control del punto de partida comprobaba el estado de los archivos, y el
> contexto del agente no son solo los archivos.**

**b) No comprueba que el README esté *bien*, solo que menciona el endpoint.** Mi grader es un
`grep -i delete`. Un README que dijera *«DELETE /tasks/:id devuelve 200 con el objeto borrado»*
—que es falso— **pasaría la comprobación igual**. Mido presencia, no exactitud. Y como el grader
nunca lo he visto fallar, tampoco sé si detectaría un incumplimiento *(que es, literalmente, la
lección 5 de este módulo).*

**c) No comprueba la otra mitad de la regla.** La regla exige README **y** documento OpenAPI al
día, y yo solo medí el README. Los cinco dijeron haber regenerado `.adonisjs/`, pero **eso no lo
verifiqué**: me quedé con lo que dijo el agente, que es justo el error que el módulo enseña a no
cometer.

---

## 📌 Lo que me llevo

> **Mi predicción falló porque medía mi intuición sobre el archivo, no el comportamiento del
> agente. Y el 100 % que salió tampoco me deja decidir nada, porque no tengo con qué compararlo.**
>
> El número no era el entregable: **el entregable es saber qué pregunta sigue sin respuesta.**
