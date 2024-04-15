# Cloudflare AI Plugin [![npm v](https://img.shields.io/npm/v/@luisfun/cloudflare-ai-plugin)](https://www.npmjs.com/package/@luisfun/cloudflare-ai-plugin) [![Bundle Size](https://img.shields.io/bundlephobia/min/@luisfun/cloudflare-ai-plugin)](https://bundlephobia.com/package/@luisfun/cloudflare-ai-plugin)

- **REST API or AI Gateway** - You can code the same way as the binding AI.
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
// const ai = new Ai(env.AI) // When extending binding AI
const ai = new Ai(env.AI_API_URL, env.AI_API_TOKEN)
```

Then, `ai.run` will work as with binding AI.

## Extension

API Options  
[Gateway: cf-cache](https://developers.cloudflare.com/ai-gateway/configuration/caching/)

```ts
const options = {
  'cf-skip-cache': true, // Gateway
  'cf-cache-ttl': 60, // Gateway
  timeout: 30000, // fetch timeout (millisecond)
}
const response = await ai.run(model, inputs, options)
```

MD Translator  
⚠️ AI translation requests will increase.

```ts
// const { translated_text } = await ai.run('@cf/meta/m2m100-1.2b', inputs)
const { translated_text } = await ai.mdt('@cf/meta/m2m100-1.2b', inputs)
```

fetch Response Object

```ts
// response is Response Object
// outputs is the same `await ai.run()` outputs
const { response, outputs } = await ai.fetch(model, inputs)
```

## Builder

URL Builder

```ts
import { Ai, restUrl, gatewayUrl } from '@luisfun/cloudflare-ai-plugin'

const restAi = new Ai(restUrl(env.ACCOUNT_ID), env.AI_API_TOKEN)
const gatewayAi = new Ai(gatewayUrl(env.ACCOUNT_ID, env.GATEWAY_SLUG), env.AI_API_TOKEN)
```

## Examples

- [Discord Bot](https://github.com/LuisFun/discord-bot-cloudflare-ai-challenge)

## References

The following repositories were referenced in the making of this project:

- [@cloudflare/ai](https://www.npmjs.com/package/@cloudflare/ai)
