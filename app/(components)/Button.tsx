type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export default function Button({ onClick, children, disabled }: ButtonProps) {
  return (
    <button
      className={`w-full bg-blue-500 text-white py-2 px-4 rounded transition-colors
        ${disabled ? "bg-blue-300 cursor-not-allowed" : "hover:bg-blue-600"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
