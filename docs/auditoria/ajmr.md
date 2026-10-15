# Auditoría de las reglas de proceso

> Reglas auditadas: la sección `## Reglas de proceso` de `CLAUDE.md` en **`s5/start`**.
> `AGENTS.md` es un symlink que apunta ahí.

## Mi expectativa, anotada ANTES de mirar el historial

| # | Regla (resumida) | Lo que creía |
|:-:|---|:-:|
| 1 | La rama es **por unidad de trabajo**: si ya estás en una, sigue en ella; solo desde `main`/`sN/*` se crea otra. Nunca commitear directo en `main` ni en una `sN/*` | **sí** |
| 2 | El commit es **por petición**: al cerrar cada una, skill `/commit` | **sí** |
| 3 | Un cambio que toque rutas, controladores, validadores o transformers **se cierra en el mismo commit** con el OpenAPI (`.adonisjs/` regenerado) y el `README.md` de esa capability | **ni idea** |
| 4 | `gh pr create` y el pase del `adversarial-reviewer` van **una sola vez al terminar la unidad de trabajo**, no por petición. El review adversarial es lo último | **no** |
| 5 | No repetir el resumen en el chat; responder solo con la URL del PR | **ni idea** |

> 🔎 **De dónde sale cada palabra.** Las anoté sobre las **4 reglas de `s4/start`**, antes de
> descubrir que `s5/start` trae **5 reescritas** (son las que el mentor editó en vivo en la S4). El
> mapeo, para que la procedencia quede a la vista:
>
> | Regla vieja (s4) | Mi palabra | Va a |
> |---|:-:|---|
> | Rama nueva `feat/<slug>` | sí | → **1** |
> | `/commit` **y** `gh pr create` | sí | → **2**, la mitad del commit |
> | Pasar el `adversarial-reviewer` | **no** | → **4**, que ahora funde PR y review; me quedo con el «no» por ser la mitad más estricta |
> | No repetir el resumen | ni idea | → **5** |
> | *(no existía)* | **ni idea** | → **3** |

---

## La tabla

**Contrastado contra los últimos 15 commits de `s5/start`** (de `b955a72` a `a3bb962`) y el estado
actual de los archivos. **No se modificó ningún archivo del proyecto.**

> ⏳ **Dos de las reglas se escribieron dentro de la ventana auditada**, así que solo pueden juzgar
> a los commits posteriores: la **3** nace en `160fbc7` (quedan **5** commits después) y la **1** y
> la **4** en `0e56705` (quedan **12**). Un commit anterior a su regla no la puede incumplir.

| # | Qué pide la regla | Qué se revisó | Veredicto | Evidencia | Qué haría con ella |
|:-:|---|---|---|---|---|
| **1** | Rama por unidad de trabajo; seguir en ella si ya estás; nunca commitear directo en `main` ni en `sN/*` | `git log --all --format=%p \| awk 'NF>1'` · `git branch -a \| grep feat/` · `git log -15 --format="%ae %ce"` | **No se puede comprobar** | **El historial está reescrito:** autor ≠ committer en **10 de 15**. Y en los 12 commits posteriores a la regla: **0 ramas `feat/*`**, **0 merges**, **0 subjects con `(#N)`**. Un rebase borra la rama de origen: **no queda forma de saber si existió** | **Reformularla.** Tal como está, cualquier rebase la vuelve inauditable. La versión comprobable habla del PR, no de la rama |
| **2** | El commit es **por petición**: al cerrar cada una, skill `/commit` *(que genera `tipo(scope): descripción`)* | `.claude/skills/commit/SKILL.md` para saber qué formato produce · los 15 subjects contra ese patrón | **Se cumple** *(la mitad observable)* | **15 de 15** siguen `tipo(scope): desc`, sin una sola excepción. ⚠️ Dos matices: el formato **no prueba que la skill se usara** —se escribe igual a mano— y **«por petición» no deja rastro**: el repo no sabe dónde empezó y acabó cada petición | **Convertirla en comprobación automática** en su mitad verificable (el formato, con un hook o en CI). La cadencia «por petición» **no es auditable y conviene no fingir que lo es** |
| **3** | Un cambio que toque rutas, controladores, validadores o transformers se cierra **en el mismo commit** con el OpenAPI (`.adonisjs/` regenerado) y el `README.md` de la capability | Los 15 commits filtrados por `backend/(start/routes\|app/(controllers\|validators\|transformers))` · y **regeneré el codegen yo** para ver si quedaba diff | **Se cumple** | **Solo un commit cae dentro de la regla: `cbe9617`** (los otros dos que tocan capability, `ea5db1f` y `4e03d1f`, son anteriores a ella). Tocó 3 controladores y **sí actualizó `docs/capabilities/tasks/README.md`**. No trajo `.adonisjs/` — **y comprobé que no tenía nada que traer**: decorar controladores no cambia el codegen | **Reformularla.** Ver la segunda línea: **la evidencia que nombra no sirve para distinguir cumplir de olvidarse** |
| **4** | `gh pr create` y el `adversarial-reviewer` **una sola vez al terminar la unidad de trabajo**, el review lo último | `git log -15` buscando referencias a PR · `.claude/agents/adversarial-reviewer.md` · `.claude/settings.json` | **No se puede comprobar** | **Ni el PR ni el paso del subagente dejan rastro en el repositorio.** El subagente **existe y está definido**, pero ejecutarlo no escribe commit, ni fichero, ni entrada de configuración. Y los PRs viven en GitHub: el repo original **devuelve 404 desde ayer**. Falta: acceso a la API de PRs | **Convertirla en comprobación automática.** Si el paso del revisor **dejara un comentario en el PR** —como enseña el propio M5— la regla pasaría a ser auditable sin cambiar nada más |
| **5** | No repetir el resumen en el chat; responder solo con la URL del PR | `git log -15` · todo el árbol de trabajo | **No se puede comprobar** | **Es una regla sobre la conversación, y la conversación no está en el repositorio.** Ningún archivo, commit ni configuración puede testificar. Falta: el transcript de la sesión, **que por diseño se pierde** | **Borrarla** — ver la tercera línea |

