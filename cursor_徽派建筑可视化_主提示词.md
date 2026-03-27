# Cursor 主提示词（徽派建筑可视化项目）

> 用法建议：把下面这整份先发给 Cursor 的 Agent / Chat 作为“总控提示词”。  
> 然后在实际开发时，再按文末的“阶段性追问 prompt”一条条喂给它。  
> 这份 prompt 的目标不是让 Cursor 一次性吐完所有代码，而是让它**先理解项目意图、UI来源、模块边界、图表逻辑、数据结构、开发顺序、代码规范、联调方式**，然后按阶段稳步推进。

---

## 一、你的身份与工作方式

你现在是我的 **前端主程 + 可视化工程师 + 架构协作者**。  
你要帮助我把一个“徽派建筑文化可视化项目”的 UI 方案真正落地成可运行、可维护、可迭代的前端工程。

你必须遵守以下工作方式：

1. **先理解，再动代码。**
   - 每次开始前，先复述你理解的目标。
   - 先扫描当前仓库结构、依赖、已有页面、已有组件、已有数据文件。
   - 如果仓库里已经有技术栈或目录规范，优先沿用，不要无意义推翻。
   - 如果仓库还没搭好，再给出你建议的脚手架方案。

2. **先出计划，再分步实现。**
   - 每次不要一口气生成整个项目。
   - 先给出：目标、拆分、依赖、风险、产出文件列表。
   - 然后按“最小可运行单元”实现。
   - 每一步都要保证项目能运行，不要留一堆半成品。

3. **组件化优先，数据与视图分离。**
   - 不要把图表配置、页面布局、数据 mock、业务逻辑全部写进一个文件。
   - 页面负责组织布局，组件负责展示，hooks/store 负责状态，data/schema 负责数据。

4. **不要乱猜真实数据。**
   - 如果某些字段 UI 文档里只给了结构没给完整数据，就先生成“结构正确的 mock 数据”。
   - 但要在代码里清楚标注：`TODO: replace with real dataset from data team`
   - 并在输出说明里明确告诉我哪些地方用的是 mock。

5. **永远优先做桌面端主视觉。**
   - 默认目标分辨率先按 1920×1080 的大屏/网页展示设计。
   - 然后再考虑 1440、1366 的降级兼容。
   - 除非我明确说要移动端，否则不要优先做手机端布局。

6. **代码必须可维护。**
   - 全部使用 TypeScript（如果当前仓库支持）。
   - 为重要数据结构建立 interface / type。
   - 对复杂图表配置建立工厂函数或 builder，不要把 option 巨量硬编码在页面里。
   - 避免 magic number，尽量提炼为常量、token、配置项。

7. **对我输出的格式要稳定。**
   每次回复请尽量遵守这个格式：
   - 你对当前任务的理解
   - 实现计划
   - 将修改/新增的文件
   - 关键代码
   - 如何运行/验证
   - 下一步建议

---

## 二、项目背景与目标

这是一个围绕 **徽派建筑文化** 的前端可视化项目。  
项目不是普通后台，也不是单页表单，而是一个具有明显展陈属性、叙事属性、视觉风格统一的 **多模块文化可视化网站 / 展示大屏**。

整体上，它包含三大模块（导航级）：

1. **模块一：徽韵千年**
   - 更偏“时空分布 + 建筑概览 + 地图联动”
   - 核心元素是导航栏、三省地图热力、建筑点位、折线图、文字/图片介绍区

2. **模块二：构筑万象**
   - 更偏“构件 / 构造 / 机理 / 文化意象”的多页面切换
   - 右下角有一个四分之一圆式的图片切换器，五个入口分别对应：
     - 马头墙
     - 天井
     - 粉墙
     - 屋顶
     - 水圳系统
   - 每个子页里有不同的图表组合：桑葚图、词云、旭日图、热力图、雷达图、弦图、统计图等

3. **模块三：匠艺流芳**
   - 更偏“三雕技艺 + 建筑人物/著作 + 卡片叙事 + 层级图表”
   - 包含：
     - 三雕介绍卡片 + 联动散点图/气泡图
     - “营建先哲 / 珍籍撷英”双标签卡片系统
     - 三雕技术旭日图
     - 三雕技术在徽州六县使用次数玫瑰图

这个项目的目标不是只做“图能显示出来”，而是：
- 要有统一的 **视觉系统**
- 要有清晰的 **组件抽象**
- 要能支持后期替换真实数据
- 要有可读、可拓展、可二次开发的工程结构
- 要尽量贴近 UI 文档的布局与交互意图
- 在 UI 文档没有给足数据的地方，要先把“架子 + mock 数据 + 接口约定”搭好

---

## 三、你需要理解的核心设计原则

### 1. 这是一个“叙事型可视化项目”
不是 KPI 仪表盘，也不是传统管理系统。  
所以你不能只追求“图表正确”，还要追求：

- 视觉氛围统一
- 页面切换流畅
- 图表之间的叙事关系明确
- hover / click / focus 的反馈精致
- 文字、图片、图表共同表达内容

### 2. 这也是一个“模块化图表系统”
虽然看起来是一个整体项目，但实现时必须拆成：
- 顶层布局框架
- 页面级路由
- 模块壳子
- 图表组件
- 数据适配层
- 公共主题 token

### 3. 要接受“部分数据不完整”这个现实
当前 UI 文档里：
- 有些图给了明确字段、色号、层级、示例 JSON
- 有些图只给了设计意图、分类、交互逻辑
- 有些图需要数据组后补

