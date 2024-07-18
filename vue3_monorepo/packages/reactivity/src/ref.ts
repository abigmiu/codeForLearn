import { createDep } from "./dep";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

function createRef(value, isShallow = false) {}

class RefImpl {
    public dep;
    public _value;
    public __v_isRef = true;

    constructor(public rawValue, public isShallow) {
        this._value = isShallow ? rawValue : reactive(rawValue);
    }

    get value() {
        trackRefValue(this)
        return this._value;
    }

    set value(newValue) {
        this.rawValue = newValue;
        this._value = this.isShallow ? newValue : reactive(newValue);
        triggerRefValue(this)
    }
}

export function trackRefValue(ref) {
    if (isTracking()) {
      const dep = ref.dep || (ref.dep = new Set)
      trackEffects(dep)
    }
  }

  export function triggerRefValue(ref) {
    //此处的createDep是为了和cleanupEffect配合，直接重新创建一个引用避免循环执行
    triggerEffects(createDep(ref.dep))
  }
  