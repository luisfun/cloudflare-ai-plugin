import type {
  ModelName,
  ConstructorParametersForModel as Inputs,
  GetPostProcessedOutputsType as Outputs,
} from './ai-types'
import type { GatewayOptions } from './ai'

export class Gateway {
  #fetch
  constructor(endpoint: string | undefined, token: string | undefined) {
    if (!endpoint || !token) throw new Error('There is no endpoint or no token')
    this.#fetch = async <M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) => {
      const headers: HeadersInit = {}
      if (options?.['cf-skip-cache']) headers['cf-skip-cache'] = options['cf-skip-cache'].toString()
      if (options?.['cf-cache-ttl']) headers['cf-cache-ttl'] = options['cf-cache-ttl'].toString()
      const response = await fetch(`${endpoint}/${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(inputs),
        signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
      })
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

  async run<M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) {
    return (await this.#fetch(model, inputs, options)).outputs
  }
  get fetch () {
    return this.#fetch.bind(this)
  }
}
