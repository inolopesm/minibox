import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

export type SelectProps = Partial<
  Pick<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "disabled" | "id" | "name" | "required" | "title"
  >
> & {
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
};

export function Select({ onValueChange, ...props }: SelectProps) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (onValueChange) onValueChange(e.target.value);
  };

  return (
    <div className="relative">
      <select
        className="border border-gray-300 bg-gray-50 rounded text-gray-900 text-sm w-full p-2.5 pr-8 appearance-none disabled:bg-gray-100"
        onChange={handleChange}
        {...props}
      />
      <div className="absolute top-0 right-2 h-full flex items-center">
        <ChevronDownIcon className="h-5" />
      </div>
    </div>
  );
}
