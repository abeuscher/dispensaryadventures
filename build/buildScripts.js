const esbuild = require("esbuild");
const pugPlugin = require("esbuild-plugin-pug");
const path = require("path");
const fs = require("fs");

const buildScripts = (siteSettings) => {
  console.log("Writing theme script file");

  const jsFile = siteSettings.jsFiles[0];
  const entryPoint = path.join(jsFile.srcDir, jsFile.srcFileName);
  const outfile = path.join(jsFile.buildDir, jsFile.buildFileName);

  // Ensure the output directory exists
  const outputDir = path.dirname(outfile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: false,
    outfile: outfile,
    platform: "browser",
    plugins: [
      pugPlugin({
        compileDebug: false,
        inlineRuntimeFunctions: true,
        doctype: 'html',
        globals: ['productData'],
        pretty: false,
      }),
    ],
  })
    .then(() => {
      console.log(`Scripts built successfully. Output: ${outfile}`);
    })
    .catch((error) => {
      console.error("Error during script build:", error);
    });
};

module.exports = buildScripts;