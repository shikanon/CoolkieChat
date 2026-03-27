
&lt;div align="center"&gt;
  &lt;img src="/public/logo.jpg" alt="CoolkieChat Logo" width="100" style="border-radius: 20px;" /&gt;
  &lt;h1&gt;CoolkieChat&lt;/h1&gt;
  &lt;p&gt;嘘... 这是我们专属的小世界。&lt;/p&gt;
  &lt;p&gt;&lt;em&gt;In memory of Coolkie&lt;/em&gt;&lt;/p&gt;
&lt;/div&gt;

---

## 产品理念

CoolkieChat 是一款专为**不被周围人认可的亲密关系**设计的轻量化、高隐秘性双人即时通讯网页工具。

专为那些处于地下恋、隐秘陪伴关系等不被家人、朋友、同事认可的亲密关系中的人们，提供一个专属、隐秘、便捷的双人聊天渠道。

## 核心特性

- 🔐 **端到端加密**：暗号作为唯一密钥，加密所有通信
- 🔥 **阅后即焚**：所有消息仅存储在浏览器，刷新即逝
- 💾 **一键导出**：支持导出聊天记录为 JSON 文件，保留文字、媒体链接和时间戳，留作爱的纪念
- 💬 **引用回复**：支持引用消息进行回复，清晰的视觉区分
- 🖼️ **图片/视频支持**：支持发送图片（包括 HEIC 格式自动转换）和视频
- 🎨 **柔和配色**：浅蓝色 + 粉色的温暖配色，温柔治愈
- 📱 **移动端友好**：完美适配手机端使用体验

## 技术栈

- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **后端**：Express + Socket.io + TypeScript
- **实时通信**：Socket.io
- **文件上传**：Multer
- **HEIC 转换**：heic2any

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

前端将在 `http://localhost:5410` 启动，后端 API 服务在 `http://localhost:5411` 启动。

### 生产环境

```bash
npm run build
npm start
```

服务将在 `http://localhost:5410` 启动（包含前端静态资源和后端 API）。

## 使用说明

1. 输入你的称呼和对方的称呼
2. 设置一个 2-20 位的专属暗号（需与对方保持完全一致）
3. 点击"建立连接"进入聊天室
4. 开始你们的私密聊天

## 项目结构

```
CoolkieChat/
├── api/              # 后端服务
│   ├── routes/       # API 路由
│   ├── storage/      # 存储相关
│   ├── app.ts        # Express 应用
│   └── server.ts     # 服务器入口
├── src/              # 前端源码
│   ├── components/   # React 组件
│   ├── hooks/        # 自定义 Hooks
│   ├── pages/        # 页面组件
│   └── utils/        # 工具函数
└── public/           # 静态资源
```

## 不被定义，不留痕迹。专为温柔的秘密而生。

CoolkieChat © 2026
