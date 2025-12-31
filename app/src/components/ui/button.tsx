import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#E07B39] to-[#F4A261] text-white shadow-[0_4px_20px_rgba(224,123,57,0.35)] hover:shadow-[0_8px_30px_rgba(224,123,57,0.45)] hover:-translate-y-0.5",
        secondary:
          "bg-transparent text-[#0D5C63] border-2 border-[#0D5C63] hover:bg-[#0D5C63] hover:text-white",
        ghost:
          "bg-transparent text-[#2D3436] hover:text-[#0D5C63]",
        outline:
          "border-2 border-[#0D5C63] text-[#0D5C63] hover:bg-[#0D5C63] hover:text-white",
      },
      size: {
        default: "px-8 py-3.5",
        sm: "px-6 py-2.5 text-sm",
        lg: "px-10 py-4.5 text-lg",
        xl: "px-12 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
