interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      className="border border-gray-900 rounded px-4 py-3 w-full bg-gray-50 disabled:bg-gray-100"
      {...props}
    />
  );
}
