import { SchemaBuilder } from "@/components/schema-builder"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mongoose Schema Dummy Data Generator</h1>
          <p className="text-gray-600 mt-2">
            Define your Mongoose schemas and generate realistic dummy data for testing and development.
          </p>
        </header>

        <SchemaBuilder />
      </div>
    </main>
  )
}

