"use client"

import { ArrowRight, Database, Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Mongoose Schema</span>
            <span className="block text-blue-600">Dummy Data Generator</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Generate realistic dummy data based on your Mongoose schemas in seconds. Perfect for frontend development,
            testing, and prototyping.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="rounded-md shadow bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                document.getElementById("schema-builder")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-gray-900 dark:text-white">Instant Data</h3>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Generate realistic data records with a single click based on your schema.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-gray-900 dark:text-white">Schema Import</h3>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Paste your existing Mongoose schema code and we'll automatically parse it.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-gray-900 dark:text-white">Smart Generation</h3>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Field names like "email" or "address" automatically generate appropriate realistic data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

