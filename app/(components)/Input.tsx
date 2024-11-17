type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
};

export default function Input({
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: InputProps) {
  return (
    <input
      className={`w-full border p-2 rounded transition-colors
        ${error ? "border-red-500" : "border-gray-300"}
        ${disabled ? "bg-gray-100" : "bg-white"}
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
