import React from "react";
import { Select } from "../UI";
import { APP_STYLES } from "../../theme/styles";

export interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className={APP_STYLES.CALENDARIO.filterDropdown}>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
};
