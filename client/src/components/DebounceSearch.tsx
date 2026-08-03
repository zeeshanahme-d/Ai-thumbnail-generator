import React, { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import Input from './Input'
import { Search } from 'lucide-react'
import { debounce } from '../lib/herlper-fuctions';

export interface DebounceSearchProps<T extends { [key: string]: any }> {
  setParams: Dispatch<SetStateAction<T>>;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  searchKey?: keyof T;
}
function DebounceSearch<T extends { [key: string]: any }>({ setParams, placeholder = 'Search...', className = "", debounceMs = 600, searchKey = 'search', }: DebounceSearchProps<T>) {

  const [search, setSearch] = useState('');

  const debouncedSetParams = useMemo(() =>
    debounce((value: string) => {
      setParams((prev) => ({ ...prev, [searchKey]: value, page: 1 }));
    }, debounceMs),
    [setParams, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setSearch(next);
    debouncedSetParams(next.trim());
  };
  return (
    <div className="relative flex-1">
      <Input
        icon={Search}
        type="text"
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full ${className}`}
      />
    </div>
  )
}

export default DebounceSearch