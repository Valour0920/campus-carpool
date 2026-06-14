# CampusPool 校园拼车平台

面向高校学生的拼车信息撮合网站。纯前端实现，无需服务器，部署到 GitHub Pages 即可使用。

## 快速部署

1. 上传到 GitHub 仓库
2. Settings → Pages → Source 选 **Deploy from a branch** → 选 `main` 分支 → 保存
3. 几分钟后访问 `https://你的用户名.github.io/campus-carpool/`

## 演示账号

| 用户名 | 密码 | 学校 | 认证 |
|--------|------|------|------|
| xiaoming | 123456 | 清华大学 | 已认证 |
| xiaohong | 123456 | 北京大学 | 已认证 |
| david | 123456 | 浙江大学 | 已认证 |

## 项目结构

```
├── index.html          # 首页
├── login.html          # 登录/注册（学校+学号+姓名认证）
├── square.html         # 拼车广场（筛选+分页）
├── publish.html        # 发布行程（需登录）
├── detail.html         # 行程详情（留言+加入）
├── profile.html        # 个人中心
├── safety.html         # 安全提示
├── css/style.css       # 样式（浅蓝+白，极简，响应式）
├── js/store.js         # 数据层（localStorage + 演示数据）
└── js/main.js          # 公共模块（认证、导航、工具）
```

## 技术说明

- 零依赖，无需 npm install
- 数据存储在浏览器 localStorage 中
- 内置 5 条演示行程 + 8 条安全提示
- 注册的用户和发布的行程仅在当前浏览器保存
