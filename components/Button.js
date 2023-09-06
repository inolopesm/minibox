import { Slot } from "@radix-ui/react-slot";
import { ClassNames } from "../utils/ClassNames";

export function Button({
  type,
  onClick,
  disabled,
  children,
  asChild,
  variant = "primary"
}) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={
        new ClassNames()
          .add("inline-block font-medium px-5 py-2.5 border rounded text-sm disabled:cursor-not-allowed")
          .addIf(variant === "primary", "bg-gray-800 text-white border-gray-900 disabled:bg-gray-400 hover:bg-gray-900")
          .addIf(variant === "secondary", "bg-white text-gray-900 border-gray-300 disabled:bg-gray-400 hover:bg-gray-100")
          .toString()
      }
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Component>
  );
}
