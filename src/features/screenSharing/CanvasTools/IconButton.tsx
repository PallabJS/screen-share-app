type IconButtonProps = {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
};

export const IconButton = ({
  title,
  onClick,
  active,
  children,
}: IconButtonProps) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-8 h-8 rounded-full flex items-center justify-center
      hover:bg-zinc-600/50 ${active ? "bg-zinc-700/50" : ""}`}
  >
    {children}
  </button>
);
