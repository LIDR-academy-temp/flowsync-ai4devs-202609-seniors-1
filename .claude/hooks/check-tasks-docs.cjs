const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

const routesFile = 'backend/start/routes.ts';
const readmeFile = 'docs/capabilities/tasks/README.md';

function git(...args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
  }).trim();
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

let input = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);

    // Evita un bucle si Claude ya está corrigiendo
    // un incumplimiento detectado por este hook.
    if (event.stop_hook_active) return;

    const changedFiles = new Set(
      git('diff', '--name-only', 'HEAD')
        .split('\n')
        .filter(Boolean)
    );

    // También revisa el último commit, por si Claude
    // ya ha confirmado los cambios.
    for (const file of git(
      'diff-tree',
      '--no-commit-id',
      '--name-only',
      '-r',
      'HEAD'
    ).split('\n')) {
      if (file) changedFiles.add(file);
    }

    // Solo interesa cuando cambia la definición de rutas.
    if (!changedFiles.has(routesFile)) return;

    const routes = read(routesFile);
    const readme = read(readmeFile);

    const hasDeleteRoute =
      /router\.delete\(\s*['"`]:id['"`]/.test(routes);

    // El README puede documentar la ruta con o sin /api/v1.
    const hasDeleteDocs =
      /DELETE\s+(?:\/api\/v1)?\/tasks\/:id/i.test(readme);

    if (hasDeleteRoute && !hasDeleteDocs) {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason:
          'Se ha declarado DELETE /api/v1/tasks/:id, ' +
          'pero no aparece documentado en ' +
          'docs/capabilities/tasks/README.md. ' +
          'Actualiza el README antes de finalizar.',
      }));
      return;
    }

    process.stdout.write(JSON.stringify({
      systemMessage:
        'Comprobación de documentación tasks: ' +
        (hasDeleteRoute && hasDeleteDocs
          ? 'PASS — DELETE documentado.'
          : 'No se detectó el endpoint DELETE esperado.'),
    }));
  } catch (error) {
    console.error(`Error comprobando documentación: ${error.message}`);
    process.exitCode = 1;
  }
});