interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: ButtonProps) {
  return (
    <button
      className="border border-gray-900 rounded py-3 px-4 bg-gray-900 text-gray-50 hover:bg-gray-800 transition disabled:bg-gray-700"
      {...props}
    />
  );
}
