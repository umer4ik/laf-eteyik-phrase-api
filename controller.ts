import { inMemoryDB } from './in-memory-db.ts'
import { CategoryPlain } from './types.ts'

class Controller {
  async getCategoryByAlias(alias: string) {
    const categories = await inMemoryDB.getCategories()
    const category = categories.find(x => x.alias === alias)
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
    return phrases.find(x => x.alias === alias)
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