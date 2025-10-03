# 🌐 Guía de Configuración para Acceso Externo

## 📋 Requisitos Previos
- Node.js 18+ instalado
- MongoDB accesible (local o en la nube)
- Firebase proyecto configurado
- Red local configurada

## 🔧 Pasos para Configurar Acceso Externo

### 1. **Configurar Base de Datos**

#### MongoDB Local:
```bash
# Editar archivo de configuración de MongoDB
# Windows: C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg
# Linux/Mac: /etc/mongod.conf

# Cambiar bindIp para permitir conexiones externas:
net:
  port: 27017
  bindIp: 0.0.0.0  # Permitir conexiones desde cualquier IP
  # bindIp: 192.168.1.100  # O especificar IP específica
```

#### MongoDB Atlas (Recomendado):
1. Ir a MongoDB Atlas
2. Network Access → Add IP Address
3. Agregar `0.0.0.0/0` (todas las IPs) o IPs específicas
4. Copiar string de conexión a `.env`

### 2. **Configurar Backend**

```bash
# En Backend_Portal50/.env
PORT=3001
HOST=0.0.0.0
MONGO_URL=mongodb://localhost:27017/portal50
# O para Atlas: mongodb+srv://user:pass@cluster.mongodb.net/portal50
```

### 3. **Configurar Frontend**

```bash
# En Frontend_Portal50/.env (opcional)
# Si no se especifica, se detecta automáticamente
VITE_API_URL=http://192.168.1.100:3001
```

### 4. **Configurar Firewall**

#### Windows:
```powershell
# Permitir puertos en Windows Firewall
netsh advfirewall firewall add rule name="Portal50 Backend" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Portal50 Frontend" dir=in action=allow protocol=TCP localport=5173
```

#### Linux/Mac:
```bash
# Usando ufw (Ubuntu)
sudo ufw allow 3001
sudo ufw allow 5173

# O usando iptables
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT
```

### 5. **Configurar Router/Red**

1. **Port Forwarding** (para acceso desde internet):
   - Backend: Puerto 3001 → IP local
   - Frontend: Puerto 5173 → IP local

2. **Red Local** (para acceso LAN):
   - No requiere port forwarding
   - Usar IP local: `192.168.1.x`

## 🚀 Iniciar Servicios

### Backend:
```bash
cd Backend_Portal50
npm install
npm run dev
# El servidor mostrará todas las IPs disponibles
```

### Frontend:
```bash
cd Frontend_Portal50
npm install
npm run dev -- --host 0.0.0.0
# Accesible desde cualquier IP en la red
```

## 🔍 Verificar Configuración

### 1. **Verificar Backend:**
```bash
# Desde otra máquina en la red:
curl http://192.168.1.100:3001/ping
# Debería responder: {"status":"OK","timestamp":"..."}
```

### 2. **Verificar Frontend:**
```
# Abrir navegador en otra máquina:
http://192.168.1.100:5173
```

### 3. **Verificar Base de Datos:**
```bash
# Verificar conexión MongoDB
mongosh "mongodb://192.168.1.100:27017/portal50"
```

## 🌐 URLs de Acceso

| Servicio | Local | Red Local | Internet |
|----------|-------|-----------|----------|
| Frontend | http://localhost:5173 | http://192.168.1.x:5173 | http://tu-ip-publica:5173 |
| Backend | http://localhost:3001 | http://192.168.1.x:3001 | http://tu-ip-publica:3001 |
| API Docs | http://localhost:3001/api/docs | http://192.168.1.x:3001/api/docs | http://tu-ip-publica:3001/api/docs |

## ⚠️ Consideraciones de Seguridad

### Para Producción:
1. **Firewall**: Configurar reglas específicas
2. **HTTPS**: Usar certificados SSL/TLS
3. **CORS**: Restringir orígenes permitidos
4. **Variables de entorno**: No exponer credenciales
5. **MongoDB**: Usar autenticación y encriptación
6. **Rate Limiting**: Implementar límites de peticiones

### Para Desarrollo:
- Las configuraciones actuales son para desarrollo
- No usar `0.0.0.0` en producción sin medidas adicionales
- Cambiar credenciales por defecto

## 🛠️ Troubleshooting

### Error de Conexión Backend:
1. Verificar que el puerto 3001 esté disponible: `netstat -an | findstr 3001`
2. Verificar firewall
3. Verificar IP correcta: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)

### Error de Conexión Base de Datos:
1. Verificar string de conexión en `.env`
2. Verificar que MongoDB esté corriendo
3. Verificar configuración de red de MongoDB

### Error CORS:
1. Verificar configuración en `index.ts`
2. Agregar IP/dominio específico si es necesario

## 📱 Acceso desde Móviles

Para acceder desde dispositivos móviles en la misma red:
1. Conectar móvil a la misma WiFi
2. Usar IP local: `http://192.168.1.x:5173`
3. Asegurar que el firewall permita conexiones

## 🔄 Actualizaciones Automáticas

El frontend detecta automáticamente la IP y configura el backend correspondientemente. Si hay problemas:

1. Forzar IP en `.env`: `VITE_API_URL=http://tu-ip:3001`
2. Reiniciar servicios
3. Limpiar caché del navegador