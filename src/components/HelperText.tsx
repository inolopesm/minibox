export type HelperTextProps = Pick<
  React.HTMLAttributes<HTMLParagraphElement>,
  "children"
>;

export function HelperText({ children }: HelperTextProps) {
  return <p className="mt-2 text-sm text-gray-500">{children}</p>;
}
