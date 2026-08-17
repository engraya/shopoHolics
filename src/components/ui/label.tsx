import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Deliberately a plain <label> rather than @radix-ui/react-label: the only
 * thing Radix adds here is click-forwarding to the control, which a native
 * `htmlFor` already does. This keeps the class string identical to the raw
 * labels used in the existing auth and profile forms.
 */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
