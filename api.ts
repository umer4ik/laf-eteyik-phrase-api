import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import { createResponse } from './response.ts'
import { logRequest } from './logger.ts'
import { controller } from './controller.ts'
const API_PREFIX = '/api/v0'

const categoryPattern = new URLPattern({ pathname: `${API_PREFIX}/category/:alias` })
const phrasesPattern = new URLPattern({ pathname: `${API_PREFIX}/phrase/:alias` })


serve(async (req) => {
  const requestId = crypto.randomUUID()
  logRequest(req, requestId)
  const wrap = (result: Record<string, unknown>, status?: number) => createResponse({ result, requestId, status })
  try {
    if (categoryPattern.exec(req.url)) {
      const alias = categoryPattern.exec(req.url)?.pathname.groups?.alias
      if (!alias) {
        return wrap({ error: 'Alias is required' }, 400)
      }
      const result = await controller.getCategoryByAlias(alias)
      if (!result) {
        return wrap({ error: 'Category not found' }, 404)
      }
      return wrap(result)
    }
    if (phrasesPattern.exec(req.url)) {
      const alias = phrasesPattern.exec(req.url)?.pathname.groups?.alias
      if (!alias) {
        return wrap({ error: 'Alias is required' }, 400)
      }
      const result = await controller.getPhraseByAlias(alias)
      if (!result) {
        return wrap({ error: 'Phrase not found' }, 404)
      }
      return wrap(result)
    }
    const url = new URL(req.url)
    const route = url.pathname.substring(API_PREFIX.length)
    switch (route) {
      case '/health': {
        return wrap({ health: 'healthy' })
      }
      case '/categories': {
        return wrap({ categories: await controller.getCategories()})
      }
      case '/phrases': {
        return wrap({ phrases: await controller.getPhrases() })
      }
      default:
        return wrap({ error: 'not found' }, 404)
    }
  } catch (error) {
    return wrap({ error: error.message, stack: error.stack }, 500)
  }
}, { port: 3001 });
