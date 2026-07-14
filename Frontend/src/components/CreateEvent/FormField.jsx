import React from "react";

const inputCls =
  "input input-bordered w-full bg-base-100 text-sm rounded-lg border border-base-300 focus:outline-primary";

const FormField = ({ label, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold text-base-content/60">{label}</label>
    {children}
  </div>
);

export const InputField = ({ label, className, ...props }) => (
  <FormField label={label} className={className}>
    <input className={inputCls} {...props} />
  </FormField>
);

export const TextareaField = ({ label, className, ...props }) => (
  <FormField label={label} className={className}>
    <textarea
      className="textarea textarea-bordered w-full bg-base-100 text-sm rounded-lg border border-base-300 focus:outline-primary"
      {...props}
    />
  </FormField>
);

export const SelectField = ({ label, options, className, ...props }) => (
  <FormField label={label} className={className}>
    <select
      className="select select-bordered w-full bg-base-100 text-sm rounded-lg border border-base-300 focus:outline-primary"
      {...props}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </FormField>
);

export default FormField;