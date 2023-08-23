interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  return (
    <label
      className="inline-block mb-1"
      {...props}
    />
  );
}
