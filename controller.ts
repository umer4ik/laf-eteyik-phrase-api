import { inMemoryDB } from './in-memory-db.ts'
import { CategoryPlain, PhraseDetails } from './types.ts'
import get from 'https://deno.land/x/lodash@4.17.15-es/get.js'

class Controller {
  async getCategoryBy(by: string, value: string) {
    const categories = await inMemoryDB.getCategories()
    return categories.find(x => get(x, by) === value)
  }
  async getCategoryByAlias(alias: string) {
    const category = await this.getCategoryBy('alias', alias)
    if (!category) {
      return null
    }
    const categoryWithCategories = {
      ...category,
      categories: await this.getCategoriesByParent(category),
      phrases: await this.getPhrasesByCategory(category)
    }
    return categoryWithCategories
  }
  async getPhraseByAlias(alias: string) {
    const phrases = await inMemoryDB.getPhrases()
    const phrase = phrases.find(x => x.alias === alias)
    if (!phrase) return null
    const cat = await this.getCategoryBy('name.qt.lat', phrase.categoryName)
    return {
      ...phrase,
      category: cat
    } as PhraseDetails
  }
  async getPhrasesByCategory(category: CategoryPlain) {
    const phrases = await inMemoryDB.getPhrases()
    return phrases.filter(x => x.categoryName === category.name.qt.lat)
  }
  async getCategoriesByParent(parent: CategoryPlain) {
    const categories = await inMemoryDB.getCategories()
    return categories.filter(x => x.parentCategoryName === parent.name.qt.lat)
  }
  getCategories() {
    return inMemoryDB.getCategories()
  }
  getPhrases() {
    return inMemoryDB.getPhrases()
  }
}

export const controller = new Controller()