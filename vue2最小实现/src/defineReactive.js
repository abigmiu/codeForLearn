import Dep from "./Dep.js";
import observe from "./observe.js";

export default function defineReactive(target, key, value) {
  // console.log(value)
  const childObserve = observe(value);

  const dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend(Dep.target)
        if (childObserve) {
          childObserve.dep.depend()
        }
      }

      console.log("getter key = ", key);
      return value;
    },
    set(newV) {

      if (newV === value) return;

      value = newV;
      console.log(`setter ${key} = ${value}`);
      dep.notify()
      observe(value);
      return value;
    },
  });
}

function set(target, key, value) {
  defineReactive(target, key, value);
}
