type CreateResponseProps = {
  // deno-lint-ignore no-explicit-any
  body: any,
  status?: number,
  headers?: HeadersInit,
  type?: 'json'
}

export const createResponse = ({
  body,
  status = 200,
  headers,
  type = 'json'
}: CreateResponseProps) => {
  const h = new Headers(headers)
  h.append('Access-Control-Allow-Origin', '*')
  h.append('Access-Control-Allow-Methods', 'GET')
  if (type === 'json') {
    h.append('Content-Type', 'application/json;charset=utf-8')
  }
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: h
    }
  )
}
