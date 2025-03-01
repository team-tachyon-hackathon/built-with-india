"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { signOut, useSession } from "next-auth/react"
import { WorkflowBuilder } from "@/components/workflow-builder"
import { WorkflowHeader } from "@/components/workflow-header"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const [buildItem, setBuildItem] = useState<string | null>(null)
  const [testItem, setTestItem] = useState<string | null>(null)
  const [deployItem, setDeployItem] = useState<string | null>(null)
  const { data: session } = useSession()

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
    // For example:
    // sendWorkflowToBackend(workflow)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }


  // Log state changes
  useEffect(() => {
    console.log("Current state:", { buildItem, testItem, deployItem })
  }, [buildItem, testItem, deployItem])

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <WorkflowHeader />
          {session && (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="font-medium">{session.user?.name}</span>
                {session.provider && (
                  <span className="text-gray-500 ml-2">({session.provider})</span>
                )}
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex-grow mt-8">
          <WorkflowBuilder buildItem={buildItem} testItem={testItem} deployItem={deployItem} onDrop={handleDrop} />
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSaveWorkflow} className="border border-black px-4 py-2 rounded-lg">Generate</Button>
        </div>
      </main>
    </DndProvider>
  )
}
  










