import { ClassNames } from "../utils/ClassNames";

export interface AlertProps {
  variant: "error" | "success";
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export function Alert({ variant, onClose, children }: AlertProps) {
  return (
    <div
      className={
        // prettier-ignore
        new ClassNames()
          // prettier-ignore
          .add("border flex gap-2 p-2 rounded")
          // prettier-ignore
          .addIf(variant === "error", "bg-red-50 border-red-300 text-red-800")
          // prettier-ignore
          .addIf(variant === "success", "bg-green-50 border-green-300 text-green-800")
          .toString()
      }
    >
      <div>{children}</div>
      {onClose && (
        <div className="ml-auto">
          <button type="button" onClick={onClose}>
            ✖️
          </button>
        </div>
      )}
    </div>
  );
}
