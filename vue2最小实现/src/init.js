import proxy from "./proxy.js";
import observe from "./observe.js";

export default function initData(vm) {
  console.log(vm);
  const { data } = vm.$options;
  let _data = (vm._data = {});

  if (data) {
    _data = vm._data = typeof data === "function" ? data() : data;
  }
  for (const key of Object.keys(_data)) {
    proxy(vm, "_data", key);
  }
  observe(_data);
}
