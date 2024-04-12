import type { ModelMappings, ModelName, ConstructorParametersForModel as Inputs } from './ai-types'
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
  constructor(arg0: Cfai | string | undefined, arg1?: string | undefined) {
    if (arg0 === undefined) throw new Error('There is no env.AI or no endpoint')
    if (typeof arg0 !== 'string') this.ai = arg0
    else this.ai = new Gateway(arg0, arg1)
  }

  /**
   * Markdown Translator
   * ⚠️ AI translation requests will increase.
   */
  mdt(model: TranslationModelName, inputs: TranslationInputs, options?: GatewayOptions) {
    const { source_lang, target_lang } = inputs
    const trans = async (text: string) =>
      (await this.run(model, { text, source_lang, target_lang }, options)).translated_text
    return mdTranslator(trans, inputs.text)
  }

  run<M extends ModelName>(model: M, inputs: Inputs<M>, options?: GatewayOptions) {
    if (this.ai instanceof Gateway) return this.ai.run(model, inputs, options)
    // @ts-expect-error
    else return this.ai.run(model, inputs)
  }
}
