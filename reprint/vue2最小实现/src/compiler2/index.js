import compileNode from "./compileNode.js"

export default function mount(vm) {
  const { el } = vm.$options
  const childNodes = document.querySelector(el).childNodes
  compileNode(Array.from(childNodes), vm)
}