type ToolButtonProps = {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
};

export const ToolButton = ({
  active,
  title,
  onClick,
  children,
}: ToolButtonProps) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-8 h-8 rounded-full flex items-center justify-center
      ${active ? "bg-white/20" : "hover:bg-white/10"}`}
  >
    {children}
  </button>
);
