# 🚀 INICIO RÁPIDO - Deploy en 3 Pasos

## Opción Más Fácil: Render (Todo Gratis)

### 1️⃣ MongoDB Atlas (5 minutos)

1. Crea cuenta en: https://www.mongodb.com/cloud/atlas
2. Crea cluster GRATIS (M0)
3. Crea usuario y contraseña
4. Permite acceso desde "0.0.0.0/0"
5. Copia la URI de conexión

### 2️⃣ Backend en Render (10 minutos)

1. Crea cuenta en: https://render.com
2. **New → Web Service**
3. Conecta tu GitHub
4. Configuración:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=(tu URI de MongoDB)
   JWT_SECRET=cualquier_texto_secreto_aqui
   ```
6. Click **Create** y espera 5-10 min
7. **Guarda la URL** que te dan

### 3️⃣ Frontend en Render (5 minutos)

1. En Render: **New → Static Site**
2. Mismo repositorio
3. Configuración:
   - Root: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
4. Variable:
   ```
   VITE_API_URL=(URL de tu backend del paso 2)
   ```
5. Click **Create**
6. Espera 5 min

### 4️⃣ Conectar (2 minutos)

1. Vuelve al backend en Render
2. Edita variable `CORS_ORIGIN`
3. Ponle la URL de tu frontend
4. Guarda (espera 2 min a que se actualice)

## ✅ ¡LISTO!

Abre la URL de tu frontend y tu app está en línea 🎉

---

## 📖 Más detalles

- Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa
- Ver [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) para checklist

## ❓ Problemas?

1. ¿Backend no funciona? → Revisa logs en Render
2. ¿CORS error? → Verifica que `CORS_ORIGIN` tenga la URL correcta del frontend
3. ¿No carga datos? → Verifica que `VITE_API_URL` tenga la URL correcta del backend

---

## 🔗 URLs después del deploy

```
Frontend: https://tu-app-XXXXX.onrender.com
Backend: https://tu-backend-XXXXX.onrender.com
Admin: https://tu-app-XXXXX.onrender.com/admin/login
```

## ⏱️ Tiempo total: ~25 minutos

**Costo: $0** (todo gratis)

⚠️ **Nota**: En plan gratis, el backend se "duerme" después de 15 min sin uso. La primera carga puede tardar 30-60 segundos.
