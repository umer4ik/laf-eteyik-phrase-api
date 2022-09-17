import { CategoryPlain, PhrasePlain } from './types.ts'
import { getData } from './files.ts'

interface Data {
  categories: CategoryPlain[],
  phrases: PhrasePlain[]
}

class InMemoryDB {
  private dataIsCached = false
  private data: Data = {
    categories: [],
    phrases: []
  }
  async connect() {
    if (this.dataIsCached) return
    this.data = await getData();
    this.dataIsCached = true
  }
  async getCategories() {
    await this.connect()
    return this.data.categories
  }
  async getPhrases() {
    await this.connect()
    return this.data.phrases
  }
  close() {
    return Promise.resolve()
  }
} 

export const inMemoryDB = new InMemoryDB()