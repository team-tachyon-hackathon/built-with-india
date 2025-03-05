"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { signOut, useSession } from "next-auth/react"
import {WorkflowBuilder} from "@/components/workflow-builder"
import { WorkflowHeader } from "@/components/workflow-header"
import { Button } from "@/components/ui/button"
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function Home() {
  const [buildItem, setBuildItem] = useState<string | null>(null)
  const [testItem, setTestItem] = useState<string | null>(null)
  const [deployItem, setDeployItem] = useState<string | null>(null)
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Add this near the top of the component
  useEffect(() => {
    console.log("Current theme:", theme)
  }, [theme])

  const handleDrop = (item: { type: string; name: string }, targetType: string) => {
    console.log(`Item dropped: ${item.name} into ${targetType}`)
    if (item.type === "build" && targetType === "build") {
      setBuildItem(item.name)
    } else if (item.type === "test" && targetType === "test") {
      setTestItem(item.name)
    } else if (item.type === "deploy" && targetType === "deploy") {
      setDeployItem(item.name)
    }
  }

  const getSelectedWorkflow = () => {
    return {
      build: buildItem,
      test: testItem,
      deploy: deployItem,
    }
  }

  const handleSaveWorkflow = () => {
    const workflow = getSelectedWorkflow()
    console.log("Selected Workflow:", workflow)
    // Here you would typically send this data to your backend
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  // Log state changes
  useEffect(() => {
    console.log("Current state:", { buildItem, testItem, deployItem })
  }, [buildItem, testItem, deployItem])

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen p-6 md:p-8 flex flex-col bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ))}
            </Button>

            {session && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{session.user?.name}</span>
                    {session.provider && (
                      <span className="text-muted-foreground ml-2 text-xs">({session.provider})</span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-muted"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* <div className="mb-8">
          <WorkflowHeader />
        </div> */}

        <div className="flex-grow mt-8 mb-12">
          <WorkflowBuilder/>
        </div>
      </main>
    </DndProvider>
  )
}