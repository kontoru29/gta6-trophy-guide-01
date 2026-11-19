// Leonida Trophy Guide — the hand-in program (Node 22, standard library only).
//
// This file takes the finished guide and packs it for the grader. The guide
// itself lives in app/: the page, its script and stylesheet, and the trophy
// data. The screenshots/ folder holds four captures of the running app. This
// program copies both folders into the output directory and writes
// dossier.json there, the summary the judge reads, built by the vendored
// make.fun library in vendor/makefun-frontend.ts. That vendored file must
// stay exactly as the kit shipped it.
//
// Try it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader sets no MAKEFUN_OUTPUT_DIR, so /output is used there.

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
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(shotsDir)) {
  throw new Error('screenshots/ is missing: the guide hands in 3 or 4 captures');
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
