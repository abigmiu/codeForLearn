import Watcher from "./Watcher.js";

export default function initComputed(vm) {
  const computed = vm.$options.computed;
  const watcher = (vm._watcher = Object.create(null));
  for (let key in computed) {
    watcher[key] = new Watcher(
      computed[key],
      {
        lazy: true,
      },
      vm
    );
    defineComputed(vm, key);
  }
}

function defineComputed(vm, key) {
  const descriptor = {
    get: function () {
      const watcher = vm._watcher[key];
      if (watcher.dirty) {
        watcher.evaluate();
      }
      return watcher.value;
    },
    set: function () {
      console.error("dont set");
    },
  };
  Object.defineProperty(vm, key, descriptor);
}
