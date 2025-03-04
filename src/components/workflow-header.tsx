"use client"

import type React from "react"

import { useState } from "react"
import { useDrag } from "react-dnd"
import { ChevronDown, Package, TestTube, Upload } from "lucide-react"

const DraggableItem = ({ type, name }: { type: string; name: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { type, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`cursor-grab rounded-md border border-muted bg-card p-3 shadow-sm transition-all ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 hover:shadow-md hover:border-primary/50"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "build" && <Package className="h-4 w-4 text-primary" />}
        {type === "test" && <TestTube className="h-4 w-4 text-primary" />}
        {type === "deploy" && <Upload className="h-4 w-4 text-primary" />}
        <span>{name}</span>
      </div>
    </div>
  )
}

const CategoryDropdown = ({
  title,
  icon,
  items,
  type,
}: {
  title: string
  icon: React.ReactNode
  items: string[]
  type: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-2 rounded-md bg-card px-4 py-2 font-medium shadow-sm hover:bg-muted/50 transition-colors">
        <div className="text-primary">{icon}</div>
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-border bg-card p-3 shadow-lg">
          <div className="grid gap-2">
            {items.map((item) => (
              <DraggableItem key={item} type={type} name={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function WorkflowHeader() {
  const buildItems = ["Clone Repository", "Install Dependencies", "Build Project", "Lint Code", "Compile Assets"]

  const testItems = ["Run Unit Tests", "Run Integration Tests", "Run E2E Tests", "Code Coverage", "Performance Testing"]

  const deployItems = [
    "Deploy to Staging",
    "Deploy to Production",
    "Backup Database",
    "Update Documentation",
    "Send Notifications",
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CategoryDropdown title="Build" icon={<Package className="h-4 w-4" />} items={buildItems} type="build" />
      <CategoryDropdown title="Test" icon={<TestTube className="h-4 w-4" />} items={testItems} type="test" />
      <CategoryDropdown title="Deploy" icon={<Upload className="h-4 w-4" />} items={deployItems} type="deploy" />
    </div>
  )
}