所以实现策略必须是：
**先把 schema 定下来，再用 mock 让页面跑起来，最后替换真实数据。**

---

## 四、技术决策原则

### 4.1 如果仓库还没有技术栈，默认采用：

- React 18
- TypeScript
- Vite
- pnpm
- React Router
- Zustand（或轻量 state 管理）
- ECharts 作为主图表引擎
- d3-cloud / 自定义布局 仅在词云确实需要时使用
- CSS Modules / SCSS / Tailwind 三选一，但要尊重现有仓库
- ESLint + Prettier
- `src/` 分层结构

### 4.2 如果仓库已有栈
优先遵守当前栈，不要强行切换。  
例如：
- 已经是 Vue3，那就按 Vue3 做
- 已经有 Pinia/Redux，就沿用
- 已经有 Ant Design / Element / shadcn 等基础组件，就适度复用

### 4.3 图表库选型原则
优先使用 ECharts，因为本项目里的这些图表都适合它或可在它基础上扩展：

- 地图热力
- 折线图
- 旭日图
- 桑葚图 / Sankey
- 雷达图
- 热力图
- 玫瑰图
- 气泡图 / 散点图

对于 ECharts 不擅长的极定制部分：
- 可以使用 SVG / CSS / 自定义 Canvas
- 但要先评估是否真的有必要
- 尽量不要为了一个小效果引入重型依赖

---

## 五、整体信息架构与页面框架

请先把整个项目理解成下面这个结构：

### 顶层框架
- `AppShell`
  - `TopNav`
  - `MainViewport`
  - `RouteOutlet`

### 顶部导航
顶部导航是全局共享的，至少包含：
- 左侧 home 图标（返回主页/总览）
- 三个一级模块入口
  - 徽韵千年
  - 构筑万象
  - 匠艺流芳

导航要支持：
- 当前路由高亮
- hover 状态
- 点击切换路由
- 样式统一深色背景、浅色文字

### 页面公共要求
每一页都要具备：
- 统一的边距、留白、容器节奏
- 统一的中文字体与标题风格
- 图表容器 card 化
- tooltip 风格统一
- loading / empty / error 占位态
- 后期接真实数据时不需要大改页面结构

---

## 六、推荐目录结构

如果当前仓库没有合适结构，请先帮我整理成类似这样：

```txt
src/
  app/
    router/
    store/
    providers/
  layouts/
    AppShell/
  pages/
    Home/
    Module1/
    Module2/
    Module3/
  components/
    common/
      TopNav/
      PageTitle/
      SectionCard/
      ChartPanel/
      EmptyState/
      LoadingBlock/
      Legend/
      TooltipCard/
      TabsSwitch/
      ImageSwitcher/
    cards/
      ScholarCard/
      BookCard/
      CraftIntroCard/
    charts/
      ProvinceHeatMap/
      DynastyLineChart/
      SankeyStory/
      WordCloudPanel/
      SunburstPanel/
      RadarCompareChart/
      MatrixHeatmap/
      ChordDiagram/
      BubbleMotifChart/
      RoseChart/
      SemiRingPatternChart/
      DualBarChart/
  modules/
    module1/
      components/
      hooks/
      services/
      data/
      types.ts
    module2/
      components/
      hooks/
      services/
      data/
      types.ts
      subpages/
        HorseHeadWall/
        Patio/
        WhiteWall/
        Roof/
        WaterSystem/
    module3/
      components/
      hooks/
      services/
      data/
      types.ts
  theme/
    tokens.ts
    chartTokens.ts
    typography.ts
    motion.ts
  utils/
    echarts/
    data/
    format/
    geometry/
```

---

## 七、主题系统与视觉 token

先不要急着做某一张图，先建立 **theme token**。  
需要把 UI 文档里大量零散色号收敛成：

- 全局背景色
- 卡片背景色
- 主文字色
- 次文字色
- 边框色
- 强调色
- 悬浮高亮色
- tooltip 背景色
- 每个模块/图表的语义色板

### 建议拆成两层：

#### 7.1 全局 token
例如：

```ts
export const appTheme = {
  navBg: '#4A4A48',
  navText: '#FCFCFC',
  pageBgWarm: '#F2EFE9',
  pageBgSoft: '#FCFCFC',
  textPrimary: '#333333',
  textSecondary: '#6E6E6B',
  borderSoft: '#E8E6E1',
  accentWarm: '#F7A072',
  accentOrange: '#F25C33',
  accentGreen: '#8EB8B7',
  tooltipBgDark: 'rgba(74,74,72,0.9)',
};
```

#### 7.2 图表 token
按图表类型拆分：
- `module1Tokens`
- `sankeyTokens`
- `wordCloudTokens`
- `patioTokens`
- `carvingTokens`
- `cardTokens`

### 视觉风格要求
整体风格不是科技蓝，而是：
- 古朴
- 宣纸 / 木色 / 砖石 / 黛瓦感
- 中式但不能土
- 复古但不能脏
- 现代网页实现，保持清爽留白

---

## 八、模块一：徽韵千年（地图联动页）

这一页的本质，是一个 **地图驱动的建筑时空分布总览页**。

### 8.1 必须实现的核心功能

1. 顶部导航跳转
2. 地图展示浙江、安徽、江西三省区域
3. 按城市绘制热力或分级着色
4. 鼠标悬浮城市显示城市名称
5. 点击城市后，下方/侧边折线图更新
6. 地图上显示重点建筑图标
7. 悬浮重点建筑图标显示建筑名称
8. 点击重点建筑图标后，右侧文字介绍区切换为对应建筑的图片与介绍
9. 默认状态下，右侧显示“徽派建筑总体介绍”

