'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  id: string;
}

export default function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  id
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const displayValue = value || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    } else if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleSelect(filteredOptions[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-[#9FA38F] mb-2">
        {label}
      </label>

      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
        className="w-full px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus-within:ring-2 focus-within:ring-[#B1E5FF] bg-white cursor-pointer flex items-center justify-between"
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={value ? 'text-[#1A1A1A]' : 'text-[#9FA38F]'}>
          {displayValue}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="text-[#9FA38F] hover:text-[#1A1A1A] p-1"
              aria-label="Clear selection"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg
            className={`w-4 h-4 text-[#9FA38F] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#9FA38F]/20 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-[#9FA38F]/20">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-[#9FA38F]/20 rounded focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
              aria-label={`Search ${label.toLowerCase()}`}
              id={id}
            />
          </div>

          <ul
            className="overflow-y-auto max-h-48"
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 hover:bg-[#F5F5F5] cursor-pointer text-[#1A1A1A]"
                  role="option"
                  aria-selected={value === option}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-[#9FA38F] italic">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
