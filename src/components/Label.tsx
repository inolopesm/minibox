import { Slot } from "@radix-ui/react-slot";

export type LabelProps = Pick<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor"
> & { asChild?: boolean };

export function Label({ asChild, ...props }: LabelProps) {
  const Component = asChild ? Slot : "label";

  return (
    <Component
      className="block font-medium mb-2 text-gray-700 text-sm"
      {...props}
    />
  );
}
