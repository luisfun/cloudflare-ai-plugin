# Cloudflare AI Plugin [![npm v](https://img.shields.io/npm/v/@luisfun/cloudflare-ai-plugin)](https://www.npmjs.com/package/@luisfun/cloudflare-ai-plugin) [![Bundle Size](https://img.shields.io/bundlephobia/min/@luisfun/cloudflare-ai-plugin)](https://bundlephobia.com/package/@luisfun/cloudflare-ai-plugin)

- **AI Gateway** - You can code the AI Gateway in the same way as the workers AI.
- **MD Translator** - You can translate while maintaining the structure of Markdown to some extent.

## Install

```shell
npm i @luisfun/cloudflare-ai-plugin
npm i -D @cloudflare/ai # When using TypeScript
```

## How to Use

```ts
import { Ai } from '@luisfun/cloudflare-ai-plugin'

// const ai = env.AI
const ai = new Ai(env.AI)
```

When using AI Gateway

```ts
// const ai = env.AI
const ai = new Ai(env.Endpoint, env.Token)
```

## Extension

Gateway Options  
Docs: [cf-cache](https://developers.cloudflare.com/ai-gateway/configuration/caching/)

```ts
const options = {
  'cf-skip-cache': true,
  'cf-cache-ttl': 60,
  timeout: 30000, // fetch timeout (millisecond)
}
const response = await ai.run(model, { prompt }, options)
```

Markdown Translator  
⚠️ AI translation requests will increase.

```ts
// const { translated_text } = await ai.run('@cf/meta/m2m100-1.2b', { text, source_lang, target_lang })
const { translated_text } = await ai.mdt('@cf/meta/m2m100-1.2b', { text, source_lang, target_lang })
```

## Examples

- [Discord Bot](https://github.com/LuisFun/discord-bot-cloudflare-ai-challenge)

## References

The following repositories were referenced in the making of this project:

- [@cloudflare/ai](https://www.npmjs.com/package/@cloudflare/ai)
