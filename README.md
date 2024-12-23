# easy-vue-llm-config

一个简单易用的 Vue 3 LLM API 配置组件，支持多个 LLM 供应商（如 OpenAI、Anthropic、Gemini 等）的配置管理。

## 特性

- 🚀 开箱即用的 LLM API 配置界面
- 🔧 支持多个 LLM 供应商
- 💾 配置自动持久化
- 🎨 美观的 UI 界面
- 📱 响应式设计
- 🛠 灵活的参数控制

## 安装

1. 克隆仓库：

```bash
git clone https://github.com/senzi/easy-vue-llm-config.git
```

2. 安装依赖：

```bash
cd easy-vue-llm-config
npm install
```

## 快速开始

1. 创建必需的配置文件：

```yaml
# config/llm-providers.yaml
providers:
  openai:
    name: OpenAI
    base_url: https://api.openai.com/v1
    models:
      - gpt-3.5-turbo
      - gpt-4
    default_model: gpt-3.5-turbo
  anthropic:
    name: Anthropic
    base_url: https://api.anthropic.com/v1
    models:
      - claude-2
      - claude-instant-1
    default_model: claude-2
```

2. 在 `vite.config.js` 中添加 YAML 支持：

```javascript
export default defineConfig({
  assetsInclude: ['**/*.yaml']
})
```

3. 在组件中使用：

```vue
<template>
  <div class="app">
    <llm-config
      @config-update="handleConfigUpdate"
    />
  </div>
</template>

<script>
import LLMConfig from './components/LLMAppBar.vue'
import { llmService } from './api/llm.js'

export default {
  components: {
    'llm-config': LLMConfig
  },
  methods: {
    handleConfigUpdate(config) {
      console.log('LLM配置已更新:', config)
    }
  }
}
</script>
```

## API 调用示例

```javascript
import { llmService } from './api/llm.js'

// 发送聊天消息
const response = await llmService.chat('你好！', {
  temperature: 0.7,    // 可选：温度
  max_tokens: 2000     // 可选：最大令牌数
})
```

## 配置选项

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 配置栏标题 | string | 'LLM 配置' |
| customClass | 自定义类名 | string | - |
| modalClass | 模态框自定义类名 | string | - |
| contentClass | 内容区自定义类名 | string | - |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| config-update | 配置更新时触发 | (config: LLMConfig) |

## 注意事项

- API Key 会保存在浏览器的 localStorage 中
- 建议在生产环境中使用代理服务器中转 API 请求
- 根据需要调整温度和最大令牌数等参数

## 开发

```bash
# 开发环境运行
npm run dev

# 构建
npm run build
```

## 许可证

MIT
