export function logRequest(req: Request) {
  const request = req.clone()
  console.log(request.method)
  console.log(request.headers.get('host'))
}
