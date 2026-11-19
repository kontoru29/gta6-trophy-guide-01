// Leonida Trophy Guide — entrypoint (Node 22, standard library only).
//
// What this program does, in plain terms: it hands the guide in. The guide itself is
// the static files in app/ (index.html, its script and stylesheet, and the trophy data),
// plus the screenshots/ captures of the running app. This file copies both folders
// into the grader's output directory and writes dossier.json there, the summary the
// judge reads: the screenshots, the first load's files and bytes, and the app's source.
// The summary is produced by the vendored make.fun library, vendor/makefun-frontend.ts,
// which the scorer requires to be the one that wrote it — leave that file untouched.
//
// Run it locally like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used instead.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The folder this file lives in is the repository root.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy one folder into the output directory, creating it first when needed.
function handIn(folderName) {
  const from = join(repoRoot, folderName);
  const to = join(outputDir, folderName);
  mkdirSync(to, { recursive: true });
  if (existsSync(from)) cpSync(from, to, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: nothing to hand in');
}
handIn('app');
handIn('screenshots');

// The caps the scorer enforces: at most 160 KiB of dossier text, at most 4 screenshots
// of at most 256 KiB each, and app/ within 993 files and 48 MiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