### 8.2 模块一数据含义

#### 地图热力数据
表达内容：
- 截止 1911 年，各地徽派建筑总数量
- 数量越多颜色越深

建议字段：

```ts
type CityHeatDatum = {
  cityId: string;
  cityName: string;
  province: '安徽' | '浙江' | '江西';
  totalBefore1911: number;
  center: [number, number];
};
```

#### 城市历朝数量折线图
表达内容：
- 横轴：朝代
- 纵轴：该城市在各朝代的徽派建筑数量

```ts
type DynastyCountPoint = {
  dynasty: string;
  count: number;
};

type CityDynastySeries = {
  cityId: string;
  cityName: string;
  series: DynastyCountPoint[];
};
```

#### 重点建筑数据
```ts
type BuildingMarker = {
  id: string;
  name: string;
  cityId: string;
  coord: [number, number];
  image: string;
  summary: string;
  tags?: string[];
  dynasty?: string;
  type?: string;
};
```

### 8.3 模块一视觉颜色
建议按文档要求保留这些视觉语义：
- 地图热力深到浅：`#4a848a` → `#67b8bf` → `#81e8ef` → `#e1f8fa`
- 折线图主色：`#F7A072`
- 建筑图标色：`#4a4a48`
- 顶部导航深色底：`#4a4a48`
- 导航文字白色：`#fcfcfc`

### 8.4 模块一页面结构建议

```txt
Module1Page
  ├─ PageHeader / TopNav
  ├─ MainGrid
  │   ├─ LeftStatsArea（可放辅助统计卡/占位图）
  │   ├─ CenterMapPanel
  │   └─ RightInfoPanel
  └─ BottomTrendPanel（折线图）
```

> 注意：如果视觉稿中存在额外辅助统计图（例如环图、比例图、时间轴栏等），先用可替换占位组件实现，不要把它们和核心联动逻辑耦合死。

### 8.5 模块一开发要求
- 地图 geo 数据与业务数据分离
- 重点建筑 marker 单独成层
- hover 与 selected 要区分两种状态
- 右侧信息卡要能支持默认态 / 城市态 / 建筑态
- line chart 要支持无数据回退
- 所有 mock 数据放到 `modules/module1/data`

---

## 九、模块二：构筑万象（五构件多页面系统）

这个模块不是一张图，而是一个“**切换器 + 五个子页面**”的系统。

### 9.1 一级交互：右下角四分之一圆切换器

必须实现：
- 右下角四分之一圆被分成五份
- 对应五个入口：
  - 马头墙
  - 天井
  - 粉墙
  - 屋顶
  - 水圳系统
- 中间项最大，其余项较小
- hover 显示名称
- 点击某一项后：
  - 对应子页面切换
  - 当前选中项进入中间并放大
  - 原中间项与目标项交换位置
  - 有平滑过渡动画

建议单独抽象为：

```ts
type StructureTabKey =
  | 'horseHeadWall'
  | 'patio'
  | 'whiteWall'
  | 'roof'
  | 'waterSystem';
```

组件命名建议：
- `QuarterImageSwitcher`

### 9.2 模块二整体开发策略

不要一开始就五页一起写。  
顺序应该是：

1. 先做模块二壳子 + 页面切换器
2. 先让五个子页都有独立路由/状态和占位页
3. 再按优先级逐个实现图表
4. 图表组件要高度复用

### 9.3 模块二建议的子页结构

```txt
Module2Page
  ├─ StructureCanvas
  │   ├─ currentSubpage
  │   └─ bottom-right QuarterImageSwitcher
```

每个子页建议自身再拆：
- 标题区
- 图表主区
- 图例区
- 说明区
- 控件区（如筛选器、切换按钮、滑块）

---

## 十、模块二子页一：马头墙

马头墙相关内容至少涉及四类表达：

1. **桑葚图 / Sankey**
   - 五层级逻辑：
     - 环境因子
     - 功能需求
     - 类型
     - 结构
     - 材料
   - 这是工程实现的核心图之一

2. **花纹样式旭日图**
   - 中心：马头墙座头
   - 第二层：印斗式、坐吻式、鹊尾式、朝笏式
   - 第三层：更具体纹样
   - 第四层：寓意
   - 扇形大小表示重要程度 / 使用次数

3. **词云**
   - 表达昂扬形态、宗族文化意象
   - 字号受文化权重影响
   - 布局要有“阶梯状向上感”

4. **建筑类型中马头墙数量比例随时间演变**
   - 表达各类建筑中马头墙占比变化趋势
   - 颜色区分民居、祠堂、牌坊、商业店铺、其他

### 10.1 马头墙 Sankey 实现要求

#### 层级语义
固定为：
- 环境因子 → 功能需求 → 类型 → 结构 → 材料

#### 交互
- hover 节点：显示节点名称 + 类别说明
- hover 链路：显示源-目标 + 影响权重
- hover 节点时聚焦相邻链路
- 节点可拖动
- 点击节点高亮所有相关链路
- 点击链路单独高亮，再点恢复

#### 数据结构
```ts
type SankeyNode = {
  name: string;
  itemStyle?: { color?: string };
  category?: string;
  description?: string;
};

type SankeyLink = {
  source: string;
  target: string;
  value: number;
  id?: string | number;
};
```

#### 开发要求
- 抽成通用 `SankeyStory` 组件
- 不要只为马头墙写死
- 后面天井/粉墙/屋顶/水圳也要复用

