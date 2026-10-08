import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const assetsDirectory = path.join(projectRoot, 'offline-dist', 'assets');
const outputPath = path.resolve(projectRoot, '..', '涉诈情报管理系统-离线版.html');

const assetFiles = await readdir(assetsDirectory);

async function findLatestAsset(extension) {
  const candidates = assetFiles.filter((name) => name.endsWith(extension));
  const candidatesWithTime = await Promise.all(candidates.map(async (name) => ({
    name,
    modifiedAt: (await stat(path.join(assetsDirectory, name))).mtimeMs,
  })));
  return candidatesWithTime.sort((left, right) => right.modifiedAt - left.modifiedAt)[0]?.name;
}

const [scriptName, styleName] = await Promise.all([
  findLatestAsset('.js'),
  findLatestAsset('.css'),
]);

if (!scriptName || !styleName) {
  throw new Error('离线构建产物缺少脚本或样式文件');
}

const [script, style] = await Promise.all([
  readFile(path.join(assetsDirectory, scriptName), 'utf8'),
  readFile(path.join(assetsDirectory, styleName), 'utf8'),
]);

if (script.toLowerCase().includes('</script')) {
  throw new Error('构建脚本包含无法安全内嵌的结束标签');
}

if (style.toLowerCase().includes('</style')) {
  throw new Error('构建样式包含无法安全内嵌的结束标签');
}

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>涉诈情报管理系统</title>
    <style>${style}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${script}</script>
  </body>
</html>
`;

await writeFile(outputPath, html, 'utf8');
console.log(outputPath);
