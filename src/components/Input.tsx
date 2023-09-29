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
  >
> & {
  onTextChange?: (value: string) => void;
};

export function Input({ onTextChange, ...props }: InputProps) {
  return (
    <input
      className="border border-gray-300 bg-gray-50 rounded appearance-none text-gray-900 text-sm w-full p-2.5 disabled:bg-gray-100"
      onChange={onTextChange ? (e) => onTextChange(e.target.value) : undefined}
      {...props}
    />
  );
}
