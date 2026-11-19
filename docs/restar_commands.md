# Atajos de bases de datos y pruebas

Atajos del `Makefile` de la raíz para trabajar con las dos bases PostgreSQL de `compose.yaml`.
Se lanzan **desde la raíz del repo** y, en Windows, **dentro de WSL** (`make` y las recetas son POSIX).

| Atajo | Qué hace |
|---|---|
| `make db-up` | Levanta `db` (desarrollo, puerto **54410**) y `db-test` (pruebas, puerto **54411**) con `docker compose up -d --wait`: no devuelve el control hasta que las dos están `healthy`. |
| `make db-down` | `docker compose down`: para y elimina los contenedores. `db` conserva sus datos (volumen `db-data`); `db-test` los pierde (tmpfs). |
| `make db-migrate` | Migra **las dos** bases: `db-migrate-dev` + `db-migrate-test`. |
| `make db-migrate-dev` | `node ace migration:run` con `backend/.env` → base `flowsync_dev` en 54410. |
| `make db-migrate-test` | `NODE_ENV=test node ace migration:run` → el framework carga `backend/.env.test` → base `flowsync_test` en 54411. |
| `make db-reset-test` | Recrea `db-test` (vacía, al estar en memoria) y la vuelve a migrar. |
| `make test` | `db-up` + `db-migrate-test` + `npm test` en `backend/`. La batería corre contra `db-test`. |
| `make migrate` | Alias de `make db-migrate` (lo usa `make setup`). |
| `make setup` | Ahora incluye `db-up` antes de migrar. |

## Flujo típico

```bash
make db-up          # primera vez: descarga la imagen y crea las bases
make db-migrate     # aplica migraciones en desarrollo y en pruebas
make test           # batería contra db-test
make start          # backend + frontend contra db
make db-down        # al terminar
```

## Equivalentes sin make

```bash
docker compose up -d --wait
(cd backend && node ace migration:run)
(cd backend && NODE_ENV=test node ace migration:run)
(cd backend && npm test)
docker compose down
```

Borrar también los datos de desarrollo (irreversible): `docker compose down -v`.
