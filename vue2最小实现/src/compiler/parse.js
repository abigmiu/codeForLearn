import { isUnaryTag } from "../util.js";
export default function parse(template) {
  let root = null;
  let html = template;
  const stack = [];

  while (html.trim()) {
    if (html.indexOf("<!--") === 0) {
      // 处理注释标签
      const endInx = html.indexOf("-->");
      html = html.slice(endInx + 3);
      continue;
    }
    const startInx = html.indexOf("<");
    if (startInx === 0) {
      // 处理html标签
      if (html.indexOf("</") === 0) {
        parseEnd();
      } else {
        parseStartTag(html);
      }
    } else if (startInx > 0) {
      // <div>text</div> 结束标签的 “<”

      // 找到下一个标签位置
      const nextStartInx = html.indexOf("<");

      if (stack.length) {
        // stack不为空， 记文本是栈顶元素的文本
        processChars(html.slice(0, nextStartInx));
      }
      html = html.slice(nextStartInx);
    } else {
      // 纯文本
    }
  }

  return root;

  function parseEnd() {
    html = html.slice(html.indexOf(">") + 1);

    processElement();
  }

  function parseAttrs(attrs) {
    const attrMap = {};
    for (const attr of attrs) {
      const [attrName, attrValue] = attr.split("=");
      attrMap[attrName] = attrValue.replace(/"/g, "");
    }
    return attrMap;
  }

  function generateAST(tagName, attrMap) {
    return {
      type: 1,
      tag: tagName,
      rawAttr: attrMap,
      attr: {},
      children: [],
    };
  }

  function parseStartTag() {
    const endIdx = html.indexOf(">");
    const content = html.slice(1, endIdx);
    html = html.slice(endIdx + 1);
    let tagName = "",
      attrStr = "";
    const firstSpaceIdx = content.indexOf(" ");
    if (firstSpaceIdx === -1) {
      // 标签没有属性
      tagName = content;
    } else {
      tagName = content.slice(0, firstSpaceIdx);
      attrStr = content.slice(firstSpaceIdx + 1);
    }
    const attrs = attrStr ? attrStr.split(" ") : [];
    const attrMap = parseAttrs(attrs);

    const elementAst = generateAST(tagName, attrMap);
    if (!root) {
      root = elementAst;
    }
    stack.push(elementAst);

    if (isUnaryTag(tagName)) {
      processElement();
    }
  }

  /**
   * 处理元素闭合标签被调用
   * 进一步处理元素上的各个属性， 并将处理结果放到attr属性上
   */
  function processElement() {
    const curEle = stack.pop();
    const { rawAttr } = curEle;
    const properArr = Object.keys(rawAttr);

    if (properArr.includes("v-model")) {
      processVModel(curEle);
    } else if (properArr.find((item) => item.match(/v-bind:(.*)/))) {
      processVBind(curEle, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
    } else if (properArr.find((item) => item.match(/v-on:(.*)/))) {
      processVon(curEle, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);
    }

    processSlotContent(curEle);

    const stackLen = stack.length;
    // 这里不理解
    if (stackLen) {
      stack[stackLen - 1].children.push(curEle);

      curEle.parent = stack[stackLen - 1];

      if (curEle.slotName) {
        const { parent, slotName, scopeSlot, children } = curEle;
        const slotInfo = {
          slotName,
          scopeSlot,
          children: children.map((item) => {
            // 为了避免JSON.stringify(atrr) 出现栈溢出，因为有循环引用
            delete item.parent;
            return item;
          }),
        };

        if (parent.rawAttr.scopedSlots) {
          parent.rawAttr.scopedSlots[curEle.slotName] = slotInfo;
        } else {
          parent.rawAttr.scopedSlots = {
            [curEle.slotName]: slotInfo,
          };
        }
      }
    }
  }

  function processVModel(curEle) {
    const { tag, attr, rawAttr } = curEle;
    const { type, "v-model": vModelValue } = rawAttr;

    if (tag === "input") {
      if (/text/.test(type)) {
        attr.VModel = {
          tag,
          type: "text",
          value: vModelValue,
        };
      } else if (/checkbox/.test(type)) {
        attr.Vmodel = {
          tag,
          type: "checkbox",
          value: vModelValue,
        };
      }
    } else if (tag === "textarea") {
      attr.vModel = {
        tag,
        value: vModelValue,
      };
    } else if (tag === "select") {
      attr.vModel = {
        tag,
        value: vModelValue,
      };
    }
  }

  function processVBind(curEle, bindKey, bindValue) {
    curEle.attr.VBind = {
      [bindKey]: bindValue,
    };
  }

  function processVon(curEle, onKey, onValue) {
    curEle.attr.VOn = {
      [onKey]: onValue,
    };
  }
  /**
   * 处理文本
   * @param {*} text
   * @returns
   */
  function processChars(text) {
    if (!text.trim()) return;

    const textAST = {
      type: 3,
      text: text,
    };

    // 是表达式
    if (text.match(/{{(.*)}}/)) {
      textAST.expression = RegExp.$1.trim();
    }

    stack[stack.length - 1].children.push(textAST);
  }
}

/**
 *
 * @param el 节点的ast对象
 */
function processSlotContent(el) {
  if (el.tag === "template") {
    const attrMap = el.rawAttr;

    for (let key in attrMap) {
      if (key.match(/v-slot:(.*)/)) {
        const soltName = (el.slotName = RegExp.$1);
        el.scopeSlot = attrMap[`v-slot:${slotName}`];

        return;
      }
    }
  }
}
