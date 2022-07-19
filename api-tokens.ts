let tokens: string[] | null = null
export async function getTokens() {
  if (tokens) return tokens
  try {
    const content = await  Deno.readTextFile('api-tokens')
    tokens = content.split('\n').filter(x => !!x)
  } catch (error) {
    console.log('api-tokens file is missing')
    console.log(error)
  }
}

export async function checkToken(token: string) {
  if (!token) return false
  await getTokens()
  return !!(tokens && ~tokens.indexOf(token))
}