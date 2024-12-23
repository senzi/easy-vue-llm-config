import yaml from 'js-yaml'

class LLMService {
  constructor() {
    this.config = null
    this.providerConfigs = null
    this.loadProviderConfigs()
  }

  async loadProviderConfigs() {
    try {
      const response = await fetch('/config/llm-providers.yaml')
      const yamlText = await response.text()
      this.providerConfigs = yaml.load(yamlText)
    } catch (error) {
      console.error('Error loading provider configs:', error)
    }
  }

  // 内部方法：获取供应商配置
  #getProviderConfig(service) {
    return this.providerConfigs?.providers?.[service]
  }

  // 由 LLMAppBar 组件调用的方法
  setConfig(config) {
    this.config = {
      service: config.service,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model
    }
    localStorage.setItem('llm-config', JSON.stringify(this.config))
  }

  // 获取基础配置
  getConfig() {
    if (!this.config) {
      const savedConfig = localStorage.getItem('llm-config')
      this.config = savedConfig ? JSON.parse(savedConfig) : null
    }
    return this.config
  }

  // 获取所有供应商列表
  getProviders() {
    return this.providerConfigs?.providers || {}
  }

  // 用户应用调用的方法
  async chat(message, options = {}) {
    const config = this.getConfig()
    if (!config || !config.apiKey) {
      throw new Error('LLM configuration not set')
    }

    const provider = this.#getProviderConfig(config.service)
    if (!provider) {
      throw new Error('Invalid LLM provider')
    }

    const defaultOptions = provider.global_default
    const requestOptions = {
      model: options.model || config.model,
      temperature: options.temperature ?? defaultOptions.temperature,
      max_tokens: options.max_tokens ?? defaultOptions.max_tokens,
      ...options  // 允许用户传入其他选项
    }

    return this.#makeRequest(message, requestOptions)
  }

  // 内部方法：发送请求
  async #makeRequest(message, options) {
    const config = this.getConfig()
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    }

    // 构建请求体，允许不同供应商有不同的请求格式
    let requestBody
    switch (config.service) {
      case 'anthropic':
        requestBody = {
          model: options.model,
          messages: [{ role: 'user', content: message }],
          max_tokens: options.max_tokens,
          temperature: options.temperature
        }
        break
      // 可以为其他供应商添加特殊处理
      default:
        requestBody = {
          model: options.model,
          messages: [{ role: 'user', content: message }],
          max_tokens: options.max_tokens,
          temperature: options.temperature
        }
    }

    try {
      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `API error (${response.status}): ${errorData.error?.message || '请检查配置和 API Key 是否正确'}`
        )
      }

      const data = await response.json()
      
      // 处理不同供应商的响应格式
      switch (config.service) {
        case 'anthropic':
          return data.content[0].text
        default:
          return data.choices[0].message.content
      }
    } catch (error) {
      console.error('Error calling LLM API:', error)
      throw error
    }
  }
}

export const llmService = new LLMService()
