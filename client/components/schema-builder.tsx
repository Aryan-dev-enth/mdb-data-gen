"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionSchema } from "@/components/collection-schema"
import { DataPreview } from "@/components/data-preview"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { generateDummyData } from "@/lib/data-generator"
import { parseMongooseSchema } from "@/lib/schema-parser"
import type { Collection } from "@/lib/types"
import { PlusCircle, Download, RefreshCw, Code, Trash2, Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [generationProgress, setGenerationProgress] = useState(0)
  const [schemaCode, setSchemaCode] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [isParsingSchema, setIsParsingSchema] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const clearAllCollections = () => {
    if (collections.length === 0) return

    if (confirm("Are you sure you want to remove all collections? This cannot be undone.")) {
      setCollections([])
      setGeneratedData({})
      toast({
        title: "All collections removed",
        description: "Your schema definitions have been cleared.",
      })
    }
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
    setGenerationProgress(0)

    try {
      // Generate data with progress updates
      const totalCollections = collections.length
      let completedCollections = 0

      const data: Record<string, any[]> = {}

      for (const collection of collections) {
        // Update progress
        setGenerationProgress(Math.floor((completedCollections / totalCollections) * 100))

        // Simulate processing time for better UX
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Generate data for this collection
        const collectionData = generateDummyData([collection], strictMode)
        data[collection.name] = collectionData[collection.name]

        completedCollections++
      }

      setGenerationProgress(100)
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
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 500)
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

  const copyToClipboard = () => {
    if (Object.keys(generatedData).length === 0) {
      toast({
        title: "No data to copy",
        description: "Please generate data first.",
        variant: "destructive",
      })
      return
    }

    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2))
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "The generated data has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const sampleSchema = `const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});`

  const loadSampleSchema = () => {
    setSchemaCode(sampleSchema)
    setCollectionName("User")
  }

  return (
    <div className="space-y-6" id="schema-builder">
      <Card className="mb-6 overflow-hidden border-blue-200 dark:border-blue-800 shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center">
                <Code className="mr-2 h-5 w-5 text-blue-500" />
                Paste Mongoose Schema
              </h3>
              <Button size="sm" onClick={loadSampleSchema}>
                Load Sample
              </Button>
            </div>

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
                <p className="text-xs text-gray-500 mt-1">Will be auto-detected if not provided</p>
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="schema-code">Schema Code</Label>
                  <Button
                    size="sm"
                    onClick={parseSchema}
                    disabled={isParsingSchema || !schemaCode.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch id="strict-mode" checked={strictMode} onCheckedChange={setStrictMode} />
                  <Label htmlFor="strict-mode" className="cursor-pointer">
                    Strict Schema Mode {strictMode ? "ON" : "OFF"}
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  When ON, generated data strictly follows schema types.
                  <br />
                  When OFF, allows slight variations for more realistic data.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={addCollection}
            disabled={collections.length >= 10}
            className="bg-white dark:bg-gray-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Collection
          </Button>

          <Button
            onClick={generateData}
            disabled={isGenerating || collections.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            Generate Data
          </Button>

          <Button
            variant="outline"
            onClick={exportData}
            disabled={Object.keys(generatedData).length === 0}
            className="bg-white dark:bg-gray-800"
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>

          <Button
            variant="outline"
            onClick={copyToClipboard}
            disabled={Object.keys(generatedData).length === 0}
            className="bg-white dark:bg-gray-800"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </>
            )}
          </Button>

          {collections.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllCollections}
              className="bg-white dark:bg-gray-800 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="mb-4">
          <Label className="text-sm mb-1 block">Generating data...</Label>
          <Progress value={generationProgress} className="h-2" />
        </div>
      )}

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
                <p className="text-gray-500">
                  No collections defined. Paste a Mongoose schema or click "Add Collection" to get started.
                </p>
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

