# FlowSync — atajos de desarrollo.
#
# Requisitos: Node.js 24+ con npm, GNU Make y Docker (con Docker Compose v2).
#   - macOS:        make viene con las Command Line Tools de Xcode.
#   - Linux / WSL:  sudo apt install make   (o el equivalente de tu distro)
#
# Windows sin WSL no está soportado: estas recetas usan sintaxis POSIX.
# Desde WSL, trabaja sobre el repo clonado dentro del sistema de ficheros
# de Linux (~/...), no en /mnt/c, o npm install irá muy lento.

SHELL := /bin/bash

BACKEND  := backend
FRONTEND := frontend

.DEFAULT_GOAL := help
.PHONY: help setup start install env migrate migrate-test test db-up db-down db-wait clean

# La ayuda se genera a partir de los comentarios `## ...` de cada target, para
# que no haya un segundo listado que mantener a mano y que pueda divergir.
help: ## Muestra esta ayuda
	@echo "FlowSync — targets disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN { FS = ":.*## " }; { printf "  make %-13s %s\n", $$1, $$2 }'
	@echo ""

# ---------------------------------------------------------------------------
# setup
# ---------------------------------------------------------------------------

setup: install env db-up migrate ## Deja el proyecto listo para arrancar
	@echo ""
	@echo "✅ Setup completado. Arranca todo con: make start"

install:
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js no está instalado."; exit 1; }
	@command -v npm  >/dev/null 2>&1 || { echo "❌ npm no está instalado."; exit 1; }
	@echo "📦 Instalando dependencias del backend..."
	@cd $(BACKEND) && npm install
	@echo "📦 Instalando dependencias del frontend..."
	@cd $(FRONTEND) && npm install

env:
	@if [ ! -f $(BACKEND)/.env ]; then \
		echo "📝 Creando $(BACKEND)/.env desde .env.example..."; \
		cp $(BACKEND)/.env.example $(BACKEND)/.env; \
	else \
		echo "📝 $(BACKEND)/.env ya existe, no se toca."; \
	fi
	@if [ ! -f $(FRONTEND)/.env ]; then \
		echo "📝 Creando $(FRONTEND)/.env desde .env.example..."; \
		cp $(FRONTEND)/.env.example $(FRONTEND)/.env; \
	else \
		echo "📝 $(FRONTEND)/.env ya existe, no se toca."; \
	fi
	@if grep -Eq '^APP_KEY=.+' $(BACKEND)/.env; then \
		echo "🔑 APP_KEY ya definida, no se regenera."; \
	else \
		echo "🔑 Generando APP_KEY..."; \
		cd $(BACKEND) && node ace generate:key; \
	fi

migrate: db-wait ## Migra la base de desarrollo (db, puerto 54410)
	@echo "🗃️  Ejecutando migraciones en desarrollo (db)..."
	@cd $(BACKEND) && node ace migration:run

# NODE_ENV=test hace que el framework cargue `.env.test`, que apunta a db-test.
migrate-test: db-wait ## Migra la base de pruebas (db-test, puerto 54411)
	@echo "🗃️  Ejecutando migraciones en pruebas (db-test)..."
	@cd $(BACKEND) && NODE_ENV=test node ace migration:run

# ---------------------------------------------------------------------------
# bases de datos (compose.yaml)
# ---------------------------------------------------------------------------

DB_SERVICES := db db-test

db-up: ## Levanta las dos bases (db y db-test) y espera a que estén sanas
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker no está instalado."; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "❌ Docker está instalado pero apagado: ábrelo."; exit 1; }
	@echo "🐘 Levantando $(DB_SERVICES)..."
	@docker compose up -d --wait $(DB_SERVICES)
	@$(MAKE) --no-print-directory db-wait

db-down: ## Para las dos bases (db-test pierde sus datos; db los conserva)
	@docker compose stop $(DB_SERVICES)

