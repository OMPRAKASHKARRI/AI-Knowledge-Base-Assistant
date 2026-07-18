import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, error, id, ...props }: InputProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <input id={inputId} className="input-field" aria-invalid={!!error} {...props} />
      {error && <p className="mt-1.5 text-sm text-signal-error">{error}</p>}
    </div>
  );
};

export default Input;
