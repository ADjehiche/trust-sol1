type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({ onClick, children, disabled, loading }: ButtonProps) {
  return (
    <button
      className={`w-full bg-blue-500 text-white py-2 px-4 rounded transition-colors
        ${disabled || loading ? "bg-blue-300 cursor-not-allowed" : "hover:bg-blue-600"}
        ${loading ? "opacity-75" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
