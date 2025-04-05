import Link from "next/link"
import { Database, Github, Twitter, Heart, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Database className="h-10 w-10 text-blue-600" />
        </div>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
          <div className="px-5 py-2">
            <Link
              href="#"
              className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Home
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="#features"
              className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Features
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="#how-it-works"
              className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              How It Works
            </Link>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <Link
            href="https://github.com/Aryan-dev-enth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/aryan-singh-459b6b225/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">Linkedin</span>
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
        <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400 flex items-center justify-center">
  Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for developers by{' '}
  <Link href="https://aryanxdev.vercel.app" target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-orange-500 transition-colors">
    Aryan
  </Link>
</p>

        
      </div>
    </footer>
  )
}

