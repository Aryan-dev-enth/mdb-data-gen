import type { Collection, Field } from "./types";

export function parseMongooseSchema(schemaCode: string, collectionName: string): Collection {
  try {
    const cleanedCode = cleanSchemaCode(schemaCode);

    const schemaDefMatch = cleanedCode.match(/new\s+mongoose\.Schema\s*\(\s*({[\s\S]*?})\s*,\s*({[\s\S]*?})?\s*\)/);
    if (!schemaDefMatch || !schemaDefMatch[1]) {
      throw new Error("Could not find a valid Mongoose schema definition.");
    }

    const schemaObj = schemaDefMatch[1];

    let finalCollectionName = collectionName;
    if (!finalCollectionName || finalCollectionName === "ImportedCollection") {
      const modelNameMatch = cleanedCode.match(/mongoose\.model\s*\(\s*["']([^"']+)["']/);
      if (modelNameMatch) finalCollectionName = modelNameMatch[1];
    }

    const fields = parseSchemaFields(schemaObj);
    if (schemaDefMatch[2]?.includes("timestamps: true")) {
      fields.push({ id: "createdAt", name: "createdAt", type: "Date", isRequired: false, isArray: false });
      fields.push({ id: "updatedAt", name: "updatedAt", type: "Date", isRequired: false, isArray: false });
    }

    return { id: Date.now().toString(), name: finalCollectionName, documentCount: 10, fields };
  } catch (error) {
    console.error("Error parsing Mongoose schema:", error);
    throw new Error("Failed to parse Mongoose schema. Check the format and try again.");
  }
}

function cleanSchemaCode(code: string): string {
  return code.replace(/\/\/.*$/gm, "").replace(/\/*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();
}

function parseSchemaFields(schemaObj: string): Field[] {
  const fields: Field[] = [];
  let fieldId = 1;

  const fieldPattern = /(\w+)\s*:\s*({[^{}]*(?:{[^{}]*}[^{}]*)*}|\[[^[\]]*(?:\[[^[\]]*\][^[\]]*)*\]|[^,}]*)/g;

  let match;
  while ((match = fieldPattern.exec(schemaObj)) !== null) {
    const fieldName = match[1];
    const fieldDef = match[2].trim();
    if (["methods", "virtuals", "statics"].includes(fieldName)) continue;

    try {
      const field = parseFieldDefinition(fieldName, fieldDef, fieldId.toString());
      fields.push(field);
      fieldId++;
    } catch (error) {
      console.warn(`Skipping field ${fieldName} due to parsing error:`, error);
    }
  }
  return fields;
}

function parseFieldDefinition(fieldName: string, fieldDef: string, fieldId: string): Field {
  const field: Field = { id: fieldId, name: fieldName, type: "String", isRequired: false, isArray: false };

  if (fieldDef.startsWith("[") && fieldDef.endsWith("]")) {
    field.isArray = true;
    fieldDef = fieldDef.slice(1, -1).trim();
  }

  const typeMap: Record<string, "String" | "Number" | "Boolean" | "Date" | "ObjectId" | "Mixed"> = {
    String: "String", Number: "Number", Boolean: "Boolean", Date: "Date", ObjectId: "ObjectId", Mixed: "Mixed", Object: "Mixed",
    "mongoose.Schema.Types.String": "String", "mongoose.Schema.Types.Number": "Number", "mongoose.Schema.Types.Boolean": "Boolean",
    "mongoose.Schema.Types.Date": "Date", "mongoose.Schema.Types.ObjectId": "ObjectId", "mongoose.Schema.Types.Mixed": "Mixed"
  };

  if (typeMap[fieldDef]) {
    field.type = typeMap[fieldDef];
  } else if (fieldDef.startsWith("{") && fieldDef.endsWith("}")) {
    const typeMatch = fieldDef.match(/type\s*:\s*([^,}]*)/);
    if (typeMatch) field.type = typeMap[typeMatch[1].trim()] || "Mixed";
    if (/required\s*:\s*(true|\[true[^\]]*\])/i.test(fieldDef)) field.isRequired = true;
  }
  return field;
}