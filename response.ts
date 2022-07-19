type CreateResponseProps = {
  // deno-lint-ignore no-explicit-any
  body: any,
  status?: number,
  headers?: HeadersInit,
  type?: 'json' | 'text'
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
    h.append('Content-Type', 'applications/json;charset=utf-8')
  } else if (type === 'text') {
    h.append('Content-Type', 'text/plain;charset=utf-8')
  }
  return new Response(
    type === 'json' ? JSON.stringify(body) : body,
    {
      status,
      headers: h
    }
  )
}
