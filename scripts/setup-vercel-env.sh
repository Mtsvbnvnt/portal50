#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Ejecuta este script después de instalar Vercel CLI: npm i -g vercel

echo "🚀 Configurando variables de entorno para Portal50+ en Vercel..."

# MongoDB Atlas
echo "📊 Configurando MongoDB Atlas..."
echo "mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/" | vercel env add MONGO_URL production
echo "mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/" | vercel env add MONGO_URL preview
echo "mongodb+srv://Vercel-Admin-portal50:JOu3jCDkYejXdKDd@portal50.dqvxnvv.mongodb.net/" | vercel env add MONGO_URL development

# Node Environment
echo "⚙️ Configurando NODE_ENV..."
echo "production" | vercel env add NODE_ENV production
echo "preview" | vercel env add NODE_ENV preview
echo "development" | vercel env add NODE_ENV development

# Port (opcional, Vercel maneja esto automáticamente)
echo "🌐 Configurando PORT..."
echo "3000" | vercel env add PORT production
echo "3000" | vercel env add PORT preview
echo "3000" | vercel env add PORT development

echo "✅ Variables de entorno configuradas exitosamente!"
echo ""
echo "📋 Variables configuradas:"
echo "   - MONGO_URL (Production, Preview, Development)"
echo "   - NODE_ENV (Production, Preview, Development)"
echo "   - PORT (Production, Preview, Development)"
echo ""
echo "🔄 Próximos pasos:"
echo "   1. Ejecuta: vercel --prod"
echo "   2. Verifica los logs en el dashboard de Vercel"
echo "   3. Busca el mensaje: '✅ Conectado a MongoDB - Acceso remoto habilitado'"
echo ""
echo "🌐 Dashboard: https://vercel.com/mtsvbnvnts-projects/portal50"