import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'

export function Switch({ className = '', checked, defaultChecked, onCheckedChange, ...props }) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'bg-gray-200 data-checked:bg-emerald-600 data-[state=checked]:bg-emerald-600 dark:bg-gray-700 dark:data-checked:bg-emerald-500',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out',
          'translate-x-0 data-checked:translate-x-5 data-[state=checked]:translate-x-5'
        )}
      />
    </SwitchPrimitive.Root>
  )
}
