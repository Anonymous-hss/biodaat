import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "xl"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    // Variant styles
    const variantStyles = {
      default: "bg-gradient-to-r from-[#E07B39] to-[#F4A261] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
      secondary: "bg-transparent text-[#0D5C63] border-2 border-[#0D5C63] hover:bg-[#0D5C63] hover:text-white",
      ghost: "bg-transparent text-[#2D3436] hover:text-[#0D5C63]",
      outline: "border-2 border-[#0D5C63] text-[#0D5C63] hover:bg-[#0D5C63] hover:text-white",
    }
    
    // Size styles
    const sizeStyles = {
      default: "px-8 py-4",
      sm: "px-6 py-3 text-sm",
      lg: "px-10 py-5 text-lg",
      xl: "px-12 py-6 text-xl",
    }

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

