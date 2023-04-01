const rollup = require("rollup");
const util = require("util");
const path = require("path");

async function build() {
  const bundle = await rollup.rollup({
    input: [path.join(__dirname, "../", "src/index.js")],
  });
  console.log(util.inspect(bundle));
  const result = await bundle.generate({
    format: "esm",
  });
  debugger;
}
build();
