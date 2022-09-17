export function logRequest(req: Request, requestId: string) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const method = req.method
  const date = new Date()
  const timestamp = date.toISOString().replace('T', ' ').replace('Z', '')
  console.log(
    `%c${timestamp} | %c${requestId} | %c${method} %c${pathname}`,
    'color: #fb8500',
    'color: #219ebc',
    'font-weight: bold; color: #8ecae6',
    'color: #8ecae6'
  )
}