> ✅ **Comprobado por mi cuenta, no por resumen del agente: la fila 3, y casi me cuesta un falso
> positivo.** Al regenerar el codegen aparecieron **5 archivos de `.adonisjs/` modificados**, lo que
> parecía confirmar que `cbe9617` se había saltado la regla. **Abrí el diff: el contenido real era
> cero — solo cambios de LF a CRLF de mi Windows.** Restauré el árbol y el veredicto cambió de
> *no se cumple* a *se cumple*.

### Expectativa frente a resultado

| # | Creía | Resultó | |
|:-:|:-:|---|:-:|
| 1 | **sí** | No se puede comprobar | ❌ |
| 2 | **sí** | Se cumple | ✅ |
| 3 | **ni idea** | Se cumple | ➖ |
| 4 | **no** | No se puede comprobar | ❌ |
| 5 | **ni idea** | No se puede comprobar | ✅ |

**Se cumple: 2 · No se cumple: 0 · No se puede comprobar: 3.**

---

## Las tres líneas

1. **La regla 1 es en la que más me equivoqué.** Dije **sí** con seguridad y la respuesta es **no
   se puede comprobar**: autor distinto del committer en 10 de 15, así que el historial está
   reescrito y el rebase borró la rama de origen. **Me equivoqué dos veces: en el veredicto y en
   creer que había algo que mirar.** Y la regla 4 es el mismo error al revés — dije **no**, que es
   igual de infundado cuando no hay evidencia. **Las dos veces que no dije «ni idea», debí decirlo.**

2. **La regla 3 no se puede comprobar bien, y lo raro es que sale «se cumple» por accidente:** pide
   commitear «el diff regenerado de `.adonisjs/`», pero **decorar controladores no genera ningún
   diff**, así que un commit sin `.adonisjs/` es indistinguible de uno que se lo saltó. Para
   verificarla habría que **cambiar la evidencia que nombra**: en vez de un diff que a veces no
   existe, **comparar el documento servido contra el código** —la comprobación «generado contra su
   fuente» de la lección 2— que siempre da una respuesta.

3. **Eliminaría la regla 5 —no repetir el resumen en el chat— por el caso de «nadie la sigue y
   tampoco aporta valor»:** no es que se incumpla, es que **el repositorio no puede saberlo nunca**,
   y lo que de verdad protege —que el PR tenga cuerpo— **ya lo pide la regla 4**. Es una instrucción
   de estilo de conversación viviendo en un archivo que se audita contra commits.

---

## 🧭 Lo que me llevo

**Tres de cinco salieron «no se puede comprobar», y ninguna por falta de tiempo.** Piden cosas que
no dejan rastro: trabajar en una rama que luego se rebasa, pasar un subagente, y no repetir un
resumen en un chat.

> La [lección 1](../../contenidos/modulo-05/01-de-la-regla-al-guardarrail.md) dice que las reglas se
> colocan **según cómo fallan**. Lo que esta auditoría añade: **antes hay que preguntarse si fallar
> deja marca.** Una regla que no deja marca **no se puede colocar en ninguna capa**, porque no hay
> nada que la capa pueda mirar.

**Y la regla 3 enseña algo más fino:** sí deja marca, pero **la marca que nombra no distingue
cumplir de olvidarse**. Eso es peor que no tener evidencia, porque **parece que la tienes** — es la
misma trampa que la lección 1 describe con *"una comprobación que aprueba textos vacíos porque
tienen el formato correcto"*.
