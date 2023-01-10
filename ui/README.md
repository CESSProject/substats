# 基础项目

## 项目介绍

### 1、项目搭建

```
1、脚手架采用官方cli - create-react-app
2、状态管理工具为redux 的 react适配版 react-redux 和 @reduxjs/toolkit
3、异步工具为 redux-saga
4、数据传递和控制渲染采用 @reduxjs/toolkit 下的 reselect
5、路由采用 react-router-dom
6、样式采用 styled-components 和 less
7、开发调试日志采用 redux-logger
8、项目配置采用 craco
9、UI库采用 antd，图表 是 echarts
10、环境变量从 process.env.REACT_APP_ENVIRONMENT 中获取（development - 开发， test - 测试， production - 生产），
    主要是 react 的 NODE_ENV无法像vue一样被脚本覆盖

```

### 2、项目结构

```
├── react-admin       #  xxxx项目
├────  index.js       # 项目根组件
├────  App.js         # 项目包装根组件
├── package.json      # npm包管理所需模块及配置信息
├── env               # 开发环境配置（权限最高，勿动）
├── env.development   # 开发环境配置
├── env.production    # 生产环境配置
├── env.test          # 测试环境配置
├── src
│   ├── components/   # 公共组件目录
│   ├── configs/      # 全局配置目录
│   ├── i18n/         # 国际化（暂时没用上）
│   ├── layout/       # 布局文件目录
│   ├── models/       # 数据清洗目录
│   ├── utils/        # 工具类目录
│   ├── redux/        # 状态管理目录
│   ├── routers/      # 路由配置目录
│   ├── services/     # 请求服务目录
│   ├── statics/      # 静态资源目录
│   ├── tests/        # e2e测试目录
│   ├── mock/         # 模拟数据目录
│   ├── utils/        # 工具类目录
│   └── views/        # UI界面目录
├── .gitignore        # git忽略配置
├── .eslintignore     # eslint校验忽略配置
├── .eslintrc.js      # eslint自定义配置
├── .prettierrc.js    # prettierrc自定义配置
├── craco.config.js   # webpack配置
└── webstorm.config   # webstorm配置
```

## git 提交规范

```
# commitlint.config.js
{
  "feat", // 新功能 feature
  "fix", // 修复 bug
  "docs", // 文档注释
  "style", // 代码格式(不影响代码运行的变动)
  "refactor", // 重构(既不增加新功能，也不是修复bug)
  "perf", // 性能优化
  "test", // 增加测试
  "chore", // 构建过程或辅助工具的变动
  "revert", // 回退
  "build" // 打包
}

# 示例
git add .
git commit -m "fix: 修复BUG"
git push
```
