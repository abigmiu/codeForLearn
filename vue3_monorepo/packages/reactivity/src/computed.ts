import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

export function computed(getterOrSetter) {
    const onlyGetter = typeof getterOrSetter === 'function';

    let getter;
    let setter;

    if (onlyGetter) {
        getter = getterOrSetter;
        setter = () => {

        }
    } else {
        getter = getterOrSetter.get;
        setter = getterOrSetter.set;
    }
}

class ComputedRefImpl {
    effect;
    _dirty = true;
    __v_isRef = true;
    dep;
    _value;

    constructor(getter, private _setter) {
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
                triggerRefValue(this);
            }
        })
    }

    get value() {
        trackRefValue(this);
        if (this._dirty) {
            this._dirty = false;
            this._value = this.effect.run();
        }
        return this._value
    }

    set value(newValue) {
        this._setter(newValue)
    }
}