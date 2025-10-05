# Configuración de Vercel para Portal50+

## Variables de Entorno Requeridas

Para que tu proyecto funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

### 1. Base de Datos MongoDB Atlas

```bash
MONGO_URL=mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/
```

### 2. Firebase Configuration (si aplica)

```bash
FIREBASE_PROJECT_ID=portal50-81af7
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

### 3. Otras Variables

```bash
NODE_ENV=production
PORT=3000
```

## Pasos para Configurar en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a tu proyecto en Vercel: https://vercel.com/mtsvbnvnts-projects/portal50
2. Click en **Settings** en la navegación superior
3. Click en **Environment Variables** en el menú lateral
4. Agrega cada variable:
   - **Name**: `MONGO_URL`
   - **Value**: `mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/`
   - **Environments**: Selecciona `Production`, `Preview`, y `Development`
5. Click **Save**

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Configurar variables de entorno
vercel env add MONGO_URL production
# Pega la URL de MongoDB cuando te lo pida

vercel env add NODE_ENV production
# Escribe "production" cuando te lo pida
```

### Opción 3: Crear archivo .env en Vercel

En el root de tu proyecto, crea un archivo `.env` con:

```bash
MONGO_URL=mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/
NODE_ENV=production
```

## Verificación

Después de configurar las variables:

1. **Redeploy** tu proyecto en Vercel
2. Ve a los **Function Logs** para verificar que la conexión a MongoDB sea exitosa
3. Busca el mensaje: `✅ Conectado a MongoDB - Acceso remoto habilitado`

## Troubleshooting

### Error: "MongoServerSelectionError"
- Verifica que la IP de Vercel esté whitelisted en MongoDB Atlas
- Ve a MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Error: "Authentication failed"
- Verifica que las credenciales en la URL sean correctas
- Username: `Vercel-Admin-portal50`
- Password: `JOu3jCDkYejXdKDd`

### Error: "Function timeout"
- Aumenta el timeout en vercel.json si es necesario
- Verifica que la configuración de mongoose sea optimizada para serverless

## Configuración Adicional

### vercel.json (si no existe)

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### MongoDB Atlas Network Access

Asegúrate de que MongoDB Atlas permita conexiones desde Vercel:

1. Ve a MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. O agrega las IPs específicas de Vercel si las conoces

## URLs y Enlaces

- **Proyecto Vercel**: https://vercel.com/mtsvbnvnts-projects/portal50
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Documentación Vercel**: https://vercel.com/docs/environment-variables