export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg p-6 space-y-4">
        <div className="h-12 w-12 bg-muted-foreground/20 rounded-full mx-auto"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonTestimonial() {
  return (
    <div className="animate-pulse">
      <div className="bg-card rounded-lg p-6 space-y-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-muted-foreground/20 rounded"></div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-4/5"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/5"></div>
        </div>
      </div>
    </div>
  )
}
