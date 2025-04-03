import type { Collection, Field } from "./types"
import { faker } from "@faker-js/faker"

// Generate a MongoDB ObjectId
function generateObjectId(): string {
  const timestamp = Math.floor(new Date().getTime() / 1000)
    .toString(16)
    .padStart(8, "0")
  const machineId = Math.floor(Math.random() * 16777216)
    .toString(16)
    .padStart(6, "0")
  const processId = Math.floor(Math.random() * 65536)
    .toString(16)
    .padStart(4, "0")
  const counter = Math.floor(Math.random() * 16777216)
    .toString(16)
    .padStart(6, "0")

  return timestamp + machineId + processId + counter
}

// Generate a random value based on the field type
function generateValueForType(field: Field, strictMode: boolean, existingValues: Set<string> = new Set()): any {
  let value: any

  // Handle array type
  if (field.isArray) {
    const arrayLength = Math.floor(Math.random() * 5) + 1 // 1-5 items
    const array = []

    for (let i = 0; i < arrayLength; i++) {
      array.push(generateSingleValue(field.type, strictMode, existingValues))
    }

    return array
  }

  return generateSingleValue(field.type, strictMode, existingValues)
}

// Generate a single value based on type
function generateSingleValue(type: Field["type"], strictMode: boolean, existingValues: Set<string> = new Set()): any {
  let value: any

  switch (type) {
    case "String":
      // Generate different types of strings based on field name hints
      value = faker.lorem.word()
      break

    case "Number":
      value = faker.number.int({ min: 1, max: 1000 })

      // In non-strict mode, occasionally return a string number
      if (!strictMode && Math.random() < 0.1) {
        value = value.toString()
      }
      break

    case "Boolean":
      value = faker.datatype.boolean()

      // In non-strict mode, occasionally return "true"/"false" strings
      if (!strictMode && Math.random() < 0.1) {
        value = value.toString()
      }
      break

    case "Date":
      value = faker.date.past()

      // In non-strict mode, occasionally return ISO string
      if (!strictMode && Math.random() < 0.2) {
        value = value.toISOString()
      }
      break

    case "ObjectId":
      value = generateObjectId()
      break

    case "Mixed":
      // For Mixed type, randomly choose between different value types
      const mixedTypes = ["string", "number", "boolean", "object", "array"]
      const randomType = mixedTypes[Math.floor(Math.random() * mixedTypes.length)]

      switch (randomType) {
        case "string":
          value = faker.lorem.sentence()
          break
        case "number":
          value = faker.number.int({ min: 1, max: 1000 })
          break
        case "boolean":
          value = faker.datatype.boolean()
          break
        case "object":
          value = {
            key1: faker.lorem.word(),
            key2: faker.number.int({ min: 1, max: 100 }),
            key3: faker.datatype.boolean(),
          }
          break
        case "array":
          value = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => faker.lorem.word())
          break
      }
      break

    default:
      value = null
  }

  return value
}

// Generate more realistic values based on field name
function generateSmartValue(field: Field, strictMode: boolean): any {
  const fieldNameLower = field.name.toLowerCase()

  // Handle array type
  if (field.isArray) {
    const arrayLength = Math.floor(Math.random() * 5) + 1 // 1-5 items
    return Array.from({ length: arrayLength }, () => generateSmartSingleValue(field, fieldNameLower, strictMode))
  }

  return generateSmartSingleValue(field, fieldNameLower, strictMode)
}

// Generate a single smart value based on field name
function generateSmartSingleValue(field: Field, fieldNameLower: string, strictMode: boolean): any {
  // Common field name patterns
  if (field.type === "String" || (!strictMode && Math.random() < 0.9)) {
    // Name-related fields
    if (fieldNameLower.includes("name")) {
      if (fieldNameLower.includes("first")) return faker.person.firstName()
      if (fieldNameLower.includes("last")) return faker.person.lastName()
      if (fieldNameLower.includes("full")) return faker.person.fullName()
      if (fieldNameLower.includes("user")) return faker.internet.userName()
      return faker.person.fullName()
    }

    // Email-related fields
    if (fieldNameLower.includes("email")) {
      return faker.internet.email()
    }

    // Address-related fields
    if (fieldNameLower.includes("address")) {
      if (fieldNameLower.includes("street")) return faker.location.street()
      if (fieldNameLower.includes("city")) return faker.location.city()
      if (fieldNameLower.includes("state")) return faker.location.state()
      if (fieldNameLower.includes("country")) return faker.location.country()
      if (fieldNameLower.includes("zip") || fieldNameLower.includes("postal")) return faker.location.zipCode()
      return faker.location.streetAddress()
    }

    // Phone-related fields
    if (fieldNameLower.includes("phone") || fieldNameLower.includes("mobile")) {
      return faker.phone.number()
    }

    // URL-related fields
    if (fieldNameLower.includes("url") || fieldNameLower.includes("website") || fieldNameLower.includes("site")) {
      return faker.internet.url()
    }

    // Image-related fields
    if (fieldNameLower.includes("image") || fieldNameLower.includes("avatar") || fieldNameLower.includes("photo")) {
      return faker.image.url()
    }

    // Description or content fields
    if (
      fieldNameLower.includes("description") ||
      fieldNameLower.includes("content") ||
      fieldNameLower.includes("text")
    ) {
      return faker.lorem.paragraph()
    }

    // Title fields
    if (fieldNameLower.includes("title")) {
      return faker.lorem.sentence()
    }

    // Username fields
    if (fieldNameLower.includes("username")) {
      return faker.internet.userName()
    }

    // Password fields
    if (fieldNameLower.includes("password")) {
      return faker.internet.password()
    }
  }

  // For other types or if no specific pattern matched, use the generic generator
  return generateValueForType(field, strictMode)
}

// Main function to generate dummy data
export function generateDummyData(collections: Collection[], strictMode: boolean): Record<string, any[]> {
  const result: Record<string, any[]> = {}

  // Generate data for each collection
  collections.forEach((collection) => {
    const collectionData: any[] = []
    const collectionName = collection.name

    // Generate the specified number of documents
    for (let i = 0; i < collection.documentCount; i++) {
      const document: Record<string, any> = {}

      // Generate values for each field
      collection.fields.forEach((field) => {
        // Skip if field has no name
        if (!field.name.trim()) return

        // Generate value based on field type and name
        const value = generateSmartValue(field, strictMode)

        // Skip undefined or null values for non-required fields
        if ((value === undefined || value === null) && !field.isRequired) {
          return
        }

        document[field.name] = value
      })

      collectionData.push(document)
    }

    result[collectionName] = collectionData
  })

  return result
}

