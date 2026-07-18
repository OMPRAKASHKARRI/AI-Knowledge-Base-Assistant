const Loader = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400" role="status">
    <svg className="animate-spin h-6 w-6 text-ledger-500" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <span className="text-sm">{label}</span>
  </div>
);

export default Loader;
