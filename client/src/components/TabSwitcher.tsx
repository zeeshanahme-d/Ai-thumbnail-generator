import twc from "tw-classnames";

type Tab = {
  label: string;
  count?: number;
};

type TabSwitcherProps = {
  selectedTab: number;
  onSelectTab: (index: number) => void;
  tabs: Tab[];
  className?: string;
};

function TabSwitcher({
  selectedTab,
  onSelectTab,
  tabs,
  className,
}: TabSwitcherProps) {
  return (
    <div
      className={twc(
        "flex items-center bg-[#f4f6f8] rounded-[160px] p-0.75 gap-0 h-8",
        className,
      )}
    >
      {tabs.map((tab, index) => {
        const active = selectedTab === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelectTab(index)}
            className={twc(
              "flex items-center cursor-pointer gap-1.5 px-4 h-5.75 rounded-[50px] text-xs transition-all whitespace-nowrap",
              active
                ? "bg-white font-semibold text-text-primary shadow-sm"
                : "font-normal text-text-secondary",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={twc(
                  "inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-xxs font-medium transition-all",
                  active
                    ? "bg-[#f4f6f8] text-text-primary"
                    : "bg-[#e5e7eb] text-text-secondary",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TabSwitcher;
