type AlertProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export default function Alert({ message, type = "info", onClose }: AlertProps) {
  const bgColors = {
    success: "bg-primary-400",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`flex items-center gap-4 ${bgColors[type]} text-white py-4 px-4 rounded-xl`}
    >
      <button onClick={onClose} className="text-white font-bold cursor-pointer">
        ✕
      </button>
      <span>{message}</span>
    </div>
  );
}
