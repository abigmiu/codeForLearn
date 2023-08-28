import Watcher from "../Watcher.js";

export default function compileAttribute(node, vm) {
  const attrs = node.attributes;

  for (let attr of attrs) {
    const { name, value } = attr
    if (name.match(/v-on:click/)) {
      compileVOn(node, value, vm);
    } else if (name.match(/v-bind:/)) {
      compileVBind(node, name, value, vm);
    } else if (name.match(/v-model/)) {
      compileVmodel(node, value, vm);
    }
  }
}

function compileVOn(node, handler, vm) {
  node.addEventListener("click", function (...args) {
    vm.$options.methods[handler].apply(vm, args);
  });
}

function compileVBind(node, attrName, attrValue, vm) {
  node.removeAttribute(attrName);
  attrName = attrName.replace(/v-bind:/, "");
  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }
  new Watcher(cb);
}

function compileVmodel(node, key, vm) {
  let { tagName, type } = node;
  tagName = tagName.toLowerCase()
  if (tagName === "input" && type === "text") {
    node.value = vm[key];
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (tagName === "input" && type === "checkbox") {
    node.checked = vm[key]
    node.addEventListener('change', function () {
      vm[key] = node.checked
    })
  } else if (tagName === "select") {
    node.value = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
