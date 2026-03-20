# Huipai Architecture Visualization (徽派建筑可视化)

一个用于“徽派建筑传播与构件关系”的交互式可视化项目（模块化展陈风格）。

## 技术栈

- 前端工程：React 18 + TypeScript + Vite
- 路由：React Router v6
- 状态管理：Zustand
- 图表引擎：ECharts（模块 1/以及多处静态图表原型）
- 词云：D3 + d3-cloud（独立词云 HTML，iframe 嵌入）
- 集成方式：
  - 模块 2/3 采用 `public/charts/` 中的原始 HTML 通过 `iframe` 直接嵌入
  - 模块 2 的构件切换通过 `module2.html` 统一控制 iframe 的 `src`
  - 模块 2 的词云通过 URL hash（例如 `词云图.html#mtq`）只渲染对应构件卡片

## 项目结构（关键点）

- `frontend/`：React/Vite 主工程
- `frontend/public/charts/`：可被 iframe 访问的静态图表/包装页集合
- `frontend/src/modules/module1/`：模块 1 React 图表实现（地图、桑葚/旭日/折线等）
- `frontend/src/modules/module2/`：模块 2 React 页面（仅负责加载 `/charts/module2.html`）
- `frontend/src/modules/module3/`：模块 3 React 页面（同样通过 iframe 加载 `/charts/module3.html`）

## 本地运行

```bash
cd frontend
npm install
npm run dev
```

打开提示的开发地址即可。

## 模块说明

- 模块 1：三省地图热力 + 城市/建筑点击联动（右侧介绍、主图与辅助图）
- 模块 2：五个构件页（马头墙 / 天井 / 粉墙 / 屋顶 / 水圳系统），通过构件切换器驱动 iframe 图表组合
- 模块 3：构件/技术相关的卡片系统与图表（同样 iframe 嵌入原型）

