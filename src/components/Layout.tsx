import { ClassNames } from "../utils/ClassNames";

export interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "2xl";
}

export function Layout({ children, maxWidth = "xs" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900">
      <div
        className={new ClassNames()
          .add("mx-auto grid gap-4 bg-white p-6 shadow")
          .add("rounded border border-gray-200")
          .addIf(maxWidth === "xs", "max-w-xs")
          .addIf(maxWidth === "2xl", "max-w-2xl")
          .toString()}
      >
        {children}
      </div>
    </div>
  );
}
