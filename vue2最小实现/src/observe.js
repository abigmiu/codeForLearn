import Observer from "./Observer.js";

export default function observe(value) {
  if (typeof value !== "object") return;
  if (value.__ob__) {
    // 已经是响应式对象
    return value.__ob__
  }
  return new Observer(value);
}
