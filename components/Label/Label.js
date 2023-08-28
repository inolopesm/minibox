export function Label({ htmlFor, children }) {
  return (
    <label
      className="block font-medium mb-2 text-gray-700 text-sm"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
