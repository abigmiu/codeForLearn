import compileTextNode from "./compileTextNode.js";
import compileAttribute from "./compileAttribute.js";

export default function compileNode(nodes, vm) {
  for (let node of nodes) {
    if (node.nodeType === 1) {
      // 元素节点
      compileAttribute(node, vm);
      compileNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      compileTextNode(node, vm);
    }
  }
}
