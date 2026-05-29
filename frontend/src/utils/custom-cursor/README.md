# Custom Cursor - 零延迟自定义光标

一个零延迟、轻量级的 React 自定义光标组件。鼠标移动即时响应，无插值延迟；hover 时自动放大，支持动态 DOM 元素自动绑定。

## 核心特性

| 特性 | 说明 |
|------|------|
| **零延迟跟踪** | 直接通过 `mousemove` 事件设置 `transform`，无 lerp 插值、无 RAF 动画循环 |
| **Hover 自动放大** | 鼠标进入链接/按钮时自动放大并降低透明度，纯 CSS 过渡 |
| **动态元素自动绑定** | 通过 `MutationObserver` 自动为新添加的 DOM 元素绑定事件 |
| **自动隐藏默认光标** | 全局隐藏 body 及所有交互元素的默认鼠标样式 |
| **高对比度可见** | 默认使用 `mix-blend-mode: difference`，在任何背景色上都清晰可见 |
| **TypeScript 支持** | 完整的类型定义，所有属性均可配置 |

## 安装

将 `CustomCursor.tsx` 和 `custom-cursor.css` 复制到你的项目目录中。

## 使用方法

### 1. React + TypeScript

```tsx
import CustomCursor from './CustomCursor'
import './custom-cursor.css'

// App.tsx
export default function App() {
  return (
    <>
      <CustomCursor />
      {/* 你的页面内容 */}
    </>
  )
}
```

### 2. 自定义配置

```tsx
<CustomCursor
  color="#e60012"        // 光标颜色
  size={6}               // 正常大小（px）
  hoverSize={24}         // hover 大小（px）
  hoverOpacity={0.5}     // hover 透明度
  blendMode="difference" // 混合模式
  transitionDuration={0.12} // 过渡动画时长（秒）
  zIndex={9998}          // 层级
/>
```

### 3. 让任意元素触发 hover 效果

给任意 HTML 元素添加 `data-cursor-hover` 属性：

```html
<div data-cursor-hover>这个区域也会触发光标放大</div>
```

以下元素默认自动触发 hover 效果，无需额外标记：
- `<a>` 链接
- `<button>` 按钮
- `[role="button"]` 按钮角色元素
- `[data-cursor-hover]` 自定义标记元素

## 纯 HTML / 原生 JS 版本

如果你的项目不使用 React，可以直接使用以下原生版本：

```html
<!DOCTYPE html>
<html>
<head>
<style>
  /* 隐藏默认光标 */
  body { cursor: none; }
  a, button, [data-cursor-hover] { cursor: none !important; }

  /* 自定义光标 */
  #cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    margin-left: -3px;
    margin-top: -3px;
    border-radius: 50%;
    background: #e60012;
    pointer-events: none;
    z-index: 9998;
    mix-blend-mode: difference;
    will-change: transform;
    transition: width 0.12s, height 0.12s, margin 0.12s, opacity 0.12s;
  }
  #cursor.hover {
    width: 24px;
    height: 24px;
    margin-left: -12px;
    margin-top: -12px;
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div id="cursor"></div>

  <script>
    const cursor = document.getElementById('cursor')

    // 零延迟跟踪
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })

    // Hover 检测
    const onEnter = () => cursor.classList.add('hover')
    const onLeave = () => cursor.classList.remove('hover')

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    bindHover()

    // 动态元素自动绑定
    new MutationObserver(bindHover).observe(document.body, {
      childList: true,
      subtree: true
    })
  </script>
</body>
</html>
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `string` | `'#e60012'` | 光标颜色，支持任意 CSS 颜色值 |
| `size` | `number` | `6` | 正常状态下的圆点直径（px） |
| `hoverSize` | `number` | `24` | hover 状态下的圆点直径（px） |
| `hoverOpacity` | `number` | `0.5` | hover 状态下的透明度（0-1） |
| `blendMode` | `'difference' \| 'exclusion' \| 'normal'` | `'difference'` | CSS 混合模式，`difference` 在任何背景上都可见 |
| `transitionDuration` | `number` | `0.12` | hover 过渡动画时长（秒） |
| `zIndex` | `number` | `9998` | 光标的 z-index 层级 |

## 实现原理

### 为什么能做到零延迟？

传统自定义光标通常使用 `requestAnimationFrame` + lerp（线性插值）来实现平滑跟踪，这会带来明显的拖拽感。

本组件完全抛弃了这种方式，改为：

1. **直接事件驱动：** `mousemove` 事件直接设置 `transform: translate(x, y)`
2. **无 RAF 循环：** 不运行任何动画循环，节省 CPU
3. **GPU 加速：** 使用 `will-change: transform` 确保 transform 走合成层
4. **CSS 处理过渡：** hover 状态变化完全由 CSS transition 处理，不经过 JS

### 动态元素如何自动绑定？

SPA 项目中，路由切换或动态加载内容会新增 DOM 元素。组件使用 `MutationObserver` 监听整个 document 树的变更，在新增节点时自动为其绑定 hover 事件。

```
用户点击导航 → React 渲染新页面 → MutationObserver 检测到新 DOM
                                                             ↓
                                               自动为新元素绑定 hover 事件
```

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

依赖的 API：`mix-blend-mode`, `MutationObserver`, `transform` (GPU)

## License

Public Domain - 可自由用于任何项目。
