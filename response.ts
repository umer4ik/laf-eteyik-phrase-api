import { UnknownRecord } from './types.ts'
type CreateResponseProps = {
  result: UnknownRecord | UnknownRecord[],
  requestId: string,
  status?: number,
  headers?: HeadersInit,
  type?: 'json'
}

export const createResponse = ({
  result,
  status = 200,
  headers,
  requestId,
  type = 'json'
}: CreateResponseProps) => {
  const h = new Headers(headers)
  h.append('Access-Control-Allow-Origin', '*')
  h.append('Access-Control-Allow-Methods', 'GET')
  if (type === 'json') {
    h.append('Content-Type', 'application/json;charset=utf-8')
  }
  h.append('X-Request-Id', requestId)
  return new Response(
    JSON.stringify({
      result,
      status
    }),
    {
      status,
      headers: h
    }
  )
}
