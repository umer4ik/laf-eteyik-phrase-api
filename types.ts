export interface Translation {
  uk: string,
  ru: string
}

export interface Laf extends Translation {
  qt: {
    cyr: string,
    lat: string
  }
}

export type CategoryPlain = {
  name: Laf,
  additionalInfo: Translation,
  description: Translation,
  parentCategoryName: string
}

export type PhrasePlain = {
  laf: Laf,
  categoryName: string
}

export type UnknownRecord = Record<string, unknown>
