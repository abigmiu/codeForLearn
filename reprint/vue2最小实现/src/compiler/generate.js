export default function generate(ast) {
  const renderStr = genElement(ast);
  console.log(renderStr);
  const str = `with(this) {return ${renderStr}}`;
  return new Function(str);
}

function genElement(ast) {
  const { tag, rawAttr, attr } = ast;

  const attrs = { ...rawAttr, ...attr };
  const children = genChildren(ast);

  if (tag === "slot") {
    return `_t(${JSON.stringify(attrs)}, [${children}])`;
  }
  return `_c('${tag}', ${JSON.stringify(attrs)}, [${children}])`;
}

function genChildren(ast) {
  const ret = [];
  const { children } = ast;
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (child.type === 3) {
      // 文本节点
      ret.push(`_v(${JSON.stringify(child)})`);
    } else if (child.type === 1) {
      // 元素节点
      ret.push(genElement(child));
    }
  }
  return ret;
}
