import { Link, useLocation } from 'react-router-dom';
import { IconBlog, IconEventos, IconProyectos } from './AdminLayout';

const SECTIONS = [
  { label: 'Proyectos', path: '/admin/proyectos', icon: IconProyectos },
  { label: 'Eventos', path: '/admin/eventos', icon: IconEventos },
  { label: 'Blogs', path: '/admin/blog', icon: IconBlog },
];

function AdminContentHeader({ title, description, actionLabel, onAction }) {
  const { pathname } = useLocation();
  const activeIcon = SECTIONS.find(section => section.path === pathname)?.icon || IconProyectos;
  const ActiveIcon = activeIcon;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25">
            <ActiveIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-primary-dark sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button onClick={onAction} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40">
          <span aria-hidden="true">+</span>{actionLabel}
        </button>
      </div>
      <nav aria-label="Administrar contenido" className="mb-5 flex gap-2 overflow-x-auto rounded-2xl bg-white/70 p-1.5 ring-1 ring-primary/10">
        {SECTIONS.map(({ label, path, icon: SectionIcon }) => {
          const active = pathname === path;
          return <Link key={path} to={path} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-primary/10'}`}>
            <SectionIcon className="h-4 w-4" />{label}
          </Link>;
        })}
      </nav>
    </>
  );
}

export default AdminContentHeader;