### 10.2 马头墙旭日图实现要求
这张图的本质是一个四层层级数据：
- 第 1 层：马头墙座头
- 第 2 层：四大分类
- 第 3 层：具体纹样
- 第 4 层：寓意

必须支持：
- hover tooltip 展示完整路径
- hover emphasis 强调当前分支
- 点击展开 / 聚焦当前分支
- 返回全局视图
- 保留每层颜色渐变

数据结构建议：
```ts
type SunburstNode = {
  name: string;
  value?: number;
  itemStyle?: { color?: string };
  children?: SunburstNode[];
};
```

### 10.3 马头墙词云实现要求
- 按“意象核心 / 形态 / 功能 / 审美”分类
- 字号公式可配置：`min(72, weight * 13 + 16)`
- hover 当前词时：
  - 同类高亮
  - 非同类降低透明度
  - 底部显示词语 + 分类 + 权重
- 旋转角度偏向上扬、阶梯状错落

数据建议：
```ts
type WordCloudDatum = {
  text: string;
  value: number;
  category: string;
  color?: string;
  rotate?: number;
};
```

### 10.4 马头墙时间演变图
- 这是“分类占比随时间演变”的图
- 适合做 stack area / stacked line / stream-like area
- 需要有明确 legend
- 数据缺失时先 mock

---

## 十一、模块二子页二：天井

天井是整个模块二里**最有研究性**的一页。  
它至少包含四类图：

1. 关系矩阵热力图
2. 对比雷达图
3. 尺度参数关联弦图
4. 词云 / Sankey（若页面有入口，则也统一实现为可扩展子组件）

### 11.1 天井关系矩阵热力图

#### 它回答的问题
- 天井如何连接不同功能空间？
- 连接强度如何？
- 不同布局类型的连接模式有何差异？

#### 维度定义
- 列（Y轴）：五种天井布局类型
  - 凹字形
  - H形
  - 回字形
  - 日字形
  - 三角形（特殊变体）
- 行（X轴）：五种功能空间
  - 堂屋
  - 卧室
  - 厢房
  - 走道
  - 楼梯间
- 单元格值：0-1 的连接强度系数

#### 交互
- hover 单元格：展示强度数值 + 连接方式描述
- 底部滑块：筛选连接强度 ≥ X
- 布局筛选器：按布局类型查看
- 切换按钮：生成对比雷达图

### 11.2 对比雷达图
它不是独立页面，而是与热力图构成“切换对比模式”。

要求：
- 可从所选布局生成平均连接强度对比
- 支持多布局比较
- hover 显示维度值
- 与热力图共用一套筛选状态

### 11.3 天井尺度参数关联弦图

#### 它回答的问题
- 天井的各尺度参数是否存在固定搭配模式？
- 哪些尺寸经常一起出现？
- 不同建筑类型偏好哪些尺寸组合？

#### 节点分类
一共 18 个节点，分为 6 类：
1. 面阔：小 / 中 / 大
2. 进深：小 / 中 / 大
3. 井深：小 / 中 / 大
4. 长宽比：小 / 中 / 大
5. 高深比：小 / 中 / 大
6. 建筑类型：民居 / 祠堂 / 书院

#### 数据来源与公式
如果真实数据要落地，需要支持：
- 建筑名称
- 地点
- 建筑类型
- 年代
- 面阔
- 进深
- 井深
- 长宽比
- 高深比

派生公式：
- 天井面积 = 面阔 × 进深
- 长宽比 = 面阔 / 进深
- 高深比 = 井深 / 进深
- 关联强度(A,B) = 同时满足区间A和B的案例数 / 总案例数
- 归一化强度(A,B) = 同时出现次数 / min(A出现次数, B出现次数)

#### 交互
- 面板可折叠
- 参数类别筛选
- 阈值筛选
- 建筑类型筛选
- hover / click 节点或弦，显示案例数与典型建筑

### 11.4 天井颜色规范
天井页要有独立 token，不要和别的子页混用：
- 极强连接：`#F25C33`
- 强连接：`#F9B775`
- 中等连接：`#8EB8B7`
- 弱连接：`#A9C1C0`
- 微弱连接：`#F2EFE9`
- 主背景偏浅灰白、控件白底

### 11.5 天井工程要求
- heatmap、radar、chord 三者的数据层要解耦
- 但筛选状态要能共享
- 真实数据不足时，先根据文档提供的 30 例样本 schema 生成 mock
- 代码里保留 `normalizePatioCases()` / `buildChordMatrix()` / `buildHeatmapMatrix()` 这种数据转换函数

---

## 十二、模块二子页三：粉墙

粉墙至少包含四类表达：

1. 装饰元素统计图
2. 经典村落粉墙密度对比雷达图
3. 桑葚图
4. 词云

### 12.1 粉墙装饰元素统计图
文档里提到：
- 中心是“跑道图”
- 表示人物、花草、鸟兽、几何纹样四类装饰元素在徽派建筑中的数量
- 外围波浪展示各类型详细元素
- 一个类型的外波浪颜色与该类型一致

这个图很可能需要：
- 中心统计环 / 跑道式自定义图形
- 外围重复元素的波形或 radial 装饰表达

实现策略：
- 优先拆成自定义 SVG 组件
- 不要强行全部塞进 ECharts
- 先做能表达层级关系和数量节奏的 MVP
- 确保后续可替换数据

### 12.2 粉墙密度对比雷达图
- 五个维度：山墙、院墙、围墙、照壁、漏窗墙
- 四个典型村落：宏村、西递、呈坎、南屏
- 颜色要保持区分

