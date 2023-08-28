import Watcher from "../Watcher.js";
import Vue from "../index.js";
export default function mountComponent(vm) {
  // 负责初始化渲染和后续更新组件
  const updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(updateComponent);
}

Vue.prototype._render = function () {
  return this.$options.render.apply(this);
};

Vue.prototype._update = function (vnode) {
  const preVNode = this._vnode;
  this._vnode = vnode;
  if (!preVNode) {
    //首次渲染

    this.$el = this.__patch__(this.$el, vnode);
  } else {
    this.$el = this.__patch__(preVNode, vnode);
  }
};
