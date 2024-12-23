<template>
  <div class="app">
    <div class="demo-container">
      <h1>LLM Config 组件演示</h1>
      <p>一个简单的 LLM 配置组件，帮助你管理 LLM API 设置</p>
      
      <div class="browser-mock">
        <div class="browser-header">
          <div class="browser-controls">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="browser-address-bar">https://your-app.com</div>
        </div>
        <div class="browser-content">
          <llm-config
            title="LLM Demo 应用"
            @config-updated="handleConfigUpdate"
          />
          
          <!-- 简单的聊天演示 -->
          <div class="chat-demo" v-if="hasConfig">
            <div class="chat-options">
              <div class="option-group">
                <label>Temperature:</label>
                <input 
                  type="range" 
                  v-model.number="chatOptions.temperature" 
                  min="0" 
                  max="2" 
                  step="0.1"
                >
                <span>{{ chatOptions.temperature }}</span>
              </div>
              <div class="option-group">
                <label>Max Tokens:</label>
                <input 
                  type="number" 
                  v-model.number="chatOptions.max_tokens" 
                  min="100" 
                  max="4000"
                >
              </div>
            </div>
            <div class="chat-messages">
              <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
                {{ msg.content }}
              </div>
            </div>
            <div class="chat-input">
              <input 
                v-model="userInput" 
                @keyup.enter="sendMessage"
                placeholder="输入消息，按回车发送"
                :disabled="isLoading"
              >
              <button @click="sendMessage" :disabled="isLoading || !userInput">
                {{ isLoading ? '发送中...' : '发送' }}
              </button>
            </div>
          </div>
          <div class="no-config" v-else>
            <p>请先点击右上角的设置图标配置 LLM API</p>
          </div>
          <div v-else class="no-config-message">
            请先配置 LLM 服务
          </div>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="usage-guide">
      <h2>使用指南</h2>
      
      <h3>1. 必需文件</h3>
      <pre>src/
  ├── components/
  │   └── LLMAppBar.vue      # LLM配置组件
  ├── config/
  │   └── llm-providers.yaml # LLM供应商配置
  ├── api/
  │   └── llm.js            # LLM服务封装
  └── default-theme.css     # 基础样式</pre>

      <h3>2. 安装依赖</h3>
      <pre>npm install js-yaml    # YAML解析</pre>

      <h3>3. Vite配置</h3>
      <pre>// vite.config.js
export default defineConfig({
  // ...其他配置
  assetsInclude: ['**/*.yaml']  // 添加YAML支持
})</pre>

      <h3>4. 组件使用示例</h3>
      <pre>// App.vue
import LLMConfig from './components/LLMAppBar.vue'
import { llmService } from './api/llm.js'

export default {
  components: {
    'llm-config': LLMConfig
  },
  data() {
    return {
      messages: []
    }
  },
  methods: {
    // 配置更新回调
    handleConfigUpdate(config) {
      console.log('LLM配置已更新:', config)
      // config 包含：
      // - service: 选择的服务商
      // - baseUrl: API地址
      // - apiKey: API密钥
      // - model: 选择的模型
    },
    // 发送消息示例
    async sendMessage(message) {
      try {
        // 使用配置好的服务发送消息
        // 可以传入额外的参数来覆盖默认值
        const response = await llmService.chat(message, {
          // temperature 和 max_tokens 是可选的
          // 如果不传，将使用 llm-providers.yaml 中的默认值
          temperature: 0.7,
          max_tokens: 2000
        })
        this.messages.push({
          role: 'assistant',
          content: response
        })
      } catch (error) {
        console.error('错误:', error)
      }
    }
  }
}</pre>

      <h3>5. 模板示例</h3>
      <pre>&lt;template&gt;
  &lt;div class="app"&gt;
    &lt;llm-config
      @config-update="handleConfigUpdate"
    /&gt;
    
    &lt;!-- 聊天界面示例 --&gt;
    &lt;div class="chat-demo"&gt;
      &lt;input v-model="message" @keyup.enter="sendMessage" /&gt;
      &lt;button @click="sendMessage"&gt;发送&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;</pre>

      <h3>6. 主要功能</h3>
      <ul>
        <li>支持多个LLM供应商配置（OpenAI、Anthropic、Gemini等）</li>
        <li>配置持久化（localStorage）</li>
        <li>灵活的API参数控制（温度、最大令牌数等）</li>
        <li>统一的错误处理</li>
      </ul>
    </div>
    
    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-links">
          <a href="https://github.com/senzi/easy-vue-llm-config" target="_blank" rel="noopener noreferrer">
            <svg height="16" width="16" viewBox="0 0 16 16" style="vertical-align: middle;">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span style="margin-left: 4px;">GitHub</span>
          </a>
          <span class="footer-separator">|</span>
          <span>Made with ❤️ by Senzi</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import LLMConfig from './components/LLMAppBar.vue'