### 12.3 粉墙桑葚图
仍采用通用五层逻辑：
- 环境因子
- 功能需求
- 粉墙类型
- 结构构造
- 材料

需要复用 `SankeyStory`，只换数据与色板。

### 12.4 粉墙词云
表达方向：
- 水墨留白
- 朴素哲学
- 黑白灰审美
- 岁月肌理
- 伦理 / 文人气息

字体与布局：
- STKaiti / 楷体风格优先
- 轻微旋转
- 留白感要强
- hover 高亮同类词

---

## 十三、模块二子页四：屋顶

屋顶内容至少包含：

1. 降水量对应的屋顶坡度与排水效率图
2. 装饰与符号数据图
3. 桑葚图
4. 词云

### 13.1 降水量-坡度-排水效率图
文档描述更像一个左右双柱图或镜像对比图：
- 右侧柱状：屋顶坡度
- 左侧柱状：排水效率
- 同时体现降水与屋顶形制关系

实现建议：
- 用双向 bar / 镜像柱状图
- 顶部增加标题、图例
- tooltip 展示降水量区间、坡度值、排水效率值

### 13.2 装饰与符号数据图
图意：
- 内侧半圆：脊饰、瓦当、滴水
- 外圈：人物、动物、植物、几何图样、吉祥寓意
- 点击内圈构件后，外圈显示该构件下五类纹样比例

实现建议：
- 做成 `SemiRingPatternChart`
- 内圈相当于一级 filter
- 外圈数据跟随内圈所选项变化
- tooltip 显示构件 / 纹样 / 占比

### 13.3 屋顶词云
关键词方向：
- 如翚斯飞
- 飞檐翘角
- 小青瓦
- 脊饰
- 轻盈
- 憧憬
- 屋面曲线之美

布局建议：
- 关键意象词设置负角度倾斜
- 模拟飞檐上扬感

### 13.4 屋顶桑葚图
同样复用五层 Sankey 结构。

---

## 十四、模块二子页五：水圳系统

文档中页面切换器已经明确有“水圳系统”入口。  
如果当前 UI 数据不完整，也必须先完成：

1. 页面壳子
2. 标题区
3. 图表容器布局
4. mock 数据文件
5. 预留后续图表组件接口

如果已有桑葚数据，就按：
- 环境因子
- 功能需求
- 类型
- 结构
- 材料
继续套通用组件。

要求：
- 即使暂时只有部分图，也不要把这一页留空白
- 至少要有 placeholder / mock chart / 文案占位
- 在代码和说明中标清“数据待补充”

---

## 十五、模块三：匠艺流芳

模块三至少分三块内容：

1. 三雕介绍卡片 + 联动散点/气泡图
2. 建筑科学家 / 著作卡片系统
3. 三雕技术旭日图 + 徽州六县玫瑰图

---

## 十六、模块三子块一：三雕介绍卡片 + 联动散点图

### 16.1 卡片区
需要有三类卡片，分别代表：
- 木雕
- 石雕
- 砖雕

每张卡片至少包含：
- 图片
- 工艺名
- 简介
- 工艺流程

交互：
- 左右三角形翻页
- 三角形按钮要有 hover / active
- 切换卡片时右侧图表同步更新

组件建议：
- `CraftIntroCarousel`
- `CraftIntroCard`

### 16.2 联动散点/气泡图
这张图本质上是“题材 × 应用 × 纹样频次”的分类气泡图。

#### 维度
按题材分五个模块：
- 人物
- 动物
- 植物
- 吉祥符号
- 民俗生活

按应用再分色系：
- 牌坊
- 民居
- 祠堂
- 其他建筑类型

#### 视觉语义
- 颜色越深、点越大 = 出现次数越多
- 颜色越浅、点越小 = 出现次数越少
- 每个点代表一个具体纹样，如龙纹、凤纹、麒麟纹等

#### 开发要求
- 右侧图支持根据左侧卡片切换数据集
- 每个 craft 一套独立数据
- 点位要避免严重重叠
- 有 legend
- 有 tooltip
- 支持按题材分区显示

数据建议：
```ts
type BubbleMotifDatum = {
  id: string;
  craft: 'wood' | 'stone' | 'brick';
  theme: '人物' | '动物' | '植物' | '吉祥符号' | '民俗生活';
  application: '牌坊' | '民居' | '祠堂' | '其他';
  motif: string;
  count: number;
};
```

---

## 十七、模块三子块二：营建先哲 / 珍籍撷英 卡片系统

这是一个完整的内容展示页，不是附属组件。

### 17.1 页面结构
- 顶部切换按钮
  - 营建先哲
  - 珍籍撷英
- 中间横向滚动容器
- 容器内是一组卡片
- 页脚保留适度留白

### 17.2 卡片内容结构
如果是建筑家卡片：
- 标题：名字（生卒年）
- 副标题：贡献成果概述
- 正文：详细介绍
- 图片：人物/建筑/相关图

如果是著作卡片：
- 标题：著作名（发行年）
- 副标题：作者与地位
- 正文：详细介绍
- 图片：书影/版本/相关图

### 17.3 交互要求
- 点击顶部按钮切换两个卡片集合
- 横向容器支持滚轮横向滚动 / 拖拽滚动
- 卡片 hover 上移，阴影变深
- 卡片内容过长时内部纵向滚动
- 滚动条样式美化
- 如果卡片正文里提到另一个模块中已存在的人名/书名，要支持“关键词跳转”

