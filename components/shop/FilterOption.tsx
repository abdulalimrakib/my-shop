import React, { useId } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface Props {
  value: string;
  label?: string;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

// A checkbox that adds/removes its value from a multi-select filter
const FilterOption = ({ value, label, selected, setSelected }: Props) => {
  // Generated so the same list can render twice (sidebar + mobile sheet)
  const id = useId();
  const isSelected = selected.includes(value);

  const toggle = () =>
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={isSelected}
        onCheckedChange={toggle}
        className="rounded-sm hover:cursor-pointer data-[state=checked]:bg-shop_dark_green data-[state=checked]:border-shop_dark_green"
      />
      <Label
        htmlFor={id}
        className={`hover:cursor-pointer ${isSelected ? "font-semibold text-shop_dark_green" : "font-normal"}`}
      >
        {label}
      </Label>
    </div>
  );
};

export default FilterOption;
