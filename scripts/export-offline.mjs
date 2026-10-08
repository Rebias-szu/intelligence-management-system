import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, '..', '离线Demo');
const bundled = await build({
  stdin: {
    contents: "import React from 'react'; import {createRoot} from 'react-dom/client'; import Home from './app/page'; createRoot(document.getElementById('root')).render(<Home/>);",
    resolveDir: root, sourcefile: 'offline-entry.tsx', loader: 'tsx',
  },
  absWorkingDir: root, bundle: true, write: false, format: 'iife',
  platform: 'browser', target: ['chrome100', 'edge100'], minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  tsconfig: path.join(root, 'tsconfig.json'),
});
const cssPath = path.join(root, 'app/globals.css');
const css = await postcss([tailwind({base: root, optimize: true})]).process(await fs.readFile(cssPath, 'utf8'), {from: cssPath});
const js = bundled.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>涉诈情报管理系统｜离线Demo</title><style>${css.css.replace(/<\/style/gi, '<\\/style')}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
await fs.mkdir(output, {recursive: true});
await fs.writeFile(path.join(output, '涉诈情报管理系统.html'), html, 'utf8');
console.log(`已生成 ${path.join(output, '涉诈情报管理系统.html')}（${Buffer.byteLength(html)} 字节）`);
