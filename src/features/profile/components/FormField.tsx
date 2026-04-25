interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  maxLength?: number;
  placeholder?: string;
}

export const FormField = ({
  label, value, onChange, prefix, maxLength, placeholder
}: FormFieldProps) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[10px] uppercase tracking-[0.25em] 
                        text-rw-muted font-semibold">
        {label}
      </label>
      {maxLength && (
        <span className="text-[10px] text-rw-dim tabular-nums">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 
                         text-rw-muted font-medium pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full h-11 bg-rw-surface border border-rw-border 
                    rounded-xl text-rw-text font-medium
                    ${prefix ? 'pl-9' : 'pl-4'} pr-4
                    placeholder:text-rw-dim
                    focus:outline-none focus:border-rw-sky 
                    focus:shadow-rw-glow-sm transition-all`}
      />
    </div>
  </div>
);

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
}

export const FormTextarea = ({
  label, value, onChange, maxLength, placeholder, rows = 3
}: FormTextareaProps) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[10px] uppercase tracking-[0.25em] 
                        text-rw-muted font-semibold">
        {label}
      </label>
      {maxLength && (
        <span className="text-[10px] text-rw-dim tabular-nums">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-4 bg-rw-surface border border-rw-border 
                 rounded-xl text-rw-text font-medium resize-none
                 placeholder:text-rw-dim
                 focus:outline-none focus:border-rw-sky 
                 focus:shadow-rw-glow-sm transition-all"
    />
  </div>
);
