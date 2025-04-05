"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react"

export function GettingStarted() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="mb-8" id="getting-started">
      <CardContent className="pt-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">How to use this tool</h2>
            <CollapsibleTrigger asChild className="ml-auto">
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">1. Define Your Schema</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Either paste your existing Mongoose schema code or manually define your collections and fields.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">2. Configure Options</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set document counts, toggle strict mode, and customize field properties like enums and required
                    status.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-lg">3. Generate & Export</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate realistic dummy data based on your schemas, preview the results, and export as JSON.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h4 className="font-medium">Pro Tips:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-gray-700 dark:text-gray-300">
                  <li>
                    Use <strong>Strict Mode</strong> to ensure data strictly follows schema types
                  </li>
                  <li>
                    The tool automatically detects <strong>enum values</strong> from your Mongoose schema
                  </li>
                  <li>Field names like "email", "name", or "address" will generate appropriate realistic data</li>
                  <li>You can define up to 10 collections with up to 30 fields each</li>
                  <li>Each collection can generate up to 50 documents</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

