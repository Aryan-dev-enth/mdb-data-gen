export interface Field {
  id: string
  name: string
  type: any
  isRequired: boolean
  isArray: boolean
}

export interface Collection {
  id: string
  name: string
  documentCount: number
  fields: Field[]
}

