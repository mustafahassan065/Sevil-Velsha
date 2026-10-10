import { Link } from 'react-router-dom';

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`font-serif text-lg tracking-[0.3em] text-[#0D3045] ${className}`}>
      SEAGLORÉ
    </Link>
  );
}

export function Page({ children, className = '' }) {
  return <div className={`min-h-screen bg-[#FAF5EC] text-[#16324A] ${className}`}>{children}</div>;
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl bg-[#FFFDF9] p-6 shadow-sm sm:p-8 ${className}`}>{children}</div>;
}

// Login / signup jaise pages ka centered card
export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <Page className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo />
        </div>
        <Card>
          <h1 className="font-serif text-2xl font-normal text-[#16324A] sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-[#6E7B82]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
        {footer && <div className="mt-5 text-center text-sm text-[#6E7B82]">{footer}</div>}
      </div>
    </Page>
  );
}

const VARIANTS = {
  primary: 'bg-[#1E4D6B] text-white hover:bg-[#16324A]',
  outline: 'border border-[#1E4D6B] text-[#1E4D6B] hover:bg-[#1E4D6B]/5',
  ghost: 'text-[#1E4D6B] hover:bg-[#1E4D6B]/5',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

export function Button({ variant = 'primary', className = '', as: As = 'button', ...props }) {
  return (
    <As
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

const fieldClass =
  'mt-1 w-full rounded-xl border border-[#D9D2C3] bg-white px-4 py-3 text-sm text-[#16324A] outline-none focus:border-[#1E4D6B]';

export function Input({ label, hint, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-[#16324A]">
      {label}
      <input className={`${fieldClass} ${className}`} {...props} />
      {hint && <span className="mt-1 block text-xs font-normal text-[#6E7B82]">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, hint, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-[#16324A]">
      {label}
      <textarea className={`${fieldClass} ${className}`} {...props} />
      {hint && <span className="mt-1 block text-xs font-normal text-[#6E7B82]">{hint}</span>}
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-[#16324A]">
      {label}
      <select className={`${fieldClass} ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-start gap-3 text-sm text-[#16324A]">
      <input type="checkbox" className="mt-1 h-4 w-4 accent-[#1E4D6B]" {...props} />
      <span>{label}</span>
    </label>
  );
}

const NOTICE = {
  info: 'bg-[#E9F1F6] text-[#16324A]',
  success: 'bg-[#E6F3EC] text-[#1F5C3F]',
  error: 'bg-[#FBE9E7] text-[#9B2C20]',
};

export function Notice({ type = 'info', children }) {
  if (!children) return null;
  return <div className={`rounded-xl px-4 py-3 text-sm ${NOTICE[type]}`}>{children}</div>;
}

export function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-10 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E4D6B]/20 border-t-[#1E4D6B]" />
    </div>
  );
}

export function Badge({ children, tone = 'navy' }) {
  const tones = {
    navy: 'bg-[#1E4D6B] text-white',
    gold: 'bg-[#C9A24B] text-white',
    soft: 'bg-[#E9F1F6] text-[#1E4D6B]',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}>
      {children}
    </span>
  );
}