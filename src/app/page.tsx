"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { WorkflowBuilder } from "@/components/workflow-builder"
import { WorkflowHeader } from "@/components/workflow-header"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [buildItem, setBuildItem] = useState<string | null>(null)
  const [testItem, setTestItem] = useState<string | null>(null)
  const [deployItem, setDeployItem] = useState<string | null>(null)

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

  // Log state changes
  useEffect(() => {
    console.log("Current state:", { buildItem, testItem, deployItem })
  }, [buildItem, testItem, deployItem])

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="min-h-screen p-4 flex flex-col">
        <WorkflowHeader />
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











