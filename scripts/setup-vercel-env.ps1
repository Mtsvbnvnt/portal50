# Script PowerShell para configurar variables de entorno en Vercel
# Ejecuta este script después de instalar Vercel CLI: npm i -g vercel

Write-Host "🚀 Configurando variables de entorno para Portal50+ en Vercel..." -ForegroundColor Green

# MongoDB Atlas
Write-Host "📊 Configurando MongoDB Atlas..." -ForegroundColor Yellow
$mongoUrl = "mongodb+srv://Vercel-Admin-portal50:pbSa6lVNj6f4SiYW@portal50.dqvxnvv.mongodb.net/?retryWrites=true&w=majority"

# Configurar para Production
Write-Host "Configurando MONGO_URL para Production..." -ForegroundColor Blue
echo $mongoUrl | vercel env add MONGO_URL production

# Configurar para Preview
Write-Host "Configurando MONGO_URL para Preview..." -ForegroundColor Blue
echo $mongoUrl | vercel env add MONGO_URL preview

# Configurar para Development
Write-Host "Configurando MONGO_URL para Development..." -ForegroundColor Blue
echo $mongoUrl | vercel env add MONGO_URL development

# Node Environment
Write-Host "⚙️ Configurando NODE_ENV..." -ForegroundColor Yellow

echo "production" | vercel env add NODE_ENV production
echo "preview" | vercel env add NODE_ENV preview
echo "development" | vercel env add NODE_ENV development

# Port
Write-Host "🌐 Configurando PORT..." -ForegroundColor Yellow

echo "3000" | vercel env add PORT production
echo "3000" | vercel env add PORT preview
echo "3000" | vercel env add PORT development

Write-Host ""
Write-Host "✅ Variables de entorno configuradas exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Variables configuradas:" -ForegroundColor Cyan
Write-Host "   - MONGO_URL (Production, Preview, Development)" -ForegroundColor White
Write-Host "   - NODE_ENV (Production, Preview, Development)" -ForegroundColor White
Write-Host "   - PORT (Production, Preview, Development)" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Ejecuta: vercel --prod" -ForegroundColor White
Write-Host "   2. Verifica los logs en el dashboard de Vercel" -ForegroundColor White
Write-Host "   3. Busca el mensaje: '✅ Conectado a MongoDB - Acceso remoto habilitado'" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Dashboard: https://vercel.com/mtsvbnvnts-projects/portal50" -ForegroundColor Cyan

# Opcional: Abrir el dashboard de Vercel
$response = Read-Host "¿Quieres abrir el dashboard de Vercel? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Start-Process "https://vercel.com/mtsvbnvnts-projects/portal50"
}