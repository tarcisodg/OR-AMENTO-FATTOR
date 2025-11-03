import React from 'react';

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  // FIX: Replaced `JSX.Element` with `React.ReactElement` to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  type?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, placeholder, icon, type = 'number' }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
          placeholder={placeholder}
          min={type === 'number' ? "0" : undefined}
        />
      </div>
    </div>
  );
};

export default InputGroup;