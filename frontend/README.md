# Fundación Cultura Local - Frontend

Aplicación web moderna para la Fundación Cultura Local, desarrollada con React, Vite y Tailwind CSS.

## Características

- Diseño moderno y responsive basado en el mockup proporcionado
- Modo oscuro completo con persistencia en localStorage
- Sistema de rutas con React Router
- Componentes reutilizables y bien documentados
- Tailwind CSS para estilos con configuración personalizada
- Transiciones y animaciones suaves

## Tecnologías

- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Google Fonts (Inter y Playfair Display)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar servidor de desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador:
```
http://localhost:5173
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
│   ├── Navbar.jsx   # Barra de navegación con modo oscuro
│   └── Footer.jsx   # Pie de página
├── pages/           # Páginas de la aplicación
│   ├── Home.jsx     # Página de inicio
│   ├── Publicaciones.jsx  # Galería de publicaciones (página principal)
│   ├── Eventos.jsx  # Listado de eventos
│   ├── Blog.jsx     # Blog cultural
│   ├── Contacto.jsx # Información de contacto
│   ├── Practicas.jsx # Prácticas culturales
│   └── Proyectos.jsx # Galería de proyectos
├── App.jsx          # Componente principal con rutas
├── main.jsx         # Punto de entrada
└── index.css        # Estilos globales con Tailwind

## Rutas

- `/` - Página de inicio
- `/presentacion` - Presentación de la fundación
- `/publicaciones` - Galería de publicaciones (diseño principal)
- `/eventos` - Eventos culturales
- `/blog` - Blog y noticias
- `/contacto` - Información de contacto
- `/practicas` - Prácticas culturales
- `/proyectos` - Galería de proyectos

## Modo Oscuro

El modo oscuro se implementa usando:
- Clase `dark` en el elemento HTML
- Tailwind CSS dark mode class strategy
- Estado global en App.jsx
- Persistencia en localStorage
- Botón toggle en Navbar

## Personalización de Colores

Los colores están definidos en `tailwind.config.js`:

- **Primary**: Morado (#7E57C2) - Color principal de la marca
- **Accent**: Dorado (#D4AF37) - Para botones y acentos
- **Dark**: Tonos oscuros para el modo oscuro

## Comentarios en el Código

Todo el código está completamente comentado explicando:
- Qué hace cada componente
- Para qué sirve cada hook y función
- La estructura y propósito de cada sección
- Las clases de Tailwind y su efecto visual

## Próximos Pasos

- Conectar con el backend para datos dinámicos
- Implementar formulario de contacto funcional
- Agregar imágenes reales en las publicaciones
- Implementar sistema de autenticación
- Agregar más animaciones y transiciones

