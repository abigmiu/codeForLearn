let $white = document.querySelector('.white')
let $red = document.querySelector('.red')

window.addEventListener('scroll', (e) => {
  let noStickyOffset = document.documentElement.clientHeight * 2;
  let scrolled = document.documentElement.scrollTop / noStickyOffset;

  // 总共两个屏幕
  // 白色手机的时候滚动到50%的时候就应该全部展示。
  $white.style.clipPath = `inset(${((0.5 - scrolled) / 0.5) * 100}% 0px 0px 0px)`
  $red.style.clipPath = `inset(${((1 - scrolled) / 0.5) * 100}% 0px 0px 0p x)`

  if (scrolled >= 1) {
    document.querySelector('.sticky-container').classList.add('no-sticky')
  } else {
    document.querySelector('.sticky-container').classList.remove('no-sticky')
  }
})