import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-300)] focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-700)] active:bg-[var(--primary-800)]",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-sm hover:bg-[var(--primary-50)] hover:text-[var(--primary-700)] hover:border-[var(--primary-300)] dark:hover:bg-[var(--primary-900)] dark:hover:text-[var(--primary-400)]",
        secondary:
          "bg-[var(--teal-500)] text-white shadow-sm hover:bg-[var(--teal-600)] active:bg-[var(--teal-700)]",
        ghost: "hover:bg-[var(--primary-50)] hover:text-[var(--primary-700)] dark:hover:bg-[var(--primary-900)] dark:hover:text-[var(--primary-400)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-white shadow-md hover:shadow-lg hover:from-[var(--primary-700)] hover:to-[var(--primary-600)] active:from-[var(--primary-800)] active:to-[var(--primary-700)] transform hover:-translate-y-0.5 transition-all duration-300",
        "gradient-secondary": "bg-gradient-to-r from-[var(--teal-600)] to-[var(--teal-500)] text-white shadow-md hover:shadow-lg hover:from-[var(--teal-700)] hover:to-[var(--teal-600)] active:from-[var(--teal-800)] active:to-[var(--teal-700)] transform hover:-translate-y-0.5 transition-all duration-300",
        subtle: "bg-[var(--primary-50)] text-[var(--primary-700)] hover:bg-[var(--primary-100)] active:bg-[var(--primary-200)] dark:bg-[var(--primary-900)]/30 dark:text-[var(--primary-300)] dark:hover:bg-[var(--primary-900)]/50",
        "subtle-secondary": "bg-[var(--teal-50)] text-[var(--teal-700)] hover:bg-[var(--teal-100)] active:bg-[var(--teal-200)] dark:bg-[var(--teal-900)]/30 dark:text-[var(--teal-300)] dark:hover:bg-[var(--teal-900)]/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-8 has-[>svg]:px-6 text-base",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      disabled={disabled || isLoading}
      data-slot="button"
      {...props}
    >
      {isLoading ? (
        <div className="inline-flex items-center">
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          {children}
        </div>
      ) : (
        <div className="inline-flex items-center">
          {leftIcon && <span className="button-icon">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="button-icon">{rightIcon}</span>}
        </div>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
