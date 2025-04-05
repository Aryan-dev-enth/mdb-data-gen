"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FieldEnumEditorProps {
  isOpen: boolean
  fieldId: string
  initialValues: string[]
  onSave: (fieldId: string, values: string[]) => void
  onCancel: () => void
}

export function FieldEnumEditor({ isOpen, fieldId, initialValues, onSave, onCancel }: FieldEnumEditorProps) {
  const [enumValues, setEnumValues] = useState<string[]>([])
  const [newValue, setNewValue] = useState("")

  useEffect(() => {
    if (isOpen) {
      setEnumValues(initialValues)
      setNewValue("")
    }
  }, [isOpen, initialValues])

  const addValue = () => {
    if (!newValue.trim()) return

    if (enumValues.includes(newValue.trim())) {
      // Value already exists
      setNewValue("")
      return
    }

    setEnumValues([...enumValues, newValue.trim()])
    setNewValue("")
  }

  const removeValue = (index: number) => {
    const newValues = [...enumValues]
    newValues.splice(index, 1)
    setEnumValues(newValues)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addValue()
    }
  }

  const handleSave = () => {
    onSave(fieldId, enumValues)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Enum Values</DialogTitle>
          <DialogDescription>
            Define the possible values for this enum field. These values will be used when generating random data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Add a new enum value"
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={addValue} disabled={!newValue.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {enumValues.length === 0 ? (
              <p className="text-sm text-gray-500">No enum values defined yet.</p>
            ) : (
              enumValues.map((value, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                  {value}
                  <button onClick={() => removeValue(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

