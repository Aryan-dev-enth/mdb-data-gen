export interface Field {
  id: string
  name: string
  type: "String" | "Number" | "Boolean" | "Date" | "ObjectId" | "Mixed"
  isRequired: boolean
  isArray: boolean
}

export interface Collection {
  id: string
  name: string
  documentCount: number
  fields: Field[]
}

