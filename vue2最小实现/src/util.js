/**
 * 是否为自闭合标签
 * @param {} tagName
 */
export function isUnaryTag(tagName) {
  return ["input"].includes(tagName) || ["textarea"].includes(tagName);
}

/**
 * 是否是保留标签
 * @param tagName
 */
export function isReserveTag(tagName) {
  const reserveTag = [
    "div",
    "h3",
    "p",
    "span",
    "button",
    "input",
    "select",
    "option",
    "template",
  ];

  return reserveTag.includes(tagName);
}
