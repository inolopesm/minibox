import { useId } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { HelperText } from "./HelperText";

export function TextField({
  label,
  type,
  name,
  disabled,
  required,
  maxLength,
  pattern,
  title,
  helperText,
  min,
  max,
  placeholder,
  value,
  onTextChange,
}) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onTextChange={onTextChange}
      />
      {!!helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
