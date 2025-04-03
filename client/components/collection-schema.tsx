"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { Collection, Field } from "@/lib/types"
import { Trash2, PlusCircle, GripVertical } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CollectionSchemaProps {
  collection: Collection
  onUpdate: (collection: Collection) => void
  onRemove: (id: string) => void
}

export function CollectionSchema({ collection, onUpdate, onRemove }: CollectionSchemaProps) {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
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

          <div className="flex-1 mr-4">
            <Label className="text-sm font-medium mb-1 block">Document Count: {collection.documentCount}</Label>
            <Slider
              value={[collection.documentCount]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => updateDocumentCount(value[0])}
              className="w-full"
            />
          </div>

          <Button variant="destructive" size="icon" onClick={() => onRemove(collection.id)} className="flex-shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
            <div className="col-span-1"></div>
            <div className="col-span-3">Field Name</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2">Required</div>
            <div className="col-span-2">Is Array</div>
            <div className="col-span-1"></div>
          </div>

          {collection.fields.map((field) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
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

              <div className="col-span-3">
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

              <div className="col-span-1 flex justify-center">
                <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ))}

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
      </CardContent>
    </Card>
  )
}

