#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const modulesDir = path.join(root, 'prd/modules');
const configFile = path.join(root, 'prd/config.json');
const outFile = path.join(root, 'shared/prd-bundle.js');

let title = '产品需求文档';
if (fs.existsSync(configFile)) {
  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    if (config.title) title = config.title;
  } catch (_) {}
}

const files = fs.readdirSync(modulesDir).filter((f) => f.endsWith('.md')).sort();
const modules = files.map((f) => {
  const md = fs.readFileSync(path.join(modulesDir, f), 'utf8');
  const id = f.replace('.md', '');
  let moduleTitle = md.split('\n')[0].replace(/^##\s*/, '').trim();
  if (moduleTitle.includes('. ')) moduleTitle = moduleTitle.split('. ').slice(1).join('. ');
  return { id, title: moduleTitle, anchor: id, markdown: md };
});

const bundle = {
  title,
  syncedAt: new Date().toISOString(),
  modules,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, 'window.PRD_BUNDLE = ' + JSON.stringify(bundle, null, 2) + ';\n');
console.log('Synced', modules.length, 'modules ->', outFile);
