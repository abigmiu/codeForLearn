import parse from "./parse.js";
import generate from "./generate.js";

export default function compileToFunction(template) {
  const ast = parse(template);
  const render = generate(ast);
  return render;
}
