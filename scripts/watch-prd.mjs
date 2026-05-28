#!/usr/bin/env node
/**
 * 监听 prd/modules/*.md，保存后自动执行 sync-prd.mjs → 更新 shared/prd-bundle.js
 * 用法: node scripts/watch-prd.mjs
 */
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const syncScript = path.join(__dirname, 'sync-prd.mjs');
const modulesDir = path.resolve(__dirname, '..', 'prd/modules');

let timer = null;

function runSync() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const child = spawn(process.execPath, [syncScript], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) {
        console.log('[watch-prd] 已同步到 shared/prd-bundle.js，浏览器 PRD 面板约 1.5s 内自动刷新');
      }
    });
  }, 120);
}

runSync();

fs.watch(modulesDir, { recursive: true }, (_event, filename) => {
  if (!filename || !filename.endsWith('.md')) return;
  console.log('[watch-prd] 检测到变更:', filename);
  runSync();
});

console.log('[watch-prd] 监听中:', modulesDir);
