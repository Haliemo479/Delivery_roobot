"use client"

import { cn } from "@/lib/utils"

export function FuturisticContainer({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "relative bg-primary-900/60 border border-primary-800/50 rounded-md overflow-hidden scrollbar-hide",
        className,
      )}
      {...props}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-secondary/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-secondary/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-secondary/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-secondary/60" />

      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/10 to-primary-900/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full scrollbar-hide">{children}</div>
    </div>
  )
}
