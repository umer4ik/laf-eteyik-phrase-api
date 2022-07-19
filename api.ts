import { serve } from "https://deno.land/std@0.148.0/http/server.ts";
import { getData } from './files.ts'
import { createResponse } from './response.ts'

const { categories, phrases } = await getData()

serve((req) => {
  const url = new URL(req.url)
  const route = url.pathname.substring('/api/v0'.length)
  switch (route) {
    case '/health': {
      return createResponse({ body: { health: 'healthy' } })
    }
    case '/health/text': {
      return createResponse({ body: JSON.stringify({ health: 'healthy' }), type: 'text' })
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
