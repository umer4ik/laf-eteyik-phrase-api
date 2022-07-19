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
  if (type === 'json') {
    h.append('Content-Type', 'applications/json; charset=utf-8')
  }
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: h
    }
  )
}
