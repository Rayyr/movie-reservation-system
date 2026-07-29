 

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={`dropdownContent ${className}`}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
 

export const DropdownMenuItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={`dropdownItem ${className}`}
      {...props}
    />
  )
);