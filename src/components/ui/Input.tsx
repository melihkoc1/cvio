import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Input({ label, helperText, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
