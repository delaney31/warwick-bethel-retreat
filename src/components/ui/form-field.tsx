import { cn } from "@/lib/utils/cn";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

interface InputProps extends BaseProps, React.InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface TextareaProps extends BaseProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

interface SelectProps extends BaseProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  children: React.ReactNode;
}

type FormFieldProps = InputProps | TextareaProps | SelectProps;

export function FormField(props: FormFieldProps) {
  const { label, error, hint, className, as = "input" } = props;
  const id = props.id ?? props.name;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-widest text-stone-500">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          {...(props as TextareaProps)}
          id={id}
          className={cn(
            "w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-900 shadow-sm transition focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      ) : as === "select" ? (
        <select
          {...(props as SelectProps)}
          id={id}
          className={cn(
            "w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-900 shadow-sm transition focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200",
            error && "border-red-400",
          )}
        >
          {(props as SelectProps).children}
        </select>
      ) : (
        <input
          {...(props as InputProps)}
          id={id}
          className={cn(
            "w-full rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-900 shadow-sm transition focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          )}
        />
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}
