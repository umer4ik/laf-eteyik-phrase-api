export function logRequest(req: Request, requestId: string) {
  const request = req.clone()
  const url = request.url
  const method = request.method
  console.log(`${requestId} | ${method} ${url}`)
}

// [GET: /api/v0/health]