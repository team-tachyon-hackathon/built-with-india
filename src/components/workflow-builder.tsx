"use client"

import { forwardRef, type ReactNode } from "react"
import { useDrop } from "react-dnd"
import { Package, TestTube, Upload } from "lucide-react"

import { mergeRefs } from "@/lib/merge-refs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DroppableArea = forwardRef<
  HTMLDivElement,
  {
    type: string
    title: string
    icon: ReactNode
    item: string | null
    onDrop: (item: any, targetType: string) => void
  }
>(({ type, title, icon, item, onDrop }, ref) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item) => {
      onDrop(item, type)
      return undefined
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <Card
      ref={mergeRefs(ref, drop)}
      className={`h-full transition-all duration-300 ${
        isOver ? "border-primary bg-primary/10 scale-105 shadow-lg" : "hover:border-primary/50 hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div
          className={`p-2 rounded-md ${isOver ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
        >
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`h-40 rounded-md border-2 border-dashed transition-colors ${
            isOver ? "border-primary bg-primary/5" : "border-muted"
          } p-4 flex items-center justify-center`}
        >
          {!item ? (
            <div className="flex flex-col h-full items-center justify-center text-sm text-muted-foreground">
              <div className="text-3xl mb-2 opacity-30">+</div>
              <div>Drop {title.toLowerCase()} item here</div>
            </div>
          ) : (
            <div className="w-full rounded-md border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                {type === "build" && <Package className="h-4 w-4 text-primary" />}
                {type === "test" && <TestTube className="h-4 w-4 text-primary" />}
                {type === "deploy" && <Upload className="h-4 w-4 text-primary" />}
                <span className="font-medium">{item}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
DroppableArea.displayName = "DroppableArea"

export function WorkflowBuilder({
  buildItem,
  testItem,
  deployItem,
  onDrop,
}: {
  buildItem: string | null
  testItem: string | null
  deployItem: string | null
  onDrop: (item: any, targetType: string) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
      <DroppableArea
        type="build"
        title="Build"
        icon={<Package className="h-5 w-5" />}
        item={buildItem}
        onDrop={onDrop}
      />
      <DroppableArea type="test" title="Test" icon={<TestTube className="h-5 w-5" />} item={testItem} onDrop={onDrop} />
      <DroppableArea
        type="deploy"
        title="Deploy"
        icon={<Upload className="h-5 w-5" />}
        item={deployItem}
        onDrop={onDrop}
      />
    </div>
  )
}

