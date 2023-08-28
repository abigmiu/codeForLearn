```css
background-image: linear-gradient(
  75deg,
  rgba(255, 255, 255, 1) 0%,
  rgba(255, 255, 255, 1) 33.33%,
  rgba(255, 255, 255, 0) 66.67%,
  rgba(255, 255, 255, 0) 100%
);
background-size: 300% 100%;
background-position-x: calc(100% - var(--percentage));
```

通过 background-image 分成三段。然后水平拉长 3 倍。 就能从白色到透明
