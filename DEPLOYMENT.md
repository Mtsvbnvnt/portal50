# Deployment Guide - Portal50+

## 🚀 Configuración Rápida para Vercel

### 1. Variables de Entorno Requeridas

Tu proyecto necesita estas variables de entorno en Vercel:

```bash
MONGO_URL=mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/
NODE_ENV=production
PORT=3000
```

### 2. Configuración Automática (Recomendado)

#### Opción A: Script PowerShell (Windows)
```powershell
cd scripts
.\setup-vercel-env.ps1
```

#### Opción B: Script Bash (Linux/Mac)
```bash
cd scripts
chmod +x setup-vercel-env.sh
./setup-vercel-env.sh
```

### 3. Configuración Manual

#### En el Dashboard de Vercel:

1. Ve a: https://vercel.com/mtsvbnvnts-projects/portal50
2. Settings → Environment Variables
3. Agrega cada variable:

| Name | Value | Environments |
|------|-------|-------------|
| `MONGO_URL` | `mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `NODE_ENV` | `preview` | Preview |
| `NODE_ENV` | `development` | Development |
| `PORT` | `3000` | All |

#### Usando Vercel CLI:

```bash
# Instalar CLI
npm i -g vercel

# Configurar variables
vercel env add MONGO_URL
# Pega: mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/

vercel env add NODE_ENV
# Escribe: production
```

### 4. Deploy

```bash
# Deploy automático desde Git
git push origin master

# O deploy manual
vercel --prod
```

### 5. Verificación

1. Ve a los **Function Logs** en Vercel
2. Busca el mensaje: `✅ Conectado a MongoDB - Acceso remoto habilitado`
3. Si ves errores, revisa la sección de troubleshooting

## 🔧 Troubleshooting

### Error: MongoServerSelectionError

**Problema**: No puede conectar a MongoDB Atlas
**Solución**: 
1. Ve a MongoDB Atlas → Network Access
2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Error: Authentication failed

**Problema**: Credenciales incorrectas
**Solución**: Verifica que la URL sea exactamente:
```
mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/
```

### Error: Function timeout

**Problema**: La función tarda mucho en responder
**Solución**: El `vercel.json` ya está configurado con `maxDuration: 30`

### Error: Cannot read properties of undefined

**Problema**: Variables de entorno no están disponibles
**Solución**: 
1. Verifica que las variables estén configuradas en Vercel
2. Redeploy el proyecto
3. Asegúrate de usar los nombres exactos: `MONGO_URL` (no `MONGODB_URI`)

## 📊 MongoDB Atlas Setup

### Configuración de Red

Asegúrate de que MongoDB Atlas permita conexiones desde Vercel:

1. **MongoDB Atlas Dashboard**
2. **Network Access** → **Add IP Address**
3. **Allow Access from Anywhere** (0.0.0.0/0)

### Base de Datos

Tu string de conexión apunta a:
- **Cluster**: portal50.dqvxnvv.mongodb.net
- **Usuario**: Vercel-Admin-portal50
- **Database**: (se detecta automáticamente desde los modelos)

## 🌐 URLs y Enlaces

- **Vercel Project**: https://vercel.com/mtsvbnvnts-projects/portal50
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Live App**: https://portal50-[hash].vercel.app (se genera automáticamente)

## 📝 Notas Importantes

1. **Seguridad**: Las credenciales están hardcoded por simplicidad. En producción, considera usar variables de entorno separadas.

2. **Performance**: La configuración de mongoose está optimizada para Vercel serverless.

3. **Monitoring**: Verifica los logs regularmente para detectar problemas de conexión.

4. **Backups**: MongoDB Atlas maneja backups automáticamente.

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel Functions
2. Verifica las variables de entorno
3. Confirma que MongoDB Atlas permita las conexiones
4. Revisa que el formato de la URL sea correcto