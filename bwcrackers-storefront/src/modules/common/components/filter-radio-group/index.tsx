import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"
import { LucideIcon } from "lucide-react"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
    icon?: LucideIcon
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      <Text className="text-sm font-semibold text-gray-900">{title}</Text>

      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        {items?.map((i) => {
          const IconComponent = i.icon
          const isActive = i.value === value

          return (
            <div
              key={i.value}
              className={clx(
                "flex gap-x-3 items-center px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer",
                isActive
                  ? "border-orange-400 bg-orange-50 shadow-sm"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
              )}
            >
              {isActive && (
                <EllipseMiniSolid className="text-orange-500 flex-shrink-0" />
              )}

              {IconComponent && (
                <IconComponent
                  className={clx(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-orange-500" : "text-gray-400"
                  )}
                />
              )}

              <RadioGroup.Item
                checked={isActive}
                className="hidden peer"
                id={i.value}
                value={i.value}
              />

              <Label
                htmlFor={i.value}
                className={clx(
                  "!txt-compact-small font-medium hover:cursor-pointer",
                  isActive ? "text-gray-900" : "text-gray-600"
                )}
                data-testid="radio-label"
                data-active={isActive}
              >
                {i.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
