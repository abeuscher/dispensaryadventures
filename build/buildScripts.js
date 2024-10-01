const esbuild = require("esbuild");
const pug = require("pug");
const path = require("path");
const fs = require("fs");

const pluginPug = () => ({
  name: "pug",
  setup(build) {
    build.onLoad({ filter: /\.(jade|pug)$/ }, async (args) => {
      // Read the Pug template file
      const template = await fs.promises.readFile(args.path, "utf8");

      // Compile the Pug template into a client-side JS function
      const compiledFunction = pug.compileClient(template, {
        filename: args.path,
        inlineRuntimeFunctions: false,
        compileDebug: false,
      });

      // Return the function as a module that can be imported
      const contents = `
        const pug = require('pug-runtime');
        module.exports = ${compiledFunction};
      `;

      return { contents, loader: "js" };
    });
  },
});

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
    minify: true,
    outfile: outfile,
    platform: "browser",
    plugins: [pluginPug()],
  })
    .then(() => {
      console.log(`Scripts built successfully. Output: ${outfile}`);
    })
    .catch((error) => {
      console.error("Error during script build:", error);
    });
};

module.exports = buildScripts;
