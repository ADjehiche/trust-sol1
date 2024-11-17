type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function Input({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      className="border border-gray-300 p-2 rounded"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
