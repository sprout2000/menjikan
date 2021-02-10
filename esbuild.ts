import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="content-language" content="ja" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#4a148c" />
    <meta name="description" content="Timer for Ramen (Japanese Noodle) PWA" />
    <meta name="keywords" content="Timer for Ramen,PWA" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-title" content="Ramen" />
    <link rel="apple-touch-icon" sizes="192x192" href="icons/icon-192.png" />
    <link rel="manifest" href="manifest.json" />
    <link rel="stylesheet" href="main.css" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <script
      async
      src="https://cdn.jsdelivr.net/npm/pwacompat@2.0.10/pwacompat.min.js"
      integrity="sha384-I1iiXcTSM6j2xczpDckV+qhhbqiip6FyD6R5CpuqNaWXvyDUvXN5ZhIiyLQ7uuTh"
      crossorigin="anonymous"
    ></script>
    <title>Ramen</title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <script src="main.js"></script>
  </body>
</html>
`;

const esbuild = async () => {
  await build({
    define: { 'process.env.NODE_ENV': '"production"' },
    target: 'es6',
    platform: 'browser',
    entryPoints: [`${path.resolve(__dirname, 'src', 'main.tsx')}`],
    outdir: `${path.resolve(__dirname, 'public')}`,
    bundle: true,
    minify: true,
    sourcemap: false,
    loader: {
      '.mp3': 'file',
      '.png': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
  })
    .then(async () => {
      await fs.promises.writeFile('public/index.html', htmlContent, 'utf8');

      console.log('============================');
      console.log(`Compile Finished: ${new Date().toLocaleDateString()}`);
    })
    .catch((err) => console.log(JSON.stringify(err)));
};

esbuild();
