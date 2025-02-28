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
      className={`cursor-grab rounded-md border border-dashed border-gray-300 bg-white p-2 shadow-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {name}
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
      <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium shadow-sm hover:bg-gray-50">
        {icon}
        {title}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
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
    <div className="flex items-center gap-4">
      <CategoryDropdown title="Build" icon={<Package className="h-4 w-4" />} items={buildItems} type="build" />
      <CategoryDropdown title="Test" icon={<TestTube className="h-4 w-4" />} items={testItems} type="test" />
      <CategoryDropdown title="Deploy" icon={<Upload className="h-4 w-4" />} items={deployItems} type="deploy" />
    </div>
  )
}

