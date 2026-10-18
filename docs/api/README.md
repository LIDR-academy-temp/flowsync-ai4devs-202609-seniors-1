# Contrato OpenAPI versionado

El servidor sigue generando el documento dinámicamente en `/api.json` mediante
`@foadonis/openapi`. Los comandos usan el mismo `buildDocument()`, con las rutas
cargadas, sin abrir un puerto HTTP ni consultar la base de datos.

Desde `backend/`, con Node.js 24 o superior y las dependencias instaladas (`npm ci`),
la comprobación no necesita un `.env` ni secretos:

```bash
npm run openapi:check
```

- `openapi:generate` actualiza `docs/api/openapi.json`. Al cambiar el contrato,
  ejecútalo con el entorno habitual de Adonis configurado, revisa el diff e incluye
  el archivo junto al cambio de código.
- `openapi:check` genera el contrato en un directorio único dentro de
  `backend/tmp/`, compara su contenido con el archivo versionado y elimina el
  temporal incluso si falla. Nunca escribe en el archivo versionado. Devuelve
  código 0 si coincide y un código distinto de cero si difiere, falta el archivo
  o no se puede generar el documento.

`openapi:check` usa `backend/scripts/check_openapi.mjs` para arrancar Ace con
`NODE_ENV=test`, `TZ=UTC`, `HOST=localhost`, `PORT=3333`,
`APP_URL=http://localhost:3333`, `LOG_LEVEL=error` y `SESSION_DRIVER=memory`.
Genera una `APP_KEY` aleatoria efímera para ese proceso. Estos valores prevalecen
sobre los del entorno personal y satisfacen la validación de `start/env.ts` al
arrancar Adonis; el contrato no necesita credenciales reales. No escribe archivos
`.env`, abre un servidor HTTP ni necesita migraciones. La configuración de los
demás comandos y de la API no cambia.

La serialización ordena recursivamente las claves de los objetos, conserva el
orden de los arrays y usa dos espacios y un salto de línea final. No incluye
marcas de tiempo ni depende de un servidor en ejecución.

El workflow `.github/workflows/openapi.yml` ejecuta la comprobación en todas las
PR y en los pushes a `main`, con permisos `contents: read` y un máximo de cinco
minutos. Ejecuta el mismo `npm run openapi:check` y utiliza su entorno de prueba
compartido: no utiliza secretos ni necesita archivos `.env` o migraciones.

El `override` de `jsonschema@1.4.1` está limitado a Ace: la versión 1.5.0 del
lockfile falla con `Invalid URL` al resolver las referencias internas del esquema
de metadatos de los comandos. El lockfile fija también esta dependencia de la CLI.

Este guardrail detecta diferencias entre el documento generado y su copia
versionada. La correspondencia entre las anotaciones OpenAPI y el comportamiento
real de la API sigue necesitando revisión y pruebas de contrato.
