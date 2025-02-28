import type { MutableRefObject } from "react"

export function mergeRefs<T = any>(
  ...refs: Array<MutableRefObject<T> | ((instance: T | null) => void) | null | undefined>
): (instance: T | null) => void {
  return (instance) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance)
      } else if (ref != null) {
        ;(ref as MutableRefObject<T | null>).current = instance
      }
    })
  }
}

