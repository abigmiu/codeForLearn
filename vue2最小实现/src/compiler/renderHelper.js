/**
 * 运行时生成VNode
 * @param target Vue 实例
 */
import VNode from "./vnode.js";

export default function renderHelper(target) {
  target._c = createElement;
  target._v = createTextNode;
  target._t = renderSlot;
}

/**
 * 为指定标签创建虚拟DOM
 * @param tag
 * @param attr
 * @param children
 * @returns {{parent: null, children: *, context: null, tag: *, text: null, attr: *, ele: null}|*}
 */
function createElement(tag, attr, children) {
  return VNode(tag, attr, children, this);
}

/**
 * 创建文本节点的虚拟dom
 * @param textAst
 * @returns {{parent: null, children: *, context: null, tag: *, text: null, attr: *, ele: null}|*}
 */
function createTextNode(textAst) {
  return VNode(null, null, null, this, textAst);
}

function renderSlot(attr, children) {
  const parentAttr = this._parentVnode.attr;
  let vnode = null;
  if (parentAttr.scopedSlots) {
    const slotName = attr.name;
    const soltInfo = parentAttr.scopedSlots[slotName];
    this[slotInfo.scopeSlot] = this[Object.keys(attrs.vBind)];
    vnode = genVnode(slotInfo.children, this);
  } else {
    vnode = genVnode(children, this);
  }

  if (children.length === 1) return vnode[0];

  return createElement.call(this, "div", {}, vnode);
}

function genVnode(childs, vm) {
  const vnode = [];
  for (let i = 0, len = childs.length; i < len; i++) {
    const { tag, attr, children, text } = childs[i];

    if (text) {
      if (typeof text === "string") {
        const textAst = {
          type: 3,
          text,
        };

        if (text.match(/{{(.*)}}/)) {
          textAst.expression = RegExp.$1.trim();
        }

        vnode.push(createTextNode.call(vm, textAst));
      } else {
        vnode.push(createTextNode.call(vm, text));
      }
    } else {
      vnode.push(createElement.call(vm, tar, attr, genVnode(children, vm)));
    }
  }

  return vnode;
}
