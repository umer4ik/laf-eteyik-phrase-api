import { serve } from "https://deno.land/std@0.148.0/http/server.ts";
import { getData } from './files.ts'
import { createResponse } from './response.ts'
import { checkToken } from './api-tokens.ts'

const { categories, phrases } = await getData()

serve(async (req) => {
  const token = req.headers.get('api-token')
  const url = new URL(req.url)
  const route = url.pathname.substring('/api/v0'.length)
  if (!token || (!await checkToken(token) && route !== '/health')) {
    return createResponse({
      body: { error: 'bad token' },
      status: 401
    })
  }
  switch (route) {
    case '/health': {
      return createResponse({ body: { health: 'healthy' } })
    }
    case '/categories': {
      return createResponse({ body: { categories } })
    }
    case '/phrases': {
      return createResponse({ body: { phrases } })
    }
    default:
      return createResponse({ body: { error: 'not found' }, status: 404 })
  }
}, { port: 3001 });