import { llmService } from './api/llm.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import bash from 'highlight.js/lib/languages/bash'

// 注册需要的语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('bash', bash)

export default {
  name: 'App',
  components: {
    'llm-config': LLMConfig
  },
  data() {
    return {
      userInput: '',
      messages: [],
      isLoading: false,
      hasConfig: false,
      chatOptions: {
        temperature: 0.7,
        max_tokens: 2000
      }
    }
  },
  methods: {
    handleConfigUpdate(config) {
      console.log('LLM配置已更新:', config)
      this.hasConfig = true
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return
      
      const userMessage = this.userInput.trim()
      this.messages.push({ role: 'user', content: userMessage })
      this.userInput = ''
      this.isLoading = true

      try {
        const response = await llmService.chat(userMessage, this.chatOptions)
        this.messages.push({ role: 'assistant', content: response })
      } catch (error) {
        console.error('Error:', error)
        this.messages.push({ 
          role: 'error', 
          content: '发生错误：' + (error.message || '未知错误') 
        })
      } finally {
        this.isLoading = false
      }
    },
    highlightCode() {
      this.$nextTick(() => {
        document.querySelectorAll('.usage-guide pre').forEach(block => {
          // 根据内容判断语言
          let language = 'plaintext'
          const code = block.textContent
          
          if (code.includes('export default defineConfig')) {
            language = 'javascript'
          } else if (code.includes('<template>')) {
            language = 'xml'
          } else if (code.includes('npm install')) {
            language = 'bash'
          } else if (code.includes('src/')) {
            language = 'yaml'
          } else if (code.includes('import') || code.includes('export default {')) {
            language = 'javascript'
          }
          
          // 创建新的 code 元素
          const codeElement = document.createElement('code')
          codeElement.className = `hljs language-${language}`
          codeElement.textContent = code
          
          // 高亮
          hljs.highlightElement(codeElement)
          
          // 替换原有内容
          block.innerHTML = ''
          block.appendChild(codeElement)
        })
      })
    }
  },
  mounted() {
    // 检查是否已有配置
    this.hasConfig = !!llmService.getConfig()
    // 初始化代码高亮
    this.highlightCode()
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
}

.demo-container {
  max-width: 1000px;
  margin: 0 auto;
}

.demo-container h1 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.demo-container p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.browser-mock {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.browser-header {
  background: #f3f4f6;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.browser-controls {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.browser-controls span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e5e7eb;
}

.browser-controls span:nth-child(1) { background: #ef4444; }
.browser-controls span:nth-child(2) { background: #f59e0b; }
.browser-controls span:nth-child(3) { background: #10b981; }

.browser-address-bar {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #6b7280;
}

.browser-content {
  min-height: 500px;
}

.chat-demo {
  padding: 1rem;
  max-width: 600px;
  margin: 2rem auto;
}

.chat-options {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.option-group label {
  min-width: 100px;
  font-weight: 500;
}

.option-group input[type="range"] {
  flex: 1;
}

.option-group input[type="number"] {
  width: 100px;
  padding: 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.chat-messages {
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
}

.message.user {
  background: #e5e7eb;
  margin-left: 2rem;
}

.message.assistant {
  background: #dbeafe;
  margin-right: 2rem;
}

.message.error {
  background: #fee2e2;
  color: #dc2626;
  margin: 0 2rem;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.chat-input button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.no-config {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.no-config-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.usage-guide {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.usage-guide pre {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
}

.usage-guide pre code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  line-height: 1.5;
}

.usage-guide pre::-webkit-scrollbar {
  height: 8px;
}

.usage-guide pre::-webkit-scrollbar-thumb {
  background: #454d5d;
  border-radius: 4px;
}

.usage-guide pre::-webkit-scrollbar-track {
  background: #282c34;
  border-radius: 4px;
}

.usage-guide h2 {
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.usage-guide h3 {
  color: #42b983;
  margin-top: 1.5rem;
}

.usage-guide ul {
  padding-left: 1.5rem;
}

.usage-guide li {
  margin: 0.5rem 0;
  color: #666;
}

/* 页脚样式 */
.app-footer {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-gray);
  border-top: 1px solid var(--border-color);
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-color);
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
}

.footer-content a {
  color: var(--text-color);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.footer-content a:hover {
  color: var(--primary-color);
}

.footer-separator {
  color: var(--border-color);
  margin: 0 4px;
}
</style>