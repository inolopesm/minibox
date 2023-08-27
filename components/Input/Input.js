export function Input({
  type,
  id,
  name,
  disabled,
  required,
  maxLength,
  pattern,
  title,
  placeholder,
  minLength,
}) {
  return (
    <input
      className="border border-gray-300 bg-gray-50 rounded text-gray-900 text-sm w-full p-2.5 disabled:bg-gray-100"
      type={type}
      id={id}
      name={name}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      pattern={pattern}
      title={title}
      placeholder={placeholder}
      minLength={minLength}
    />
  );
}
