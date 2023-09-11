export type LabelProps = Pick<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor"
>;

export function Label(props: LabelProps) {
  return (
    <label
      className="block font-medium mb-2 text-gray-700 text-sm"
      {...props}
    />
  );
}
