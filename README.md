## README

FlashMind（闪卡记忆）

### 技术栈

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Zustand
- React Router
- Framer Motion

### 本地开发

```bash
pnpm install
pnpm dev
```

### 当前版本边界

- 单用户本地应用，不包含账号体系与云同步。
- 数据仅保存在当前浏览器，不同设备之间不自动同步。
- 暂未包含间隔重复算法（如 SM-2）与学习提醒系统。

### 后续规划（Roadmap）

- 学习策略升级：引入基于遗忘曲线的复习调度。
- 数据能力增强：导入/导出、备份与恢复。
- 多端协同：账号体系与跨设备同步。
- 学习分析：按天/周统计学习时长与掌握趋势。
