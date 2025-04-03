"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionSchema } from "@/components/collection-schema"
import { DataPreview } from "./data-preview"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { generateDummyData } from "@/lib/data-generator"
import { parseMongooseSchema } from "@/lib/schema-parser"
import type { Collection } from "@/lib/types"
import { PlusCircle, Download, RefreshCw, Code } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SchemaBuilder() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "User",
      documentCount: 5,
      fields: [
        { id: "1", name: "name", type: "String", isRequired: true, isArray: false },
        { id: "2", name: "email", type: "String", isRequired: true, isArray: false },
        { id: "3", name: "age", type: "Number", isRequired: false, isArray: false },
      ],
    },
  ])
  const [activeTab, setActiveTab] = useState("schema")
  const [strictMode, setStrictMode] = useState(true)
  const [generatedData, setGeneratedData] = useState<Record<string, any[]>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [schemaCode, setSchemaCode] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [isParsingSchema, setIsParsingSchema] = useState(false)

  const addCollection = () => {
    if (collections.length >= 10) {
      toast({
        title: "Maximum collections reached",
        description: "You can define up to 10 collections.",
        variant: "destructive",
      })
      return
    }

    setCollections([
      ...collections,
      {
        id: Date.now().toString(),
        name: `Collection${collections.length + 1}`,
        documentCount: 5,
        fields: [{ id: Date.now().toString(), name: "field1", type: "String", isRequired: true, isArray: false }],
      },
    ])
  }

  const updateCollection = (updatedCollection: Collection) => {
    setCollections(
      collections.map((collection) => (collection.id === updatedCollection.id ? updatedCollection : collection)),
    )
  }

  const removeCollection = (collectionId: string) => {
    setCollections(collections.filter((collection) => collection.id !== collectionId))
  }

  const generateData = async () => {
    if (collections.length === 0) {
      toast({
        title: "No collections defined",
        description: "Please define at least one collection with fields.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data = generateDummyData(collections, strictMode)
      setGeneratedData(data)
      setActiveTab("preview")

      toast({
        title: "Data generated successfully",
        description: `Generated ${Object.keys(data).length} collections with dummy data.`,
      })
    } catch (error) {
      toast({
        title: "Error generating data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const exportData = () => {
    if (Object.keys(generatedData).length === 0) {
      toast({
        title: "No data to export",
        description: "Please generate data first.",
        variant: "destructive",
      })
      return
    }

    const dataStr = JSON.stringify(generatedData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = "mongoose-dummy-data.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data exported",
      description: "Your dummy data has been exported as JSON.",
    })
  }

  const parseSchema = () => {
    if (!schemaCode.trim()) {
      toast({
        title: "Empty schema",
        description: "Please paste a Mongoose schema definition.",
        variant: "destructive",
      })
      return
    }

    const name = collectionName.trim() || "ImportedCollection"
    setIsParsingSchema(true)

    try {
      const parsedCollection = parseMongooseSchema(schemaCode, name)

      setCollections([...collections, parsedCollection])

      toast({
        title: "Schema parsed successfully",
        description: `Added ${parsedCollection.name} with ${parsedCollection.fields.length} fields.`,
      })

      // Clear the inputs
      setSchemaCode("")
      setCollectionName("")
    } catch (error) {
      toast({
        title: "Failed to parse schema",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsParsingSchema(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="strict-mode" checked={strictMode} onCheckedChange={setStrictMode} />
          <Label htmlFor="strict-mode">Strict Schema Mode {strictMode ? "ON" : "OFF"}</Label>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={addCollection} disabled={collections.length >= 10}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Collection
          </Button>

          <Button onClick={generateData} disabled={isGenerating || collections.length === 0}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            Generate Data
          </Button>

          <Button variant="secondary" onClick={exportData} disabled={Object.keys(generatedData).length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paste Mongoose Schema</h3>
            <p className="text-sm text-gray-500">
              Paste your Mongoose schema code below and click "Parse Schema" to automatically create a collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g., User, Product, Note"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="schema-code">Schema Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={parseSchema}
                    disabled={isParsingSchema || !schemaCode.trim()}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    {isParsingSchema ? "Parsing..." : "Parse Schema"}
                  </Button>
                </div>
                <Textarea
                  id="schema-code"
                  value={schemaCode}
                  onChange={(e) => setSchemaCode(e.target.value)}
                  placeholder="Paste your Mongoose schema code here..."
                  className="mt-1 font-mono text-sm h-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schema">Schema Definition</TabsTrigger>
          <TabsTrigger value="preview" disabled={Object.keys(generatedData).length === 0}>
            Data Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4 mt-4">
          {collections.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No collections defined. Click "Add Collection" to get started.</p>
              </CardContent>
            </Card>
          ) : (
            collections.map((collection) => (
              <CollectionSchema
                key={collection.id}
                collection={collection}
                onUpdate={updateCollection}
                onRemove={removeCollection}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <DataPreview data={generatedData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

