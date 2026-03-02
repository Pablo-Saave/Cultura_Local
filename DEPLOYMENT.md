# 🚀 Guía de Deployment - Fundación Cultura Local

Esta guía te ayudará a subir tu aplicación a internet paso a paso.

## 📋 Tabla de Contenidos
1. [Preparación](#preparación)
2. [Opción 1: Render (Recomendado - Gratis)](#opción-1-render)
3. [Opción 2: Vercel + Railway](#opción-2-vercel--railway)
4. [Opción 3: Netlify + Render](#opción-3-netlify--render)
5. [Configurar MongoDB Atlas](#configurar-mongodb-atlas)
6. [Variables de Entorno](#variables-de-entorno)
7. [Probar el Deployment](#probar-el-deployment)

---

## 🎯 Preparación

### 1. Crear cuenta en MongoDB Atlas (Base de Datos)

**MongoDB Atlas es OBLIGATORIO** - tu base de datos local no funcionará en internet.

1. Ve a [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (elige la opción **FREE - M0**)
4. Configuración del cluster:
   - Provider: AWS
   - Region: **us-east-1** (más cercana)
   - Tier: M0 Sandbox (Free)
5. Crea un usuario de base de datos:
   - Click en **Database Access** → **Add New Database User**
   - Username: `cultura_local_user`
   - Password: **Genera una contraseña segura** (guárdala, la necesitarás)
   - Rol: **Atlas admin**
6. Permitir acceso desde cualquier IP:
   - Click en **Network Access** → **Add IP Address**
   - Click en **Allow Access From Anywhere** (0.0.0.0/0)
   - Click **Confirm**
7. Obtener la URI de conexión:
   - Click en **Database** → **Connect** → **Connect your application**
   - Copia la URI (se ve así): 
     ```
     mongodb+srv://cultura_local_user:<password>@cluster0.xxxxx.mongodb.net/cultura_local?retryWrites=true&w=majority
     ```
   - **IMPORTANTE**: Reemplaza `<password>` con la contraseña que creaste
   - Guarda esta URI, la necesitarás después

---

## 🟢 Opción 1: Render (Recomendado - Todo en un lugar)

### ¿Por qué Render?
- ✅ Plan gratuito generoso
- ✅ Deploy automático desde GitHub
- ✅ Frontend y Backend en un solo lugar
- ✅ HTTPS automático
- ⚠️ Los servicios gratis se "duermen" después de 15 min de inactividad

### Paso 1: Preparar el código

1. Asegúrate de que todos los cambios estén guardados
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Preparar para deployment"
   git push origin main
   ```

### Paso 2: Deploy del Backend

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en **New** → **Web Service**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Name**: `cultura-local-backend`
   - **Region**: Oregon (US West)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Variables de Entorno** (click en "Advanced"):
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGO_URI` | Tu URI de MongoDB Atlas (del paso anterior) |
   | `JWT_SECRET` | `tu_secreto_super_seguro_cambialo_123!@#` |
   | `CORS_ORIGIN` | (déjalo vacío por ahora, lo llenas cuando tengas el URL del frontend) |

6. Click **Create Web Service**
7. Espera 5-10 minutos a que se complete el deploy
8. **Guarda la URL** que te da Render (ej: `https://cultura-local-backend.onrender.com`)
9. Verifica que funcione: abre `https://tu-backend.onrender.com/api/health`

### Paso 3: Deploy del Frontend

1. En Render, click **New** → **Static Site**
2. Conecta el mismo repositorio
3. Configuración:
   - **Name**: `cultura-local-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Variable de Entorno**:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | URL de tu backend (del Paso 2) |

5. Click **Create Static Site**
6. Espera a que se complete el deploy
7. **Guarda la URL** del frontend (ej: `https://cultura-local-frontend.onrender.com`)

### Paso 4: Actualizar CORS del Backend

1. Vuelve a tu servicio de backend en Render
2. Ve a **Environment** → **Environment Variables**
3. Edita `CORS_ORIGIN` y ponle la URL de tu frontend
4. Guarda los cambios (esto reiniciará automáticamente el backend)

### ✅ ¡Listo! Tu aplicación está en línea

---

## 🔵 Opción 2: Vercel (Frontend) + Railway (Backend)

### ¿Por qué esta combinación?
- ✅ Vercel es súper rápido para React
- ✅ Railway es fácil de usar para backends
- ✅ Ambos tienen planes gratuitos
- ⚠️ Railway free tier es limitado ($5/mes de créditos)

### Paso 1: Deploy Backend en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta (usa GitHub)
3. Click **New Project** → **Deploy from GitHub repo**
4. Selecciona tu repositorio `Cultura_Local`
5. Click en **Add variables**:
   
   | Variable | Valor |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `8080` |
   | `MONGO_URI` | Tu URI de MongoDB Atlas |
   | `JWT_SECRET` | `tu_secreto_super_seguro` |
   | `CORS_ORIGIN` | (vacío por ahora) |

6. En **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
7. Click **Deploy**
8. Obtén la URL pública: **Settings** → **Generate Domain**
9. Guarda la URL (ej: `https://cultura-local-backend.up.railway.app`)

### Paso 2: Deploy Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta (usa GitHub)
3. Click **Add New** → **Project**
4. Importa tu repositorio `Cultura_Local`
5. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables**:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | URL de tu backend de Railway |

7. Click **Deploy**
8. Guarda tu URL (ej: `https://cultura-local.vercel.app`)

### Paso 3: Actualizar CORS

1. Vuelve a Railway
2. Ve a tu proyecto de backend → **Variables**
3. Edita `CORS_ORIGIN` con la URL de Vercel
4. Guarda (se redeploy automáticamente)

---

## 🟠 Opción 3: Netlify (Frontend) + Render (Backend)

Similar a la Opción 2 pero usando Netlify para el frontend.

### Deploy Frontend en Netlify

1. Ve a [netlify.com](https://www.netlify.com)
2. Crea una cuenta
3. Click **Add new site** → **Import an existing project**
4. Conecta GitHub y selecciona tu repo
5. Configuración:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. **Environment variables**:
   - `VITE_API_URL`: URL de tu backend
7. Click **Deploy site**

Para el backend, sigue los pasos de la Opción 1 (Render Backend).

---

## 🔐 Variables de Entorno - Resumen

### Backend (.env en producción)

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cultura_local
JWT_SECRET=un_secreto_muy_seguro_y_largo
CORS_ORIGIN=https://tu-frontend.com
```

### Frontend (Variables de entorno en Vercel/Netlify/Render)

```env
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 🧪 Probar el Deployment

1. **Health Check del Backend**: 
   - Abre: `https://tu-backend.com/api/health`
   - Deberías ver: `{"success": true, "message": "Servidor funcionando correctamente"}`

2. **Frontend**:
   - Abre tu URL del frontend
   - Verifica que carguen:
     - ✅ Página de inicio
     - ✅ Eventos
     - ✅ Proyectos
     - ✅ Blog

3. **Admin**:
   - Ve a `/admin/login`
   - Intenta hacer login
   - Si funciona, ¡todo está bien! 🎉

---

## 🔧 Troubleshooting

### Error: "CORS policy"
- Verifica que `CORS_ORIGIN` en el backend tenga la URL correcta del frontend
- No incluyas "/" al final de la URL

### Error: "Failed to fetch" o "Network Error"
- Verifica que `VITE_API_URL` en el frontend tenga la URL correcta del backend
- Asegúrate de que el backend esté corriendo (revisa logs)

### Error: "MongoNetworkError"
- Verifica que la URI de MongoDB sea correcta
- Verifica que hayas permitido acceso desde cualquier IP (0.0.0.0/0) en MongoDB Atlas

### El sitio carga muy lento
- En Render free tier, los servicios se "duermen" después de 15 min
- La primera carga puede tardar 30-60 segundos
- Considera usar un plan de pago si necesitas alta disponibilidad

### Las imágenes no cargan
- Asegúrate de que las imágenes estén en el repositorio
- En servicios gratuitos, las imágenes subidas se borran al redeployar
- Considera usar un servicio de almacenamiento como Cloudinary o AWS S3

---

## 📱 Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: `www.culturallocal.com`):

1. Compra un dominio en [Namecheap](https://www.namecheap.com) o [Google Domains](https://domains.google)
2. En Render/Vercel/Netlify:
   - Ve a **Settings** → **Custom Domains**
   - Agrega tu dominio
   - Sigue las instrucciones para configurar DNS

---

## 💰 Costos Estimados

### Totalmente Gratis (bueno para empezar):
- Frontend: Vercel/Netlify (Free)
- Backend: Render (Free)
- Database: MongoDB Atlas (Free - 512MB)

**Limitaciones**:
- Backend se duerme después de 15 min de inactividad
- 512MB de almacenamiento en DB
- Ancho de banda limitado

### Plan Económico (~$7-10/mes):
- Frontend: Vercel/Netlify (Free)
- Backend: Render Starter ($7/mes) - siempre activo
- Database: MongoDB Atlas (Free)

### Plan Profesional (~$20-30/mes):
- Frontend: Vercel Pro ($20/mes)
- Backend: Render Standard ($15/mes)
- Database: MongoDB Atlas Shared ($9/mes - 2GB)
- Almacenamiento: Cloudinary/AWS S3

---

## 🎬 Próximos Pasos

1. **Monitoreo**: Configura [UptimeRobot](https://uptimerobot.com) (gratis) para que "despierte" tu backend cada 5 minutos
2. **Analytics**: Agrega Google Analytics para ver visitantes
3. **SEO**: Optimiza meta tags y sitemap
4. **Backups**: Configura backups automáticos en MongoDB Atlas

---

## ❓ Soporte

Si tienes problemas:
1. Revisa los logs en la plataforma que uses (Render/Vercel/etc)
2. Verifica las variables de entorno
3. Prueba el health check del backend
4. Revisa la consola del navegador (F12) para errores

---

## 📚 Recursos Útiles

- [Documentación de Render](https://render.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

¡Felicitaciones! 🎉 Tu aplicación está en internet y accesible para todo el mundo.