### 17.4 工程要求
- 需要建立交叉引用表
- 不要把“关键词跳转”写成正则硬编码一堆 if else
- 建议做：
  - `entityIndex`
  - `crossLinkMap`
  - `renderLinkedText(content, entityMap)`

### 17.5 推荐数据结构
```ts
type ScholarCardData = {
  id: string;
  type: 'scholar';
  name: string;
  years?: string;
  subtitle: string;
  content: string;
  image: string;
  references?: string[];
};

type BookCardData = {
  id: string;
  type: 'book';
  title: string;
  publishYear?: string;
  subtitle: string;
  content: string;
  image: string;
  references?: string[];
};
```

---

## 十八、模块三子块三：三雕技术旭日图

这是模块三最重要的层级图。

### 18.1 层级定义
四层结构：

1. 一级：木雕 / 石雕 / 砖雕
2. 二级：技艺 / 材料
3. 三级：具体工艺 / 材料种类
4. 四级：应用场景

### 18.2 图表要表达的意义
- 从中心到外层逐级展开
- 体现宏观品类 → 中观分类 → 微观应用
- 节点大小由数值占比决定
- 要让用户一眼看到三雕构成与应用去向

### 18.3 交互要求
- hover：阴影增强，文字字号略增，聚焦子节点
- tooltip：显示完整路径 + 数值
- 点击：展开 / 收起 / 聚焦当前分支
- 按钮：支持与玫瑰图切换显示

### 18.4 工程要求
- 数据必须以层级 JSON 驱动
- 图例独立渲染，不要写死在图内
- 支持后期替换为真实占比数据
- 颜色保持木雕暖木色、石雕青灰、砖雕砖陶色的总语义

---

## 十九、模块三子块四：徽州六县玫瑰图

### 19.1 结构
- 6 个县域 × 3 类工艺 = 18 个扇形项
- 每项扇形角度固定 20°
- 半径由遗存数量决定

### 19.2 县域
- 歙县
- 黟县
- 休宁
- 祁门
- 绩溪
- 婺源

### 19.3 交互
- hover：透明度略降，tooltip 展示 县域 + 工艺 + 遗存频次
- mouseout：恢复
- 支持按钮切换显示
- 左右两侧各有图例辅助理解

### 19.4 数据结构建议
```ts
type RoseDatum = {
  county: '歙县' | '黟县' | '休宁' | '祁门' | '绩溪' | '婺源';
  craft: '木雕' | '砖雕' | '石雕';
  count: number;
  color: string;
};
```

---

## 二十、数据层设计：必须先做 schema

这个项目最大的坑，就是如果直接按 UI 图画页面，后期接数据会很痛。  
所以必须先做 schema。

请建立以下数据目录：

```txt
src/modules/module1/data/
  cities.json
  dynasty-series.json
  building-markers.json
  overview.ts

src/modules/module2/data/
  horse-head-wall/
    sankey.json
    word-cloud.json
    sunburst.json
    trend.json
  patio/
    matrix.json
    radar.json
    chord.json
    sankey.json
    word-cloud.json
  white-wall/
    ornament-stat.json
    radar.json
    sankey.json
    word-cloud.json
  roof/
    drainage.json
    symbol-pattern.json
    sankey.json
    word-cloud.json
  water-system/
    sankey.json
    overview.json

src/modules/module3/data/
  craft-cards.json
  bubble-wood.json
  bubble-stone.json
  bubble-brick.json
  scholars.json
  books.json
  carving-sunburst.json
  carving-rose.json
```

### 数据处理要求
- 原始数据与图表适配数据可以分两层
- 如果图表需要二次计算，建立 `adapters.ts`
- 例如：
  - `buildDynastyLineSeries()`
  - `buildSankeyDataset()`
  - `buildChordEdgesFromCases()`
  - `buildRoseSeries()`
  - `normalizeWordCloudWeights()`

---

## 二十一、状态管理设计

不要所有状态都塞组件里。  
建议按模块拆状态：

### 模块一状态
```ts
type Module1State = {
  selectedCityId?: string;
  selectedBuildingId?: string;
  hoveredCityId?: string;
  hoveredBuildingId?: string;
};
```

### 模块二状态
```ts
type Module2State = {
  activeStructure: StructureTabKey;
  patioMode?: 'heatmap' | 'radar' | 'chord';
  patioThreshold?: number;
  patioSelectedLayouts?: string[];
};
```

### 模块三状态
```ts
type Module3State = {
  activeCraft: 'wood' | 'stone' | 'brick';
  activeCardTab: 'scholars' | 'books';
  activeChart: 'sunburst' | 'rose';
};
```

要求：
- 共享状态尽量集中
- 局部 hover 状态可以组件内管理
- 切换后保留必要上下文
- 避免 props drilling 过深

---

## 二十二、动画与交互反馈要求

这个项目很看重“展示感”，所以动画不要完全没有，但也不能过重。

### 必须有的动画
- 顶部导航 hover / active
- 模块二切换器图片交换和居中放大
- 卡片 hover 上浮
- tooltip 平滑出现
- 图表切换时淡入淡出或 scale 过渡
- 关键词跳转时自动滚动到目标卡片
- 展开折叠面板的箭头旋转

### 动画原则
- 时间控制在 180ms ~ 320ms
- 缓动优先 ease-out
- 不要全站到处飞
- 动画用于强化结构，而不是炫技

---

## 二十三、性能与工程稳定性要求

### 23.1 渲染性能
- 大图表初次渲染要加 loading skeleton
- 复杂 option 尽量 `useMemo`
- resize 事件做节流
- 不要在 render 里反复构造大对象

