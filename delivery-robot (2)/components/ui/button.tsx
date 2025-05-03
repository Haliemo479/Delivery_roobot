"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Update the buttonVariants to enhance button colors and styling
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-600 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-600 shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        egyptian:
          "bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 border border-secondary-400/30 shadow-lg shadow-secondary-900/20 hover:from-secondary-400 hover:to-secondary-500 transition-all duration-300 font-semibold",
        futuristic:
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white border border-accent-400/30 shadow-lg shadow-accent-900/20 hover:from-accent-400 hover:to-accent-500 transition-all duration-300",
        golden:
          "bg-gradient-to-r from-secondary-400 to-secondary-500 text-primary-900 border border-secondary-300 shadow-md shadow-secondary-900/10 hover:shadow-lg hover:shadow-secondary-900/20 transition-all duration-300 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        touch: "h-12 px-6 py-3 text-base rounded-lg", // Increased horizontal padding
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
