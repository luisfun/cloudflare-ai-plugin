import type {
  ModelName,
  ConstructorParametersForModel as Inputs,
  GetPostProcessedOutputsType as Outputs,
} from './ai-types'
import type { GatewayOptions } from './ai'

type CacheHeaders = {
  'cf-skip-cache'?: boolean
  'cf-cache-ttl'?: number
}

export class Gateway {
  protected endpoint = ''
  protected token = ''
  constructor(endpoint: string | undefined, token: string | undefined) {
    if (!endpoint || !token) throw new Error('There is no endpoint or no token')
    this.endpoint = endpoint
    this.token = token
  }

  protected fetchRequest<M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) {
    const cacheHeaders: CacheHeaders = {}
    if (options?.['cf-skip-cache']) cacheHeaders['cf-skip-cache'] = options?.['cf-skip-cache']
    if (options?.['cf-cache-ttl']) cacheHeaders['cf-cache-ttl'] = options?.['cf-cache-ttl']
    return fetch(`${this.endpoint}/${model}`, {
      method: 'POST',
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...cacheHeaders,
      } as HeadersInit,
      body: JSON.stringify(inputs),
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    })
  }

  async run<M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) {
    const response = await this.fetchRequest(model, inputs, options)
    switch (response.headers.get('Content-Type')) {
      case 'text/event-stream':
        return response.body as Outputs<M>
      case 'image/png':
        return (await response.arrayBuffer()) as Outputs<M>
      default:
        return (await response.json()).result as Outputs<M>
    }
  }

  async fetch<M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) {
    const response = await this.fetchRequest(model, inputs, options)
    switch (response.headers.get('Content-Type')) {
      case 'text/event-stream':
        return { response, outputs: response.body as Outputs<M> }
      case 'image/png':
        return { response, outputs: (await response.arrayBuffer()) as Outputs<M> }
      default:
        return { response, outputs: (await response.json()).result as Outputs<M> }
    }
  }
}
