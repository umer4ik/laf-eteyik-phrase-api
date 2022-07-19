import { walk, WalkEntry } from "https://deno.land/std@0.148.0/fs/mod.ts";
import { parse as parseCSV } from "https://deno.land/std@0.148.0/encoding/csv.ts";
import set from 'https://deno.land/x/lodash@4.17.15-es/set.js'
import { UnknownRecord, CategoryPlain, PhrasePlain } from './types.ts'

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

const isCategory = (obj: UnknownRecord) => typeof obj.parentCategoryName === 'string'

function buildRelations(records: UnknownRecord[]) {
  const categories: CategoryPlain[] = []
  const phrases: PhrasePlain[] = []
  for (const record of records) {
    if (isCategory(record)) {
      categories.push(record as CategoryPlain)
    } else {
      phrases.push(record as PhrasePlain)
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
