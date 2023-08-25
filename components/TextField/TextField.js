import { useId } from "react";
import { Label } from "../Label";
import { Input } from "../Input";

export function TextField({ label, type, name, disabled }) {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} id={id} name={name} disabled={disabled} />
    </div>
  );
}
