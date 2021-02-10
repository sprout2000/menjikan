import path from 'path';
import { generateSW } from 'workbox-build';
import { build, BuildFailure, BuildResult } from 'esbuild';

const isDev = process.env.NODE_ENV === '"development"';

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
    define: { 'process.env.NODE_ENV': process.env.NODE_ENV as string },
    target: 'es6',
    platform: 'browser',
    entryPoints: [`${path.resolve(__dirname, 'src', 'main.tsx')}`],
    outdir: `${path.resolve(__dirname, 'public')}`,
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    loader: {
      '.mp3': 'file',
      '.png': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    watch: isDev
      ? {
          onRebuild: (err, result) => {
            console.log('----------------------------');
            if (err) {
              console.error(
                new Date().toLocaleString(),
                ' watch build failed.'
              );
              if (err.warnings) warningLog(err.warnings);
              if (err.errors) errorLog(err.errors);
            } else {
              if (result) {
                console.log(
                  new Date().toLocaleString(),
                  ' watch build succeeded.'
                );
                if (result.warnings) warningLog(result.warnings);
              }
            }
          },
        }
      : false,
  })
    .then(async () => {
      console.log('============================');
      console.log(`Compile Finished: ${new Date().toLocaleString()}`);

      if (isDev) {
        console.log(`Watching.... ${new Date().toLocaleString()}`);
      } else {
        generateSW({
          globDirectory: path.resolve(__dirname, 'public'),
          swDest: path.resolve(__dirname, 'public/service-worker.js'),
          skipWaiting: true,
          clientsClaim: true,
        }).then(() => console.log('Generated service-worker.js.'));
      }
    })
    .catch((err) => console.log(JSON.stringify(err)));
};

esbuild();
