import { Skeleton } from "./ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-950 shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
      {/* Imagen skeleton */}
      <Skeleton className="h-48 w-full" />
      
      <div className="flex-1 flex flex-col p-5">
        {/* Título y badge skeleton */}
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Descripción skeleton */}
        <div className="mb-2">
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-10" />
        </div>
        
        {/* Fecha skeleton */}
        <div className="flex items-center gap-3 mb-1">
          <Skeleton className="h-3 w-48" />
        </div>
        
        {/* Ubicación skeleton */}
        <div className="flex items-center gap-1 mb-2">
          <Skeleton className="h-3 w-32" />
        </div>
        
        {/* Link skeleton */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}