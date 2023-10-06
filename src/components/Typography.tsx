import { ClassNames } from "../utils/ClassNames";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "heading" | "body1" | "body2";
}

export function Typography({
  variant = "body1",
  className = "",
  ...props
}: TypographyProps) {
  return (
    <div
      className={new ClassNames()
        .addIf(className, className)
        .addIf(variant === "heading", "text-xl font-bold")
        .addIf(variant === "body2", "text-sm")
        .toString()}
      {...props}
    />
  );
}
