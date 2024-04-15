export const restUrl = (ACCOUNT_ID: string) => `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run`
export const gatewayUrl = (ACCOUNT_ID: string, GATEWAY_SLUG: string) => `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_SLUG}/workers-ai`
