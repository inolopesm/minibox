export type InputProps = Partial<
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "defaultValue"
    | "disabled"
    | "type"
    | "id"
    | "max"
    | "maxLength"
    | "min"
    | "minLength"
    | "name"
    | "pattern"
    | "placeholder"
    | "required"
    | "title"
    | "value"
    | "autoCapitalize"
    | "inputMode"
    | "autoFocus"
  >
> & {
  onTextChange?: (value: string) => void;
};

export function Input({ onTextChange, ...props }: InputProps) {
  return (
    <input
      className="w-full appearance-none rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 disabled:bg-gray-100"
      onChange={onTextChange ? (e) => onTextChange(e.target.value) : undefined}
      {...props}
    />
  );
}
