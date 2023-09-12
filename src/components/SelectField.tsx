import { useId } from "react";
import { Label } from "./Label";
import { Select, SelectProps } from "./Select";
import { HelperText } from "./HelperText";

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
