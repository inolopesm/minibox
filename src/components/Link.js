import { Slot } from "@radix-ui/react-slot";

export function Link({ href, children, asChild }) {
  const Component = asChild ? Slot : "a";

  return (
    <Component className="text-blue-600 hover:underline" href={href}>
      {children}
    </Component>
  );
}