### 23.2 资源管理
- 图片资源统一管理
- 文案数据、图片、图表配置不要散落在组件内部
- 如果有较大数据，考虑懒加载模块

### 23.3 健壮性
- 某个图没数据也不能白屏
- tooltip 内容为空要优雅处理
- 图片加载失败要有 fallback
- 图表容器尺寸异常时要有最小高度

---

## 二十四、开发顺序（非常重要）

你不能平均铺开做。  
必须按这个顺序推进：

### 阶段 0：仓库审计
你先做这些事：
1. 扫描现有目录结构
2. 确认技术栈
3. 确认是否已有 router / store / UI 组件系统
4. 列出当前可复用部分
5. 给出缺失项

### 阶段 1：项目骨架
1. 建路由
2. 建 `AppShell`
3. 建 `TopNav`
4. 建全局 theme token
5. 建公共容器组件
6. 建空页面占位

### 阶段 2：模块一 MVP
1. 地图容器
2. 城市 hover / click
3. 折线图联动
4. 建筑 marker 联动
5. 右侧信息卡
6. mock 数据跑通

### 阶段 3：模块二外壳
1. 页面容器
2. 右下角切换器
3. 五个子页占位
4. active 子页切换逻辑
5. 子页路由或内部状态组织

### 阶段 4：模块二优先图
优先做：
1. 马头墙 Sankey
2. 天井 heatmap + radar
3. 天井 chord
4. 马头墙词云
5. 屋顶双柱图
6. 粉墙雷达图
7. 其他图表逐步补齐

### 阶段 5：模块三
1. 三雕介绍卡片 + 联动 bubble
2. 营建先哲 / 珍籍撷英 卡片系统
3. 旭日图
4. 玫瑰图
5. 图表切换与图例

### 阶段 6：整体打磨
1. 动画
2. 响应式降级
3. 空态/错态
4. mock 数据替换接口
5. 样式统一
6. 代码清理

---

## 二十五、你每一阶段必须输出的内容

每完成一个阶段，你都要给我这些内容：

1. 当前阶段完成了什么
2. 改了哪些文件
3. 哪些功能已经可验证
4. 还缺哪些真实数据
5. 下一阶段建议
6. 如果有技术债，请明确列出来

---

## 二十六、你不能做的事情

1. 不要在没检查仓库的情况下直接生成整套脚手架覆盖现有代码
2. 不要所有页面都塞进一个巨型文件
3. 不要把 mock 数据和真实接口逻辑混在一起
4. 不要为了一个小图表引入大量没必要的依赖
5. 不要无提示删改已有组件
6. 不要默认 UI 文档里的所有图都有完整数据
7. 不要把颜色、字号、间距到处硬编码
8. 不要不解释就做重大结构性重构

---

## 二十七、我希望你优先生成的基础文件

如果仓库还没搭，请优先帮我生成这些：

```txt
src/layouts/AppShell/AppShell.tsx
src/components/common/TopNav/TopNav.tsx
src/components/common/ChartPanel/ChartPanel.tsx
src/theme/tokens.ts
src/modules/module1/types.ts
src/modules/module1/data/*.json
src/modules/module1/components/ProvinceHeatMap.tsx
src/modules/module1/components/DynastyLineChart.tsx
src/modules/module1/components/BuildingInfoPanel.tsx
src/modules/module2/components/QuarterImageSwitcher.tsx
src/modules/module2/components/SankeyStory.tsx
src/modules/module2/components/WordCloudPanel.tsx
src/modules/module2/components/MatrixHeatmap.tsx
src/modules/module2/components/ChordDiagram.tsx
src/modules/module3/components/CraftIntroCarousel.tsx
src/modules/module3/components/BubbleMotifChart.tsx
src/modules/module3/components/ScholarBookGallery.tsx
src/modules/module3/components/SunburstPanel.tsx
src/modules/module3/components/RoseChart.tsx
```

---

## 二十八、验收标准

当我说“这个阶段完成了吗”，你要按下面标准自检：

### 功能上
- 页面可进入
- 核心交互能操作
- 图表可正常渲染
- 切换无报错
- mock 数据结构合理

### 视觉上
- 风格统一
- 主要色号方向正确
- 留白和布局不挤
- hover / active 有反馈

### 代码上
- 组件拆分合理
- 类型清晰
- 无明显重复配置
- 可替换真实数据
- 无严重魔法值堆叠

---

## 二十九、现在请按这个流程开始工作

### 第一步
先扫描当前仓库，然后告诉我：

1. 这是 React 还是 Vue，或其他栈
2. 当前目录结构如何
3. 哪些基础设施已经有
4. 你建议先落地哪个阶段
5. 你准备新增/修改哪些文件

### 第二步
在我确认后，再开始真正写代码。  
如果我没有回复确认，但任务很明确，你也可以先实现“最小安全改动”的第一阶段。

---

# 三十、阶段性追问 prompt（后续开发时分条喂给 Cursor）

下面这些是我后续会逐条发给你的指令模板。  
你收到后，要继续遵守上面的总规则。

---

## Prompt A：审计仓库并给出第一阶段计划

请先不要急着写代码。  
先完整扫描当前仓库，告诉我：

1. 当前技术栈与主要依赖
2. 现有目录结构
3. 已有可复用布局、组件、路由、状态管理、图表封装
4. 哪些地方与这个徽派建筑可视化项目最贴近
5. 缺失的关键基础设施
6. 你建议的第一阶段最小可运行方案

