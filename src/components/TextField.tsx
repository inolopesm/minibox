import { useId } from "react";
import { HelperText } from "./HelperText";
import { Input, type InputProps } from "./Input";
import { Label } from "./Label";

export type TextFieldProps = Omit<InputProps, "id"> & {
  label: string;
  helperText?: string;
};

export function TextField({ label, helperText, ...props }: TextFieldProps) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      {!!helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
