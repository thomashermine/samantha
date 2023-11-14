export let openai = null;

/**
 * Sets the OpenAI client in the memory.
 * @param {Object} client - The OpenAI client.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setClient(client: any): void {
  openai = client;
}
