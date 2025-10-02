import React from 'react';
import { cn } from '@/utils/cn';

interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ id, checked = false, onCheckedChange, onChange, disabled = false, className, ...props }, ref) => {
    const handleToggle = () => {
      const newChecked = !checked;
      onCheckedChange?.(newChecked);
      onChange?.(newChecked);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked ? "true" : "false"}
        id={id}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary-600" : "bg-secondary-300",
          className
        )}
        disabled={disabled}
        onClick={handleToggle}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";