"use client"

import { useState, useEffect } from "react"
import { SchemaBuilder } from "@/components/schema-builder"
import { GettingStarted } from "@/components/getting-started"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Hero />
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
              <GettingStarted />
              <SchemaBuilder />
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}

