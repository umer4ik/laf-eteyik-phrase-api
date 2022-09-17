import { walk, WalkEntry } from "https://deno.land/std@0.156.0/fs/mod.ts";
import { parse as parseCSV } from "https://deno.land/std@0.156.0/encoding/csv.ts";
import set from 'https://deno.land/x/lodash@4.17.15-es/set.js'
import { UnknownRecord, CategoryPlain, PhrasePlain, Laf, Translation } from './types.ts'

export async function walkFiles() {
  const files: WalkEntry[] = []
  for await (const file of walk('./files')) {
    !file.isDirectory && files.push(file)
  }
  return files
}

async function fileToCSV(file: WalkEntry) {
  const content = await Deno.readTextFile(file.path)
  const csv = parseCSV(content)
  return csv
}

function createAlias(c: string) {
  const lettersMap: Record<string, string> = {
    'ö': 'o',
    'ü': 'u',
    'ğ': 'g',
    'ñ': 'n',
    'ç': 'c',
    'ş': 's',
    'â': 'a',
    'ı': 'i'
  }
  return c.split('')
    .map(x => x.toLowerCase())
    .map(char => lettersMap[char] || char)
    .join('')
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--/g, '-')
}

function csvToObject(csv: string[][]) {
  const [keys, ...rest] = csv
  const results: Array<UnknownRecord> = []
  rest.forEach(x => {
    const obj = {}
    keys.forEach((key, i) => {
      set(obj, key, x[i])
    })
    results.push(obj)
  })
  return results
}

const unknownCategoryName: Laf = {
  uk: 'Невідома категорія',
  ru: 'Неизвестная категория',
  qt: {
    cyr: 'Билинмез категория',
    lat: 'Bilinmez kategoriya'
  }
}

const isCategoryRecord = (obj: UnknownRecord) => typeof obj.parentCategoryName === 'string'
const recordToCategory = (obj: UnknownRecord): CategoryPlain => {
  const alias = createAlias((obj.name as Laf).qt.lat)
  return { ...obj, alias } as CategoryPlain
}
const recordToPhrase = (obj: UnknownRecord): PhrasePlain => {
  const alias = createAlias((obj.laf as Laf).qt.lat)
  return { ...obj, alias } as PhrasePlain
}


function buildRelations(records: UnknownRecord[]) {
  const categories: CategoryPlain[] = []
  const phrases: PhrasePlain[] = []
  for (const record of records) {
    if (isCategoryRecord(record)) {
      categories.push(recordToCategory(record))
    } else {
      phrases.push(recordToPhrase(record))
    }
  }
  return {
    categories,
    phrases
  }
}

export async function getData() {
  const files = await walkFiles()
  const all: UnknownRecord[] = []
  for (const file of files) {
    const csv = await fileToCSV(file)
    const objects = csvToObject(csv)
    all.push(...objects)
  }
  return buildRelations(all)
}
