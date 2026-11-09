function AdminContentHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold leading-tight text-primary-dark sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <button onClick={onAction} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40">
        <span aria-hidden="true">+</span>{actionLabel}
      </button>
    </div>
  );
}

export default AdminContentHeader;
