import Dep from "./Dep.js";
import queueWatcher from "./asyncUpdateQueue.js";

let uid = 0;

export default function Watcher(cb, options = {}, vm = null) {
  this.uid = uid++;
  this._cb = cb;
  this.options = options;
  this.vm = vm;
  this.dirty = true;
  this.value = null;
  !options.lazy && this.get();
}

Watcher.prototype.get = function () {
  Dep.target = this;
  this.value = this._cb.apply(this.vm);
  Dep.target = null;
};
Watcher.prototype.run = function () {
  this.get();
};
Watcher.prototype.update = function () {
  if (this.options.lazy) {
    this.dirty = true;
  } else {
    queueWatcher(this);
  }
};
Watcher.prototype.evaluate = function () {
  this.get();
  this.dirty = false;
};
