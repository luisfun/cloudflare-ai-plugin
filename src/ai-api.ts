import type { ApiOptions } from './ai'
import type {
  ConstructorParametersForModel as Inputs,
  ModelName,
  GetPostProcessedOutputsType as Outputs,
} from './ai-types'

export class AiApi {
  #fetch
  constructor(url: string | undefined, token: string | undefined) {
    if (!url || !token) throw new Error('There is no API URL or no Token')
    this.#fetch = async <M extends ModelName>(model: M, inputs: Inputs<M>, options?: ApiOptions) => {
      const headers: HeadersInit = {}
      if (options?.['cf-skip-cache']) headers['cf-skip-cache'] = options['cf-skip-cache'].toString()
      if (options?.['cf-cache-ttl']) headers['cf-cache-ttl'] = options['cf-cache-ttl'].toString()
      const response = await fetch(`${url}/${model}`, {
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

  async run<M extends ModelName>(model: M, inputs: Inputs<M>, options?: ApiOptions) {
    return (await this.#fetch(model, inputs, options)).outputs
  }
  get fetch() {
    return this.#fetch.bind(this)
  }
}
