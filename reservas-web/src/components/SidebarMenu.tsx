type MenuOption = {
  name: string;
  content: string;
};

type Props = {
  current: string;
  onChange: (page: string) => void;
  menuOptions: MenuOption[];
};

export default function SidebarMenu({ current, onChange, menuOptions }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">MultiReserve</h2>
      <nav className="flex flex-col gap-2">
        {menuOptions.map((opt) => (
          <button
            key={opt.name}
            className={`text-left p-2 rounded ${
              current === opt.name ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => onChange(opt.name)}
          >
            {opt.content}
          </button>
        ))}
      </nav>
    </div>
  );
}
