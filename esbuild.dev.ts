import fs from 'fs';
import path from 'path';
import { build, BuildFailure, BuildResult } from 'esbuild';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="content-language" content="ja" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ramen</title>
    <link rel="stylesheet" href="main.css" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <script src="main.js"></script>
  </body>
</html>
`;

const warningLog = (
  warnings: BuildFailure['warnings'] | BuildResult['warnings']
) => {
  warnings.map((warn) => {
    console.error(`warning: ${warn.text}`);
    console.error(`detail: ${warn.detail}`);
    console.error(
      `path: ${warn.location?.file}:${warn.location?.line}:${warn.location?.column}`
    );
    console.error(` -> ${warn.location?.lineText}`);
  });
};

const errorLog = (errors: BuildFailure['errors']) => {
  errors.map((err) => {
    console.error(`error: ${err.text}`);
    console.error(
      `path: ${err.location?.file}:${err.location?.line}:${err.location?.column}`
    );
    console.error(` -> ${err.location?.lineText}`);
  });
};

const esbuild = async () => {
  await build({
    define: { 'process.env.NODE_ENV': '"development"' },
    target: 'es6',
    platform: 'browser',
    entryPoints: [`${path.resolve(__dirname, 'src', 'main.tsx')}`],
    outdir: `${path.resolve(__dirname, 'public')}`,
    bundle: true,
    minify: false,
    sourcemap: true,
    loader: {
      '.mp3': 'file',
      '.png': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    publicPath: `${path.resolve(__dirname, 'public/images')}`,
    watch: {
      onRebuild: (err, result) => {
        console.log('----------------------------');
        if (err) {
          console.error(new Date().toLocaleString(), ' watch build failed ');
          if (err.warnings) warningLog(err.warnings);
          if (err.errors) errorLog(err.errors);
        } else {
          if (result) {
            console.log(new Date().toLocaleString(), ' watch build succeeded ');
            if (result.warnings) warningLog(result.warnings);
          }
        }
      },
    },
  })
    .then(async () => {
      await fs.promises.writeFile('public/index.html', htmlContent, 'utf8');

      console.log('============================');
      console.log(`Compile start... ${new Date().toLocaleDateString()}`);
    })
    .catch((err) => console.log(JSON.stringify(err)));
};

esbuild();
