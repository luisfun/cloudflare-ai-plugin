export const restUrl = (ACCOUNT_ID: string | undefined) =>
  ACCOUNT_ID ? `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run` : undefined
export const gatewayUrl = (ACCOUNT_ID: string | undefined, GATEWAY_SLUG: string | undefined) =>
  ACCOUNT_ID && GATEWAY_SLUG
    ? `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_SLUG}/workers-ai`
    : undefined
