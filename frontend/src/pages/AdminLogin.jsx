/**
 * AdminLogin.jsx - Página de Login para Administradores
 * Diseño en dos columnas: formulario a la izquierda e ilustración a la derecha.
 * Ilustración: /public/img/login.png
 *
 * Responsive: tamaños compactos por defecto (laptops) y tamaños grandes
 * a partir de 1600px de ancho (monitores grandes).
 */

import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Fondo de la página. Las etiquetas flotantes usan este mismo color para "cortar" el borde.
const BG = 'bg-[#F7F3FB]';

function IconUser() {
  return (
    <svg className="w-4 h-4 shrink-0 min-[1600px]:w-6 min-[1600px]:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="w-4 h-4 shrink-0 min-[1600px]:w-6 min-[1600px]:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function IconEye({ off }) {
  return (
    <svg className="w-4 h-4 min-[1600px]:w-6 min-[1600px]:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Estilos compartidos por los dos campos (forma de píldora, borde lila)
  // Compacto por defecto; tamaño grande desde 1600px
  const fieldWrap = 'relative';
  const fieldLabel =
    `absolute -top-2.5 left-5 px-1.5 text-xs font-medium text-[#4B3B6B] ${BG} ` +
    'min-[1600px]:-top-3 min-[1600px]:left-8 min-[1600px]:px-2 min-[1600px]:text-base';
  const fieldBox =
    'flex items-center gap-3 rounded-full border border-[#C9BEDD] bg-transparent px-5 ' +
    'min-[1600px]:gap-4 min-[1600px]:px-7 ' +
    'text-[#8C7BAF] transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30';
  // Las dos últimas clases quitan el fondo azul que el navegador pone al autocompletar
  const fieldInput =
    'w-full bg-transparent py-3 text-xs text-gray-900 placeholder-gray-400 outline-none disabled:opacity-60 ' +
    'min-[1600px]:py-4 min-[1600px]:text-base ' +
    '[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#F7F3FB] ' +
    '[&:-webkit-autofill]:[-webkit-text-fill-color:#111827]';

  return (
    <div className={`min-h-screen w-full ${BG} flex flex-col lg:flex-row`}>
      {/* ── Columna izquierda: formulario ───────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 lg:px-10 min-[1600px]:px-16 min-[1600px]:py-12">
        <div className="w-full max-w-[390px] min-[1600px]:max-w-xl">
          <h1
            className="mb-8 text-center text-2xl font-bold text-primary-dark min-[1600px]:mb-12 min-[1600px]:text-4xl"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Panel de Administración
          </h1>

          <form onSubmit={handleSubmit} className="space-y-7 min-[1600px]:space-y-10">
            {/* Mensaje de error */}
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700
                           min-[1600px]:px-5 min-[1600px]:py-4 min-[1600px]:text-base"
              >
                {error}
              </div>
            )}

            {/* Usuario */}
            <div className={fieldWrap}>
              <label htmlFor="username" className={fieldLabel}>
                Usuario
              </label>
              <div className={fieldBox}>
                <IconUser />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={fieldInput}
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className={fieldWrap}>
              <label htmlFor="password" className={fieldLabel}>
                Contraseña
              </label>
              <div className={fieldBox}>
                <IconLock />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={fieldInput}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                  className="rounded-full p-1 text-[#8C7BAF] hover:text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <IconEye off={showPassword} />
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-full bg-primary-light/40 py-2.5
                         text-sm font-semibold text-[#4B3B6B] transition-all duration-300
                         hover:bg-primary-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                         disabled:cursor-not-allowed disabled:opacity-60
                         min-[1600px]:py-4 min-[1600px]:text-lg"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin min-[1600px]:mr-3 min-[1600px]:h-5 min-[1600px]:w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="mt-7 text-center min-[1600px]:mt-10">
            <Link
              to="/"
              className="text-xs text-primary-dark transition-colors hover:text-primary hover:underline min-[1600px]:text-base"
            >
              ← Volver al sitio web
            </Link>
          </div>
        </div>
      </main>

      {/* ── Columna derecha: ilustración (solo en pantallas grandes) ── */}
      <aside className="relative hidden flex-1 overflow-hidden lg:block" aria-hidden="true">
        {/* Arco morado de fondo */}
        <div
          className="absolute bottom-0 right-[8%] h-[88%] w-[72%] rounded-t-full
                     bg-gradient-to-b from-primary-light/25 to-primary/40"
        />
        {/* Ilustración: más pequeña y más a la izquierda, sobresale del arco */}
        <div className="absolute bottom-[4%] right-[32%] h-[64%] w-[54%]">
          <img
            src="/img/login.png"
            alt=""
            className="h-full w-full object-contain object-right-bottom"
          />
        </div>
      </aside>
    </div>
  );
}

export default AdminLogin;