# ✅ Checklist de Deployment

Usa esta lista para asegurarte de que has completado todos los pasos necesarios.

## 📝 Antes de Deployar

- [ ] Todos los cambios están guardados (`git add .` + `git commit`)
- [ ] El código funciona localmente (frontend y backend)
- [ ] Tienes cuenta en GitHub y el código está subido
- [ ] Tienes una cuenta de email activa para registros

## 🗄️ Base de Datos (MongoDB Atlas)

- [ ] Cuenta creada en [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Cluster creado (Free Tier - M0)
- [ ] Usuario de base de datos creado
- [ ] Contraseña guardada de forma segura
- [ ] IP 0.0.0.0/0 agregada a Network Access
- [ ] URI de conexión copiada y guardada
- [ ] `<password>` reemplazado en la URI

## 🔙 Backend

### Si usas Render:
- [ ] Cuenta creada en [render.com](https://render.com)
- [ ] Nuevo Web Service creado
- [ ] Repositorio conectado
- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] Variables de entorno configuradas:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGO_URI=` (tu URI de MongoDB)
  - [ ] `JWT_SECRET=` (algo seguro)
  - [ ] `CORS_ORIGIN=` (dejar vacío inicialmente)
- [ ] Deploy completado exitosamente
- [ ] URL del backend guardada
- [ ] Health check funciona: `https://tu-backend.com/api/health`

### Si usas Railway:
- [ ] Cuenta creada en [railway.app](https://railway.app)
- [ ] Proyecto creado desde GitHub
- [ ] Variables de entorno configuradas
- [ ] Root Directory = `backend`
- [ ] Dominio público generado
- [ ] URL guardada

## 🎨 Frontend

### Si usas Render:
- [ ] Nuevo Static Site creado
- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm install && npm run build`
- [ ] Publish Directory = `dist`
- [ ] Variable `VITE_API_URL=` (URL del backend)
- [ ] Deploy completado
- [ ] URL del frontend guardada
- [ ] Sitio carga correctamente

### Si usas Vercel:
- [ ] Cuenta creada en [vercel.com](https://vercel.com)
- [ ] Proyecto importado
- [ ] Framework = Vite
- [ ] Root Directory = `frontend`
- [ ] Variable `VITE_API_URL=` (URL del backend)
- [ ] Deploy completado
- [ ] URL guardada

### Si usas Netlify:
- [ ] Cuenta creada en [netlify.com](https://netlify.com)
- [ ] Sitio creado desde GitHub
- [ ] Base directory = `frontend`
- [ ] Build command = `npm run build`
- [ ] Publish directory = `frontend/dist`
- [ ] Variable `VITE_API_URL` configurada
- [ ] Deploy completado

## 🔗 Conexión Backend-Frontend

- [ ] `CORS_ORIGIN` en backend actualizado con URL del frontend
- [ ] Backend re-deploynado después de actualizar CORS
- [ ] Frontend puede hacer peticiones al backend

## 🧪 Verificación Final

- [ ] Health check funciona: `https://tu-backend.com/api/health`
- [ ] Página de inicio carga
- [ ] Sección de Eventos muestra datos
- [ ] Sección de Proyectos muestra datos
- [ ] Sección de Blog muestra datos
- [ ] Login de admin funciona (`/admin/login`)
- [ ] No hay errores en consola del navegador (F12)
- [ ] No hay errores de CORS

## 📱 URLs Importantes (Guardar)

```
Backend URL: _________________________________

Frontend URL: _________________________________

MongoDB URI: _________________________________

Admin Login: _________________________________/admin/login
```

## 🔐 Credenciales (Guardar de forma segura)

```
MongoDB:
Usuario: _________________________________
Password: _________________________________

Admin App:
Usuario: _________________________________
Password: _________________________________
```

## 🎯 Próximos Pasos (Opcional)

- [ ] Configurar dominio personalizado
- [ ] Agregar Google Analytics
- [ ] Configurar UptimeRobot para mantener backend activo
- [ ] Configurar backups automáticos en MongoDB
- [ ] Agregar SSL (usualmente automático)
- [ ] Optimizar SEO (meta tags, sitemap)

## 🐛 Si algo no funciona

1. [ ] Revisar logs en la plataforma de deploy
2. [ ] Verificar variables de entorno (sin espacios extra)
3. [ ] Verificar que URLs no tengan "/" al final
4. [ ] Abrir consola del navegador (F12) y buscar errores
5. [ ] Probar health check del backend
6. [ ] Verificar Network Access en MongoDB Atlas

---

**Fecha de deployment**: _______________

**Status**: ⬜ En progreso | ⬜ Completado | ⬜ Con errores

**Notas**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
