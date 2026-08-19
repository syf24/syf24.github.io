# 宋依凡 AI 应用开发作品集

这是一个静态个人介绍与项目展示页面，可直接部署到 GitHub Pages、Vercel 或 Netlify。

本地预览：

```bash
python3 -m http.server 4173
```

访问：

```text
http://127.0.0.1:4173/
```

## 项目 Demo 跳转

页面里的项目按钮支持跳转到正在运行的 Demo。默认本地入口在 `app.js` 的
`LOCAL_DEMO_URLS` 中：

```js
rag: "http://localhost:7860/",
agent: "http://127.0.0.1:8765/todos"
```

如果部署到 GitHub Pages 后希望别人也能打开项目运行页，需要先把对应 Demo
部署到公网地址，然后把地址填到 `app.js` 的 `PUBLIC_DEMO_URLS`：

```js
const PUBLIC_DEMO_URLS = {
  rag: "https://your-rag-demo.example.com/",
  agent: "https://your-agent-demo.example.com/"
};
```
