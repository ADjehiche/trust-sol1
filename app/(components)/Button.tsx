type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
