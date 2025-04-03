"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface DataPreviewProps {
  data: Record<string, any[]>
}

export function DataPreview({ data }: DataPreviewProps) {
  const [activeCollection, setActiveCollection] = useState<string | null>(
    Object.keys(data).length > 0 ? Object.keys(data)[0] : null,
  )
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStates({ ...copiedStates, [key]: true })
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [key]: false })
    }, 2000)
  }

  if (Object.keys(data).length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No data generated yet. Define your schemas and click "Generate Data".</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Data Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCollection || ""} onValueChange={setActiveCollection} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {Object.keys(data).map((collectionName) => (
              <TabsTrigger key={collectionName} value={collectionName}>
                {collectionName} ({data[collectionName].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(data).map((collectionName) => (
            <TabsContent key={collectionName} value={collectionName}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{collectionName} Collection</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(data[collectionName], null, 2), collectionName)}
                >
                  {copiedStates[collectionName] ? (
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
              </div>

              <ScrollArea className="h-[500px] rounded-md border">
                <pre className="p-4 text-sm">{JSON.stringify(data[collectionName], null, 2)}</pre>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