# `healthy` no basta: el healthcheck pasa cuando el servidor escucha, pero lo
# que necesitan las migraciones y las pruebas es entrar con su usuario en su
# base. Se prueba exactamente eso, por TCP, con un SELECT 1, en cada servicio.
db-wait: ## Espera a que las dos bases acepten conexiones de verdad
	@for svc in $(DB_SERVICES); do \
		printf "⏳ Esperando a %s" "$$svc"; \
		ok=0; \
		for i in $$(seq 1 60); do \
			if docker compose exec -T $$svc sh -c 'psql -h 127.0.0.1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -tAc "select 1"' >/dev/null 2>&1; then \
				ok=1; break; \
			fi; \
			printf "."; sleep 1; \
		done; \
		if [ $$ok -ne 1 ]; then \
			echo ""; echo "❌ $$svc no acepta conexiones. ¿Está levantada? Prueba: make db-up"; exit 1; \
		fi; \
		echo " ✅"; \
	done

# ---------------------------------------------------------------------------
# test
# ---------------------------------------------------------------------------

# La batería migra db-test por su cuenta al arrancar (tests/bootstrap.ts), así
# que aquí solo hace falta que la base esté arriba y aceptando conexiones.
test: db-wait ## Corre la batería del backend contra db-test
	@cd $(BACKEND) && npm test

# ---------------------------------------------------------------------------
# start
# ---------------------------------------------------------------------------

# Lanza los dos servidores en paralelo dentro de la misma receta.
#
# `kill -INT 0` manda un SIGINT a todo el grupo de procesos — exactamente lo
# mismo que hace un Ctrl-C real — y así se lleva por delante ambos servidores y
# sus hijos, sin dejar nodos huérfanos ocupando los puertos. Tiene que ser
# SIGINT y no el SIGTERM por defecto de `kill 0`: con SIGTERM, el wrapper de
# `npm run dev` y el `node ace serve --hmr` sobreviven a la señal y quedan
# colgados. Se dispara desde dos sitios:
#
#   - el trap, cuando llega un Ctrl-C (SIGINT al grupo) o un SIGTERM;
#   - el final de cada subshell, cuando *ese* servidor termina por su cuenta.
#
# Lo segundo es necesario porque `wait` a secas espera a que acaben TODOS los
# jobs: si el backend crashea al arrancar, el frontend seguiría vivo para
# siempre y el usuario no se enteraría. No se usa `wait -n` (que sería lo
# natural) porque llegó en bash 4.3 y macOS trae bash 3.2.
# Ojo: `start` está pensado para uso interactivo, desde una terminal. No lo
# llames desde un script ni desde CI: sin control de trabajos, el grupo de
# procesos incluye al proceso que invocó a make, y el SIGINT se lo llevaría por
# delante a él también. Aislar los servidores en su propio grupo con `set -m`
# no vale: los dejaría en segundo plano y el primer `read` de stdin les
# provocaría un SIGTTIN, colgando el "Press h" de Adonis y los atajos de Vite.
start: ## Levanta backend y frontend a la vez
	@if [ ! -d $(BACKEND)/node_modules ] || [ ! -d $(FRONTEND)/node_modules ]; then \
		echo "❌ Faltan dependencias. Ejecuta primero: make setup"; exit 1; \
	fi
	@if [ ! -f $(BACKEND)/.env ]; then \
		echo "❌ Falta $(BACKEND)/.env. Ejecuta primero: make setup"; exit 1; \
	fi
	@echo "🚀 Arrancando backend (http://localhost:3333) y frontend (http://localhost:5173)..."
	@echo "   Ctrl-C para parar los dos. Si uno se cae, el otro se cierra también."
	@echo ""
	@trap 'trap - INT TERM EXIT; kill -INT 0' INT TERM EXIT; \
	( cd $(BACKEND)  && npm run dev; \
	  echo ""; echo "⚠️  El backend se ha parado. Cerrando el frontend."; kill -INT 0 ) & \
	( cd $(FRONTEND) && npm run dev; \
	  echo ""; echo "⚠️  El frontend se ha parado. Cerrando el backend."; kill -INT 0 ) & \
	wait

# ---------------------------------------------------------------------------
# clean
# ---------------------------------------------------------------------------

# No borra el volumen de `db`: perder los datos de desarrollo tiene que ser una
# decisión explícita (`docker compose down -v`), no un efecto de limpiar.
clean: ## Borra node_modules y para las bases (sin borrar los datos de desarrollo)
	@echo "🧹 Limpiando..."
	@rm -rf $(BACKEND)/node_modules $(FRONTEND)/node_modules
	@docker compose down 2>/dev/null || true
	@echo "✅ Listo. Vuelve a ejecutar: make setup"
