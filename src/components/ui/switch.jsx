import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

export function Switch({ className = '', ...props }) {
  return (
    <SwitchPrimitive.Root
      className={`flex h-6 w-11 shrink-0 rounded-full border border-gray-300 bg-gray-200 p-0.5 transition-colors data-checked:border-gray-900 data-checked:bg-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-5 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-5" />
    </SwitchPrimitive.Root>
  )
}
