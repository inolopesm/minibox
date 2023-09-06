import { Slot } from "@radix-ui/react-slot";

export function Button({ type, onClick, disabled, children, asChild }) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className="bg-gray-800 font-medium px-5 py-2.5 rounded text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-gray-900"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Component>
  );
}
