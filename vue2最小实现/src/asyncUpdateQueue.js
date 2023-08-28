const queue = [];

let flushing = false;

let waiting = false;

let pending = false;

const callbacks = [];

export default function queueWatcher(watcher) {
  if (!queue.includes(watcher)) {
    if (!flushing) {
      queue.push(watcher);
    } else {
      let flag = false;
      for (let i = queue.length - 1; i >= 0; i--) {
        if (queue[i].uid < watcher.uid) {
          queue.splice(i + 1, 0, watcher);
          flag = true;
          break;
        }
      }

      if (!flag) {
        queue.unshift(watcher);
      }
    }
  }

  if (!waiting) {
    waiting = true;
    nextTick(flushSchedulerQueue);
  }
}

function flushSchedulerQueue() {
  flushing = true;
  queue.sort((a, b) => a.uid - b.uid);
  while (queue.length) {
    const watcher = queue.shift();
    watcher.run();
  }

  flushing = false;
  waiting = false;
}

function nextTick(cb) {
  callbacks.push(cb);

  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks());
  }
}
function flushCallbacks() {
  pending = false;
  while (callbacks.length) {
    const cb = callbacks.shift();
    cb();
  }
}
