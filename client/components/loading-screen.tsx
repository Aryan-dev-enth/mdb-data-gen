import { Database } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
      <div className="text-center">
        <Database className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Loading DummyData Generator</h2>
        <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 animate-progress-bar"></div>
        </div>
      </div>
    </div>
  )
}

