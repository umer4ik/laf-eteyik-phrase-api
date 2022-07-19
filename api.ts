import { serve } from "https://deno.land/std@0.148.0/http/server.ts";
import { getData } from './files.ts'
import { createResponse } from './response.ts'
import { logRequest } from './logger.ts'

const { categories, phrases } = await getData()

serve((req) => {
  logRequest(req)
  try {
    const url = new URL(req.url)
    const route = url.pathname.substring('/api/v0'.length)
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
  } catch (error) {
    console.error(error)
    return createResponse({ body: { error: 'something went really wrong' }, status: 500 })
  }
}, { port: 3001 });
