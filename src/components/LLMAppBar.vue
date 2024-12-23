<template>
  <div :class="['llm-config-bar', customClass]">
    <slot name="title">
      <h1 class="llm-config-title">{{ title }}</h1>
    </slot>
    
    <slot name="settings-trigger">
      <button @click="showSettings = true" class="llm-config-settings-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </slot>

    <!-- 设置弹窗 -->
    <div v-if="showSettings" :class="['llm-config-modal', modalClass]" @click="closeSettings">
      <div :class="['llm-config-content', contentClass]" @click.stop>
        <div class="llm-config-header">
          <h2>LLM API 设置</h2>
          <button class="llm-config-close" @click="closeSettings">×</button>
        </div>
        
        <form @submit.prevent="saveSettings" class="llm-config-form">
          <!-- LLM 服务选择 -->
          <div class="llm-config-form-group">
            <label>LLM 服务</label>
            <select v-model="config.service" class="llm-config-select" @change="handleServiceChange">
              <option v-for="(provider, name) in providers" :key="name" :value="name">
                {{ name.toUpperCase() }}
              </option>
            </select>
          </div>

          <!-- Base URL -->
          <div class="llm-config-form-group">
            <label>Base URL</label>
            <input 
              type="text" 
              v-model="config.baseUrl"
              class="llm-config-input"
              placeholder="请输入 Base URL"
            >
          </div>

          <!-- API Key -->
          <div class="llm-config-form-group">
            <label>API Key</label>
            <input 
              type="password" 
              v-model="config.apiKey"
              class="llm-config-input"
              placeholder="请输入 API Key"
            >
          </div>

          <!-- 模型选择 -->
          <div class="llm-config-form-group">
            <label>模型</label>
            <select v-model="config.model" class="llm-config-select">
              <option v-for="model in currentProviderModels" :key="model" :value="model">
                {{ model }}
              </option>
            </select>
          </div>

          <div class="llm-config-actions">
            <button type="submit" class="llm-config-save">保存设置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { llmService } from '../api/llm.js'

export default {
  name: 'LLMConfig',
  props: {
    customClass: String,
    modalClass: String,
    contentClass: String,
    title: {
      type: String,
      default: 'LLM 配置'
    }
  },
  data() {
    return {
      showSettings: false,
      config: {
        service: '',
        baseUrl: '',
        apiKey: '',
        model: ''
      },
      providers: {},
      currentProviderModels: []
    }
  },
  methods: {
    closeSettings() {
      this.showSettings = false
    },
    async handleServiceChange() {
      const provider = this.providers[this.config.service]
      if (provider) {
        this.config.baseUrl = provider.base_url
        this.currentProviderModels = provider.models
        this.config.model = provider.default_model
      }
    },
    async saveSettings() {
      llmService.setConfig(this.config)
      this.$emit('config-updated', { ...this.config })
      this.closeSettings()
    }
  },
  async created() {
    // 等待配置加载完成
    while (!llmService.providerConfigs) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    this.providers = llmService.providerConfigs.providers
    
    // 加载保存的配置
    const savedConfig = llmService.getConfig()
    if (savedConfig) {
      this.config = { ...savedConfig }
      await this.handleServiceChange()
    } else if (Object.keys(this.providers).length > 0) {
      // 设置默认值
      this.config.service = Object.keys(this.providers)[0]
      await this.handleServiceChange()
    }
  }
}
</script>

<style scoped>
.llm-config-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
  padding: 0.5rem;
}
</style>