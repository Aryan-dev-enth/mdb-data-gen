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
function generateValueForType(
  field: Field,
  strictMode: boolean,
  existingValues: Set<string> = new Set()
): any {
  if (field.isArray) {
    const arrayLength = Math.floor(Math.random() * 5) + 1
    const array = []

    for (let i = 0; i < arrayLength; i++) {
      array.push(generateSingleValue(field, strictMode, existingValues))
    }

    return array
  }

  return generateSingleValue(field, strictMode, existingValues)
}

function generateSingleValue(
  field: Field,
  strictMode: boolean,
  existingValues: Set<string> = new Set()
): any {
  if (field.enumValues && field.enumValues.length > 0) {
    const randomIndex = Math.floor(Math.random() * field.enumValues.length)
    return field.enumValues[randomIndex]
  }

  let value: any

  switch (field.type) {
    case "String":
      value = faker.lorem.word()
      break

    case "Number":
      value = faker.number.int({ min: 1, max: 1000 })
      if (!strictMode && Math.random() < 0.1) {
        value = value.toString()
      }
      break

    case "Boolean":
      value = faker.datatype.boolean()
      if (!strictMode && Math.random() < 0.1) {
        value = value.toString()
      }
      break

    case "Date":
      value = faker.date.past()
      if (!strictMode && Math.random() < 0.2) {
        value = value.toISOString()
      }
      break

    case "ObjectId":
      value = generateObjectId()
      break

    case "Mixed":
      const mixedTypes = ["string", "number", "boolean", "object", "array"]
      const randomType =
        mixedTypes[Math.floor(Math.random() * mixedTypes.length)]

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
          value = Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
            () => faker.lorem.word()
          )
          break
      }
      break

    default:
      value = null
  }

  return value
}

function generateSmartValue(field: Field, strictMode: boolean): any {
  const fieldNameLower = field.name.toLowerCase()

  if (field.isArray) {
    const arrayLength = Math.floor(Math.random() * 5) + 1
    return Array.from(
      { length: arrayLength },
      () => generateSmartSingleValue(field, fieldNameLower, strictMode)
    )
  }

  return generateSmartSingleValue(field, fieldNameLower, strictMode)
}

function generateSmartSingleValue(
  field: Field,
  fieldNameLower: string,
  strictMode: boolean
): any {
  if (field.enumValues && field.enumValues.length > 0) {
    const randomIndex = Math.floor(Math.random() * field.enumValues.length)
    return field.enumValues[randomIndex]
  }

  if (field.type === "String" || (!strictMode && Math.random() < 0.9)) {
    if (fieldNameLower.includes("name")) {
      if (fieldNameLower.includes("first")) return faker.person.firstName()
      if (fieldNameLower.includes("last")) return faker.person.lastName()
      if (fieldNameLower.includes("full")) return faker.person.fullName()
      if (fieldNameLower.includes("user")) return faker.internet.userName()
      return faker.person.fullName()
    }

    if (fieldNameLower.includes("email")) {
      return faker.internet.email()
    }

    if (fieldNameLower.includes("address")) {
      if (fieldNameLower.includes("street")) return faker.location.street()
      if (fieldNameLower.includes("city")) return faker.location.city()
      if (fieldNameLower.includes("state")) return faker.location.state()
      if (fieldNameLower.includes("country")) return faker.location.country()
      if (
        fieldNameLower.includes("zip") ||
        fieldNameLower.includes("postal")
      )
        return faker.location.zipCode()
      return faker.location.streetAddress()
    }

    if (
      fieldNameLower.includes("phone") ||
      fieldNameLower.includes("mobile")
    ) {
      return faker.phone.number()
    }

    if (
      fieldNameLower.includes("url") ||
      fieldNameLower.includes("website") ||
      fieldNameLower.includes("site")
    ) {
      return faker.internet.url()
    }

    if (
      fieldNameLower.includes("image") ||
      fieldNameLower.includes("avatar") ||
      fieldNameLower.includes("photo")
    ) {
      return faker.image.url()
    }

    if (
      fieldNameLower.includes("description") ||
      fieldNameLower.includes("content") ||
      fieldNameLower.includes("text")
    ) {
      return faker.lorem.paragraph()
    }

    if (fieldNameLower.includes("title")) {
      return faker.lorem.sentence()
    }

    if (fieldNameLower.includes("username")) {
      return faker.internet.userName()
    }

    if (fieldNameLower.includes("password")) {
      return faker.internet.password()
    }

    if (fieldNameLower.includes("id") && !fieldNameLower.includes("objectid")) {
      return faker.string.alphanumeric(10)
    }

    return faker.lorem.word()
  }

  return generateValueForType(field, strictMode)
}

// Main function to generate dummy data
export function generateDummyData(
  collections: Collection[],
  strictMode: boolean
): Record<string, any[]> {
  const result: Record<string, any[]> = {}

  collections.forEach((collection) => {
    const collectionData: any[] = []
    const collectionName = collection.name

    for (let i = 0; i < collection.documentCount; i++) {
      const document: Record<string, any> = {}

      collection.fields.forEach((field) => {
        if (!field.name.trim()) return

        const value = generateSmartValue(field, strictMode)

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
