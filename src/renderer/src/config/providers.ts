import AzureProviderLogo from '@renderer/assets/images/models/microsoft.png'
import AnthropicProviderLogo from '@renderer/assets/images/providers/anthropic.png'
import DeepSeekProviderLogo from '@renderer/assets/images/providers/deepseek.png'
import GithubProviderLogo from '@renderer/assets/images/providers/github.png'
import GoogleProviderLogo from '@renderer/assets/images/providers/google.png'
import GrokProviderLogo from '@renderer/assets/images/providers/grok.png'
import GroqProviderLogo from '@renderer/assets/images/providers/groq.png'
import LMStudioProviderLogo from '@renderer/assets/images/providers/lmstudio.png'
import OllamaProviderLogo from '@renderer/assets/images/providers/ollama.png'
import OpenAiProviderLogo from '@renderer/assets/images/providers/openai.png'
import OpenRouterProviderLogo from '@renderer/assets/images/providers/openrouter.png'
import SiliconFlowProviderLogo from '@renderer/assets/images/providers/silicon.png'
import VertexAIProviderLogo from '@renderer/assets/images/providers/vertexai.svg'
import ZhipuProviderLogo from '@renderer/assets/images/providers/zhipu.png'

import { TOKENFLUX_HOST } from './constant'

const PROVIDER_LOGO_MAP = {
  openai: OpenAiProviderLogo,
  silicon: SiliconFlowProviderLogo,
  deepseek: DeepSeekProviderLogo,
  groq: GroqProviderLogo,
  zhipu: ZhipuProviderLogo,
  ollama: OllamaProviderLogo,
  lmstudio: LMStudioProviderLogo,
  openrouter: OpenRouterProviderLogo,
  anthropic: AnthropicProviderLogo,
  gemini: GoogleProviderLogo,
  github: GithubProviderLogo,
  copilot: GithubProviderLogo,
  'azure-openai': AzureProviderLogo,
  grok: GrokProviderLogo,
  vertexai: VertexAIProviderLogo
} as const

export function getProviderLogo(providerId: string) {
  return PROVIDER_LOGO_MAP[providerId as keyof typeof PROVIDER_LOGO_MAP]
}

// export const SUPPORTED_REANK_PROVIDERS = ['silicon', 'jina', 'voyageai', 'dashscope', 'aihubmix']
export const NOT_SUPPORTED_REANK_PROVIDERS = ['ollama']
export const ONLY_SUPPORTED_DIMENSION_PROVIDERS = ['ollama', 'infini']

export const PROVIDER_CONFIG = {
  openai: {
    api: {
      url: 'https://api.openai.com'
    },
    websites: {
      official: 'https://openai.com/',
      apiKey: 'https://platform.openai.com/api-keys',
      docs: 'https://platform.openai.com/docs',
      models: 'https://platform.openai.com/docs/models'
    }
  },
  gemini: {
    api: {
      url: 'https://generativelanguage.googleapis.com'
    },
    websites: {
      official: 'https://gemini.google.com/',
      apiKey: 'https://aistudio.google.com/app/apikey',
      docs: 'https://ai.google.dev/gemini-api/docs',
      models: 'https://ai.google.dev/gemini-api/docs/models/gemini'
    }
  },
  silicon: {
    api: {
      url: 'https://api.siliconflow.cn'
    },
    websites: {
      official: 'https://www.siliconflow.cn',
      apiKey: 'https://cloud.siliconflow.cn/i/d1nTBKXU',
      docs: 'https://docs.siliconflow.cn/',
      models: 'https://cloud.siliconflow.cn/models'
    }
  },
  deepseek: {
    api: {
      url: 'https://api.deepseek.com'
    },
    websites: {
      official: 'https://deepseek.com/',
      apiKey: 'https://platform.deepseek.com/api_keys',
      docs: 'https://platform.deepseek.com/api-docs/',
      models: 'https://platform.deepseek.com/api-docs/'
    }
  },
  github: {
    api: {
      url: 'https://models.inference.ai.azure.com/'
    },
    websites: {
      official: 'https://github.com/marketplace/models',
      apiKey: 'https://github.com/settings/tokens',
      docs: 'https://docs.github.com/en/github-models',
      models: 'https://github.com/marketplace/models'
    }
  },
  copilot: {
    api: {
      url: 'https://api.githubcopilot.com/'
    }
  },
  zhipu: {
    api: {
      url: 'https://open.bigmodel.cn/api/paas/v4/'
    },
    websites: {
      official: 'https://open.bigmodel.cn/',
      apiKey: 'https://open.bigmodel.cn/usercenter/apikeys',
      docs: 'https://open.bigmodel.cn/dev/howuse/introduction',
      models: 'https://open.bigmodel.cn/modelcenter/square'
    }
  },
  openrouter: {
    api: {
      url: 'https://openrouter.ai/api/v1/'
    },
    websites: {
      official: 'https://openrouter.ai/',
      apiKey: 'https://openrouter.ai/settings/keys',
      docs: 'https://openrouter.ai/docs/quick-start',
      models: 'https://openrouter.ai/models'
    }
  },
  groq: {
    api: {
      url: 'https://api.groq.com/openai'
    },
    websites: {
      official: 'https://groq.com/',
      apiKey: 'https://console.groq.com/keys',
      docs: 'https://console.groq.com/docs/quickstart',
      models: 'https://console.groq.com/docs/models'
    }
  },
  ollama: {
    api: {
      url: 'http://localhost:11434'
    },
    websites: {
      official: 'https://ollama.com/',
      docs: 'https://github.com/ollama/ollama/tree/main/docs',
      models: 'https://ollama.com/library'
    }
  },
  lmstudio: {
    api: {
      url: 'http://localhost:1234'
    },
    websites: {
      official: 'https://lmstudio.ai/',
      docs: 'https://lmstudio.ai/docs',
      models: 'https://lmstudio.ai/models'
    }
  },
  anthropic: {
    api: {
      url: 'https://api.anthropic.com/'
    },
    websites: {
      official: 'https://anthropic.com/',
      apiKey: 'https://console.anthropic.com/settings/keys',
      docs: 'https://docs.anthropic.com/en/docs',
      models: 'https://docs.anthropic.com/en/docs/about-claude/models'
    }
  },
  grok: {
    api: {
      url: 'https://api.x.ai'
    },
    websites: {
      official: 'https://x.ai/',
      docs: 'https://docs.x.ai/',
      models: 'https://docs.x.ai/docs/models'
    }
  },
  'azure-openai': {
    api: {
      url: ''
    },
    websites: {
      official: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
      apiKey: 'https://portal.azure.com/#view/Microsoft_Azure_ProjectOxford/CognitiveServicesHub/~/OpenAI',
      docs: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
      models: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models'
    }
  },
  vertexai: {
    api: {
      url: 'https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/overview'
    },
    websites: {
      official: 'https://cloud.google.com/vertex-ai',
      apiKey: 'https://console.cloud.google.com/apis/credentials',
      docs: 'https://cloud.google.com/vertex-ai/generative-ai/docs',
      models: 'https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models'
    }
  }
}
