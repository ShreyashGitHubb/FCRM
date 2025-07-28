import React, { useState, useRef, useEffect } from 'react';

const Select = ({ value, onValueChange, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative" {...props}>
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedValue || 'Select option...'}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectContent) {
              return React.cloneElement(child, { onSelect: handleSelect });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const SelectContent = ({ children, onSelect }) => {
  return (
    <div className="py-1">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { onSelect });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};

const SelectTrigger = ({ children }) => {
  return children;
};

const SelectValue = ({ placeholder }) => {
  return placeholder;
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
