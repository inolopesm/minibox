import { Slot } from "@radix-ui/react-slot";

export type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "href"
> & {
  asChild?: boolean;
};

export function Link({ asChild, ...props }: LinkProps) {
  const Component = asChild ? Slot : "a";
  return <Component className="text-blue-600 hover:underline" {...props} />;
}
