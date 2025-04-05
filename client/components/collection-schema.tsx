"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { Collection, Field } from "@/lib/types"
import { Trash2, PlusCircle, GripVertical, ChevronDown, ChevronUp, Settings } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FieldEnumEditor } from "@/components/field-enum-editor"

interface CollectionSchemaProps {
  collection: Collection
  onUpdate: (collection: Collection) => void
  onRemove: (id: string) => void
}

export function CollectionSchema({ collection, onUpdate, onRemove }: CollectionSchemaProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [fieldWithEnumOpen, setFieldWithEnumOpen] = useState<string | null>(null)

  const updateField = (updatedField: Field) => {
    const updatedFields = collection.fields.map((field) => (field.id === updatedField.id ? updatedField : field))
    onUpdate({ ...collection, fields: updatedFields })
  }

  const addField = () => {
    if (collection.fields.length >= 30) {
      toast({
        title: "Maximum fields reached",
        description: "You can define up to 30 fields per collection.",
        variant: "destructive",
      })
      return
    }

    onUpdate({
      ...collection,
      fields: [
        ...collection.fields,
        {
          id: Date.now().toString(),
          name: `field${collection.fields.length + 1}`,
          type: "String",
          isRequired: false,
          isArray: false,
        },
      ],
    })
  }

  const removeField = (fieldId: string) => {
    if (collection.fields.length <= 1) {
      toast({
        title: "Cannot remove field",
        description: "Each collection must have at least one field.",
        variant: "destructive",
      })
      return
    }

    onUpdate({
      ...collection,
      fields: collection.fields.filter((field) => field.id !== fieldId),
    })
  }

  const updateCollectionName = (name: string) => {
    onUpdate({ ...collection, name })
  }

  const updateDocumentCount = (count: number) => {
    onUpdate({ ...collection, documentCount: count })
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const openEnumEditor = (fieldId: string) => {
    setFieldWithEnumOpen(fieldId)
  }

  const updateEnumValues = (fieldId: string, enumValues: string[]) => {
    const field = collection.fields.find((f) => f.id === fieldId)
    if (field) {
      updateField({
        ...field,
        enumValues,
      })
    }
    setFieldWithEnumOpen(null)
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer" onClick={toggleExpanded}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-500 mr-2" />
            )}
            <CardTitle className="text-lg">{collection.name}</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs">
              {collection.documentCount} {collection.documentCount === 1 ? "document" : "documents"}
            </Badge>
            <Badge variant="outline" className="ml-2 text-xs">
              {collection.fields.length} {collection.fields.length === 1 ? "field" : "fields"}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(collection.id)
              }}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`collection-name-${collection.id}`} className="text-sm font-medium mb-1 block">
                  Collection Name
                </Label>
                <Input
                  id={`collection-name-${collection.id}`}
                  value={collection.name}
                  onChange={(e) => updateCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-1 block">Document Count: {collection.documentCount}</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[collection.documentCount]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => updateDocumentCount(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={collection.documentCount}
                    onChange={(e) => updateDocumentCount(Number(e.target.value))}
                    className="w-16"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-2">
                <div className="col-span-1"></div>
                <div className="col-span-3">Field Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Required</div>
                <div className="col-span-2">Is Array</div>
                <div className="col-span-2">Actions</div>
              </div>

              <div className="divide-y">
                {collection.fields.map((field) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                  >
                    <div className="col-span-1 flex justify-center">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="col-span-3">
                      <Input
                        value={field.name}
                        onChange={(e) => updateField({ ...field, name: e.target.value })}
                        placeholder="Field name"
                      />
                    </div>

                    <div className="col-span-2">
                      <Select value={field.type} onValueChange={(value) => updateField({ ...field, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="String">String</SelectItem>
                          <SelectItem value="Number">Number</SelectItem>
                          <SelectItem value="Boolean">Boolean</SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                          <SelectItem value="ObjectId">ObjectId</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <Switch
                        checked={field.isRequired}
                        onCheckedChange={(checked) => updateField({ ...field, isRequired: checked })}
                      />
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <Switch
                        checked={field.isArray}
                        onCheckedChange={(checked) => updateField({ ...field, isArray: checked })}
                      />
                    </div>

                    <div className="col-span-2 flex justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEnumEditor(field.id)}
                              className={field.enumValues && field.enumValues.length > 0 ? "text-blue-500" : ""}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {field.enumValues && field.enumValues.length > 0
                              ? `Enum Values: ${field.enumValues.join(", ")}`
                              : "Set Enum Values"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>

                    {field.enumValues && field.enumValues.length > 0 && (
                      <div className="col-span-12 pl-8 pb-2">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {field.enumValues.map((value, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={addField}
              className="mt-2"
              disabled={collection.fields.length >= 30}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>

          <FieldEnumEditor
            isOpen={!!fieldWithEnumOpen}
            fieldId={fieldWithEnumOpen || ""}
            initialValues={
              fieldWithEnumOpen ? collection.fields.find((f) => f.id === fieldWithEnumOpen)?.enumValues || [] : []
            }
            onSave={updateEnumValues}
            onCancel={() => setFieldWithEnumOpen(null)}
          />
        </CardContent>
      )}
    </Card>
  )
}

