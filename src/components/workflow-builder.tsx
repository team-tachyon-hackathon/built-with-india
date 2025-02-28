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
      className={`h-full transition-colors ${isOver ? "border-primary bg-primary/5" : ""}`}
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-md border border-dashed border-gray-300 p-4">
          {!item ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Drop {title.toLowerCase()} item here
            </div>
          ) : (
            <div className="rounded-md border bg-card p-2 shadow-sm">{item}</div>
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
    <div className="grid grid-cols-3 gap-8">
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

