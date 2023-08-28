import { ClassNames } from "../utils/ClassNames";

export function Alert({ variant, onClose, children }) {
  return (
    <div
      className={
        new ClassNames()
          .add("border flex gap-2 p-2 rounded")
          .addIf(variant === "error", "bg-red-50 border-red-300 text-red-800")
          .addIf(variant === "success", "bg-green-50 border-green-300 text-green-800")
          .toString()
      }
    >
      <div>{children}</div>
      {onClose && (
        <div className="ml-auto">
          <button type="button" onClick={onClose}>✖️</button>
        </div>
      )}
    </div>
  );
}
