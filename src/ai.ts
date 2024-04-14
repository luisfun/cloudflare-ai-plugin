import type { ModelMappings } from './ai-types'
import type { Ai as Cfai } from '@cloudflare/ai'
import { Gateway } from './gateway'
import { mdTranslator } from './md-translator'

export type GatewayOptions = {
  'cf-skip-cache'?: boolean
  'cf-cache-ttl'?: number
  timeout?: number
}

type TranslationModelName = ModelMappings['translation']['models'][number]
type TranslationInputs = ModelMappings['translation']['class']['prototype']['inputs']

export class Ai {
  protected ai: Cfai | Gateway
  constructor(arg: Cfai | string | undefined, token?: string | undefined) {
    if (arg === undefined) throw new Error('There is no env.AI or no endpoint')
    if (typeof arg !== 'string') this.ai = arg
    else this.ai = new Gateway(arg, token)
  }

  async mdt(model: TranslationModelName, inputs: TranslationInputs, options?: GatewayOptions) {
    const { source_lang, target_lang } = inputs
    const trans = async (text: string) =>
      (await this.run(model, { text, source_lang, target_lang }, options)).translated_text
    return { translated_text: await mdTranslator(trans, inputs.text) }
  }

  get run () {
    return this.ai.run.bind(this.ai)
  }
  get fetch() {
    if (!(this.ai instanceof Gateway)) throw new Error("This is not Gateway")
    return this.ai.fetch.bind(this.ai)
  }
}
