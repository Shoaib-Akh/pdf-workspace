import { readdirSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as esbuild from 'esbuild';

const testsDir = resolve('tests');
const distDir = resolve('tests/.dist');

if (!existsSync(testsDir)) {
  console.error('No tests directory found.');
  process.exit(1);
}

// Find all test files
const testFiles = readdirSync(testsDir)
  .filter(file => file.endsWith('.test.ts'))
  .map(file => join(testsDir, file));

if (testFiles.length === 0) {
  console.log('No test files found in tests/');
  process.exit(0);
}

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}
mkdirSync(distDir, { recursive: true });

console.log(`\n📦 Building ${testFiles.length} test suite(s)...`);

const outFiles = [];

for (const file of testFiles) {
  const base = basename(file, '.ts');
  const outFile = join(distDir, `${base}.mjs`);
  outFiles.push(outFile);

  await esbuild.build({
    entryPoints: [file],
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    alias: {
      '@': resolve('src'),
    },
    define: {
      'import.meta.env.DEV': 'true',
    },
    outfile: outFile,
    sourcemap: 'inline',
  });
}

console.log(`🚀 Running test suites via Node.js native test runner...\n`);

const result = spawnSync(process.execPath, ['--test', ...outFiles], {
  stdio: 'inherit',
  env: process.env,
});

// Cleanup built tests
try {
  rmSync(distDir, { recursive: true, force: true });
} catch {
  // ignore
}

process.exit(result.status ?? 0);
