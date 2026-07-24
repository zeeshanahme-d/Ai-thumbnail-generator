import { ChevronDown } from "lucide-react";
import type { SelectOption, SelectProps } from "../types";

const Select = ({ id, options, value, onChange, className = "", popoverBtnClassName = "" }: SelectProps) => {

    const handleSelect = (option: SelectOption) => {
        onChange(option);

        const popover = document.getElementById(id) as HTMLElement | null;

        if (popover) {
            popover.hidePopover();
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <button
                type="button"
                popoverTarget={id}
                className={`${popoverBtnClassName} flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition gap-1 bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12`}
            >
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        {value.icon}
                        <p className="text-sm font-medium">{value.label}</p>
                    </div>
                    {value.description && (
                        <div>
                            <p className="text-xs text-zinc-400">{value.description}</p>
                        </div>
                    )}
                </div>
                <ChevronDown size={20} className="text-zinc-400" />
            </button>

            <div
                popover="auto"
                id={id}
                className="popover-thumbnail-style rounded-lg border border-white/12 bg-black/20 backdrop-blur-3xl shadow-lg"
            >
                {options.map((option) => (
                    <button
                        type="button"
                        key={option.label}
                        onClick={() => handleSelect(option)}
                        className="flex text-white w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-black/30"
                    >
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                                {option.icon}
                                <p className="text-sm font-medium">{option.label}</p>
                            </div>
                            {option.description && (
                                <div>
                                    <p className="text-xs text-zinc-400">{option.description}</p>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Select;
