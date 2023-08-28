/**
 * 生成指定节点的虚拟DOM
 * @param tag 标签名
 * @param attr 属性对象
 * @param children 子节点的VNode数组
 * @param context Vue实例
 * @param text 文本接的的ast对象
 * @constructor
 */
export default function VNode(
  tag,
  attr,
  children,
  context = null,
  text = null
) {
  return {
    tag,
    attr,
    children,
    context,
    text,
    parent: null, // 当前节点的父节点， 是真实的DOM节点
    ele: null,
  };
}
