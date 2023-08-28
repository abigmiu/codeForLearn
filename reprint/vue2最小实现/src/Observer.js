import protoArgument from "./protoArgument.js";
import defineReactive from "./defineReactive.js";
import observe from "./observe.js";
import Dep from "./Dep.js";
export default function Observer(value) {
  Object.defineProperty(value, '__ob__', {
    value: this,
    enumerable: false,
    writable: true,
    configurable: true
  })
  value.__ob__.dep = new Dep()
  if (Array.isArray(value)) {
    protoArgument(value);
    this.observeArray(value)
  } else {
    this.walk(value);
  }
}
Observer.prototype.walk = function (obj) {
  for (let key in obj) {
    defineReactive(obj, key, obj[key]);
  }
};

Observer.prototype.observeArray = function (ary) {
  for (let item of ary) {
    observe(item)
  }
}
