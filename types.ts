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

export interface CategoryPlain {
  name: Laf,
  additionalInfo: Translation,
  description: Translation,
  parentCategoryName: string,
  alias: string,
  categories?: CategoryPlain[],
  phrases?: PhrasePlain[]
}

export interface PhrasePlain {
  laf: Laf,
  categoryName: string,
  alias: string
}

export interface PhraseDetails extends PhrasePlain {
  category: CategoryPlain
}

export type UnknownRecord = Record<string, unknown>

export interface ErrorObject {
  error: string
  stack?: string
}

export interface HealthCheck {
  health: 'healthy'
}

export type ControllerResult = CategoryPlain | CategoryPlain[] | PhrasePlain | PhrasePlain[] | PhraseDetails | ErrorObject | HealthCheck
