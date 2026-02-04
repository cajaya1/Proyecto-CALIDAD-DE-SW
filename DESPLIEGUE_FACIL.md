# 🚀 Guía Fácil de Despliegue - Vercel + Render

## Paso 1: Frontend en Vercel ✅

1. Entra a **https://vercel.com**
2. Sign in con GitHub
3. Click en "Import Project"
4. Selecciona tu repo: `Proyecto-CALIDAD-DE-SW`
5. En **Root Directory**: escribe `tennis-frontend`
6. Click "Deploy"
7. Espera a que termine (2-5 minutos)
8. **Copia la URL** que te genera (ej: `https://tennis-frontend-xyz.vercel.app`)
9. 

---

## Paso 2: Backend en Render ✅

1. Entra a **https://render.com**
2. Click "New +"
3. Selecciona "Web Service"
4. Conecta tu repo GitHub
5. En el formulario:
   - **Name**: `tennis-store-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Advanced"
7. Agrega **Environment Variables**:
   - `DB_HOST` = `localhost` (o tu IP si usas BD local)
   - `DB_USER` = `root`
   - `DB_PASSWORD` = (tu contraseña)
   - `DB_NAME` = `tenis_store`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = un valor seguro (ej: `super_secreto_123`)
   - `PORT` = `3000`
8. Click "Create Web Service"
9. Espera a que termine el build (3-10 minutos)
10. **Copia la URL** que aparece (ej: `https://tennis-store-backend.onrender.com`)

---

## Paso 3: Conectar Frontend ↔ Backend

1. Abre el repo localmente
2. Edita: `tennis-frontend/src/environments/environment.prod.ts`
3. Reemplaza la URL:
   ```typescript
   export const environment = {
     production: true,
     API_URL: 'https://tennis-store-backend.onrender.com'  // ← TU URL DE RENDER
   };
   ```
4. Guarda y haz **commit & push**:
   ```bash
   git add .
   git commit -m "Update backend URL for production"
   git push
   ```
5. Vercel se actualizará automáticamente (2-5 minutos)

---

## Paso 4: BD (Elige una opción)

### Opción A: BD Local (Gratis pero requiere que esté corriendo)
- Mantén MySQL corriendo en tu máquina
- Las env vars en Render apuntarán a tu BD local
- **Problema**: si tu PC se apaga, el servidor no conecta a BD

### Opción B: Google Cloud SQL (Con créditos gratis)
- Crea BD en Google Cloud
- En Render, cambia:
  - `DB_HOST` = IP de GCP
  - `DB_PASSWORD` = contraseña de GCP
  - `DATABASE_URL` = (si es necesario)

---

## URLs Finales

Una vez listo:
- **Frontend**: https://tennis-frontend-xyz.vercel.app
- **Backend**: https://tennis-store-backend.onrender.com
- **BD**: Local o Cloud SQL

---

## Troubleshooting

### Backend no conecta a BD
- Verifica env vars en Render
- Asegúrate que BD está corriendo

### Frontend ve error en API
- Abre DevTools (F12) → Network → verifica URLs
- Confirma que `API_URL` en `environment.prod.ts` es correcta

### Cambios no aparecen
- Haz push al repo
- Espera a que Vercel/Render redepliegue (puedes ver el progreso en el dashboard)

---

**¿Listo para empezar?** Comienza con Vercel (Paso 1).
