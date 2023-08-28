export default function Dep() {
  this.watchers = []
}
Dep.target = null

Dep.prototype.depend = function () {
  this.watchers.push(Dep.target)
}

Dep.prototype.notify = function () {
  this.watchers.forEach(watcher => {
    watcher.update()
  })
}