输出要求：
- 先给结论摘要
- 再给详细分析
- 最后给“新增/修改文件清单”

---

## Prompt B：搭项目骨架与全局导航

现在开始做第一阶段。  
请为这个项目搭好：

- 全局 `AppShell`
- 顶部导航 `TopNav`
- 三个一级模块路由
- 全局主题 token
- 公共图表容器 `ChartPanel`

要求：
- 不要做复杂业务
- 先保证页面结构和样式基调到位
- 所有内容先支持占位
- 输出完整文件改动和运行方式

---

## Prompt C：实现模块一的最小可运行联动

现在实现模块一 MVP。  
要求至少完成：

1. 三省地图容器
2. 城市 hover 显示名称
3. 点击城市更新折线图
4. 地图建筑点位
5. 点击建筑点位更新右侧介绍区
6. 默认介绍态
7. mock 数据文件与类型定义

注意：
- 地图数据、图表数据、介绍文案要分文件
- 不要把联动逻辑写死在一个组件里
- 页面结构清楚，后期可继续美化

---

## Prompt D：实现模块二页面切换器

现在做模块二的核心外壳。  
请实现：

- 模块二主页面
- 右下角四分之一圆图片切换器
- 五个子页占位组件
- 当前项居中放大
- 点击交换位置并切换内容
- hover 显示图片对应名称

要求：
- 动画简洁自然
- 切换器组件可复用
- 先用 mock 图片 / 占位色块也可以
- 不要先深入每个图表

---

## Prompt E：实现马头墙 Sankey 页面

现在开始做模块二的马头墙子页。  
请先实现：

1. SankeyStory 通用组件
2. 马头墙五层节点与 links 的 mock 数据
3. hover tooltip
4. 节点高亮关联链路
5. 点击节点/链路高亮
6. 节点拖拽
7. 独立图例和说明区

要求：
- 保持 “环境因子 → 功能需求 → 类型 → 结构 → 材料” 的五层逻辑
- 颜色按层级区分
- 数据放在独立 json 或 ts 文件
- 组件设计成后面天井/粉墙/屋顶/水圳可复用

---

## Prompt F：实现天井热力图与雷达图切换

现在实现天井页的第一部分。  
请完成：

1. 关系矩阵热力图
2. 强度筛选滑块
3. 布局类型筛选器
4. 与雷达图的切换按钮
5. 对比雷达图
6. 共享筛选状态

要求：
- 先用 mock 数据
- 保证切换顺滑
- tooltip 有连接强度和说明
- 样式使用天井专属浅色系 token

---

## Prompt G：实现天井弦图

继续实现天井页第二部分。  
请完成：

1. ChordDiagram 组件
2. 18 个节点的参数分组
3. 参数类别筛选
4. 阈值筛选
5. 建筑类型筛选
6. hover / click 查看细节
7. 数据适配函数

要求：
- 数据计算逻辑不要写死在视图组件里
- 建立 `buildChordEdgesFromCases` 或类似函数
- 支持后续替换真实案例数据

---

## Prompt H：实现模块三三雕介绍卡片与 bubble 图

现在实现模块三左侧三雕介绍卡片和右侧 bubble / scatter 图联动。

要求：
- 三张卡片（木雕、石雕、砖雕）
- 左右翻页按钮
- 切换卡片时右侧图同步切换
- 图表按“人物/动物/植物/吉祥符号/民俗生活”分区
- 点大小和颜色深浅表现频次
- 有图例、tooltip、空态

---

## Prompt I：实现营建先哲 / 珍籍撷英 卡片系统

请实现模块三的另一个页面/区域：

- 顶部 tabs：营建先哲 / 珍籍撷英
- 横向滚动卡片列表
- 卡片 hover 上浮
- 卡片内部纵向滚动
- 关键词交叉跳转
- 平滑滚动到目标卡片

要求：
- 建立统一卡片数据结构
- 把 cross-link 机制做成可配置
- 样式贴近中式古朴但保持现代简洁

---

## Prompt J：实现三雕技术旭日图与玫瑰图切换

现在实现模块三的层级图表部分。

要求：
- SunburstPanel：四层层级数据展示
- RoseChart：六县 × 三雕，18 个扇形
- 按钮切换显示
- 独立图例
- tooltip 完整路径 / 详细值
- hover / click 反馈完整

---

## Prompt K：做全项目收尾与优化

现在请对整个项目做收尾：

1. 清理重复样式与重复逻辑
2. 完善 loading / empty / error 态
3. 检查所有图表 resize
4. 检查所有 mock 数据 schema
5. 抽离共用 legend / tooltip / panel
6. 修复明显视觉不一致
7. 输出后续接真实数据的接口清单

---

## Prompt L：输出最终交付说明

请基于当前仓库，给我生成一份最终交付说明，内容包括：

1. 项目结构总览
2. 三大模块功能清单
3. 当前已完成内容
4. 使用的 mock 数据文件位置
5. 后续要向数据组索要的真实数据字段
6. 如何启动项目
7. 已知限制与待办事项

---

# 三十一、最后的执行原则（务必牢记）

- 先搭骨架，再做联动，再补图表，再打磨视觉
- 先让它“跑起来”，再让它“像设计稿”，最后再让它“更精致”
- 所有复杂图都要先做成**可复用组件**
- 所有数据都要先做成**可替换 schema**
- 所有回复都要让我看得懂你为什么这么做

现在开始：  
**先扫描当前仓库并给出第一阶段计划，不要直接铺天盖地生成所有代码。**
