import { useId } from "react";
import { HelperText } from "./HelperText";
import { Label } from "./Label";
import { Select, type SelectProps } from "./Select";

export type SelectFieldProps = Omit<SelectProps, "id"> & {
  label: string;
  helperText?: string;
};

export function SelectField({ label, helperText, ...props }: SelectFieldProps) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} {...props} />
      {!!helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
