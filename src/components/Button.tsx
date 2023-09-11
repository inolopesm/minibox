import { Slot } from "@radix-ui/react-slot";
import { ClassNames } from "../utils/ClassNames";

export type ButtonProps = Partial<
  Pick<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "disabled" | "onClick" | "type"
  >
> & {
  variant?: "primary" | "secondary";
  asChild?: boolean;
};

export function Button({
  variant = "primary",
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={
        // prettier-ignore
        new ClassNames()
          // prettier-ignore
          .add("inline-block font-medium px-5 py-2.5 border rounded text-sm disabled:cursor-not-allowed")
          // prettier-ignore
          .addIf(variant === "primary", "bg-gray-800 text-white border-gray-900 disabled:bg-gray-400 hover:bg-gray-900")
          // prettier-ignore
          .addIf(variant === "secondary", "bg-white text-gray-900 border-gray-300 disabled:bg-gray-400 hover:bg-gray-100")
          .toString()
      }
      {...props}
    />
  );
}
